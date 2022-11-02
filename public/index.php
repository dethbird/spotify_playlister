<?php

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors',1);
define("APPLICATION_PATH", __DIR__ . "/../");
date_default_timezone_set('America/New_York');
session_cache_limiter(false);
session_start();

# Ensure src/ is on include_path
set_include_path(implode(PATH_SEPARATOR,[
    APPLICATION_PATH ,
    get_include_path(),
]));

require '../vendor/autoload.php';

require APPLICATION_PATH . 'lib/redbeans/rb-mysql.php';
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;
use Slim\Factory\AppFactory;
use Symfony\Component\Yaml\Yaml;


# read config
$config = Yaml::parseFile(APPLICATION_PATH . 'config.yml');

# intialize db connector
R::setup( 'mysql:host='.$config['mysql']['host'].';dbname='.$config['mysql']['database'],
    $config['mysql']['username'], $config['mysql']['password'] );
R::freeze( true );

# initialize spotify client
$spotifyConnect = new SpotifyWebAPI\Session(
    $config['spotify']['client_id'],
    $config['spotify']['client_secret'],
    'https://'.$_SERVER['HTTP_HOST'].'/callback'
);
$spotifyApi = new SpotifyWebAPI\SpotifyWebAPI();
if (isset($_SESSION['SPOTIFY_ACCESS_TOKEN'])) {
    $spotifyApi->setAccessToken($_SESSION['SPOTIFY_ACCESS_TOKEN']);
}

// var_dump('https://'.$_SERVER['HTTP_HOST'].'/callback'); die();
# create app
$app = AppFactory::create();
$twig = Twig::create('../views',
    ['cache' => false]);

# add Twig-View Middleware
$app->add(TwigMiddleware::create($app, $twig));

# ROUTES

# callback
$app->get('/callback', function (Request $request, Response $response, $args) use ($spotifyConnect, $spotifyApi) {

    # check for error
    if (isset($_GET['error'])) {
        header('Location: /');
    }

    # verify state
    if (isset($_SESSION['SPOTIFY_STATE']) && isset($_GET['state'])) {
        if ($_SESSION['SPOTIFY_STATE'] !== $_GET['state']) {
            header('Location: /');
        }
    }
    
    # get access token and put in session
    $spotifyConnect->requestAccessToken($_GET['code']);
    $_SESSION['SPOTIFY_ACCESS_TOKEN'] = $spotifyConnect->getAccessToken();
    $_SESSION['SPOTIFY_REFRESH_TOKEN']= $spotifyConnect->getRefreshToken();

    # create user if not in db
    $spotifyApi->setAccessToken($_SESSION['SPOTIFY_ACCESS_TOKEN']);
    $me = $spotifyApi->me();

    $users = R::find(
        'user', ' spotify_user_id = ?', [ $me->id ] );

    if (count($users) == 0){
        $user = R::dispense( 'user' );
        $user->spotify_user_id = $me->id;
        $id = R::store( $user );
    }

    # redirect to home
    header('Location: /');
    
})->setName('callback');

# logout
$app->get('/logout', function (Request $request, Response $response, $args) {

    unset($_SESSION['SPOTIFY_ACCESS_TOKEN']);
    unset($_SESSION['SPOTIFY_REFRESH_TOKEN']);

    # redirect to home
    header('Location: /');

    
})->setName('logout');

# index
$app->get('/', function (Request $request, Response $response, $args) use ($spotifyConnect, $spotifyApi, $config) {

    $view = Twig::fromRequest($request);
    $spotify_user = null;
    $user = null;
    if (!isset($_SESSION['SPOTIFY_ACCESS_TOKEN'])) {
        $_SESSION['SPOTIFY_STATE'] = $spotifyConnect->generateState();
        return $view->render($response, 'login.html', [
            'login_url' => $spotifyConnect->getAuthorizeUrl([
                'scope' => $config['spotify']['scopes'],
                'state' => $_SESSION['SPOTIFY_STATE']
            ])
        ]);
    } else {
        $spotify_user = $spotifyApi->me();
        $users = R::find(
            'user', ' spotify_user_id = ?', [ $spotify_user->id ] );
        $user = $users[1];
    }
    return $view->render($response, 'index.html', [
        'spotify_user_json' => json_encode($spotify_user),
        'user_json' => json_encode($user),
    ]);
})->setName('index');

$app->run();

R::close();
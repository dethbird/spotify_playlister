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

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;
use Slim\Factory\AppFactory;
use Symfony\Component\Yaml\Yaml;


# read config
$config = Yaml::parseFile(APPLICATION_PATH . 'config.yml');

# initialize spotify client
$spotifyClient = new SpotifyWebAPI\Session(
    $config['spotify']['client_id'],
    $config['spotify']['client_secret'],
    $_SERVER['SCRIPT_URI'].'callback'
);

# create app
$app = AppFactory::create();
$twig = Twig::create('../views',
    ['cache' => false]);

# add Twig-View Middleware
$app->add(TwigMiddleware::create($app, $twig));

# ROUTES


# callback
$app->get('/callback', function (Request $request, Response $response, $args) use ($spotifyClient, $config) {

    if (isset($_GET['error'])) {
        header('Location: /');
    }

    $view = Twig::fromRequest($request);
    
    # verify state

    # get access token and put in session

    # create user if not in db 

    # redirect to home

    
})->setName('callback');

# index
$app->get('/', function (Request $request, Response $response, $args) use ($spotifyClient, $config) {

    $view = Twig::fromRequest($request);

    if (!isset($_SESSION['SPOTIFY_ACCESS_TOKEN'])) {
        $_SESSION['SPOTIFY_STATE'] = $spotifyClient->generateState();
        return $view->render($response, 'login.html', [
            'login_url' => $spotifyClient->getAuthorizeUrl([
                'scope' => $config['spotify']['scopes'],
                'state' => $_SESSION['SPOTIFY_STATE']
            ])
        ]);
    }
    return $view->render($response, 'index.html', [
        'prompt' => 'pizza'
    ]);
})->setName('index');

$app->run();
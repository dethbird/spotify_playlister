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
use Slim\Routing\RouteCollectorProxy;
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

# create app
$app = AppFactory::create();
$twig = Twig::create('../views',
    ['cache' => false]);

# add Twig-View Middleware
$app->add(TwigMiddleware::create($app, $twig));

function performLogout() {
    unset($_SESSION['SPOTIFY_ACCESS_TOKEN']);
    unset($_SESSION['SPOTIFY_REFRESH_TOKEN']);
    unset($_SESSION['SPOTIFY_USER_ID']);
}

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
    $_SESSION['SPOTIFY_USER_ID'] = $me->id;

    $users = array_values(R::find(
        'user', ' spotify_user_id = ?', [ $me->id ] ));
    
    if (count($users) == 0){
        $user = R::dispense( 'user' );
        $user->spotify_user_id = $me->id;
        $_SESSION['USER_ID'] = R::store( $user );
    } else {
        $_SESSION['USER_ID'] = $users[0]->id;
    }

    # redirect to home
    header('Location: /');
    
})->setName('callback');

# logout
$app->get('/logout', function (Request $request, Response $response, $args) {

    performLogout();
    # redirect to home
    header('Location: /');

    
})->setName('logout');

# index
$app->get('/', function (Request $request, Response $response, $args) use ($spotifyConnect, $spotifyApi, $config) {

    $view = Twig::fromRequest($request);
    $spotify_user = null;
    $user = null;
    $login_url = null;
    if (!isset($_SESSION['SPOTIFY_ACCESS_TOKEN'])) {
        $_SESSION['SPOTIFY_STATE'] = $spotifyConnect->generateState();
        $login_url = $spotifyConnect->getAuthorizeUrl([
            'scope' => $config['spotify']['scopes'],
            'state' => $_SESSION['SPOTIFY_STATE']
        ]);
    } else {
        try {
            $spotify_user = $spotifyApi->me();
            $users = array_values(R::find(
                'user', ' spotify_user_id = ? LIMIT 1', [ $spotify_user->id ] ));
            $user = $users[0];
            
        } catch (Exception $e) {
            performLogout();
            header('Location: /');
            # noop
        }
    }
    return $view->render($response, 'index.html', [
        'spotify_user_json' => json_encode($spotify_user),
        'user_json' => json_encode($user),
        'login_url' => $login_url
    ]);
})->setName('index');

$app->group('/api', function (RouteCollectorProxy $group) use ($spotifyApi, $app) {
    $group->group('/v1', function (RouteCollectorProxy $group) use ($spotifyApi, $app) {
        $group->group('/me', function (RouteCollectorProxy $group) use ($spotifyApi, $app) {
            $group->get('/playlists', function (Request $request, Response $response, $args) use ($spotifyApi, $app) {
                $response->getBody()->write(json_encode($spotifyApi->getMyPlaylists([
                    'limit' => (int)$_GET['limit'],
                    'offset' => (int)$_GET['offset']
                ])));
                return $response->withHeader('Content-type', 'application/json');
            })->setName('getPlaylists');
            $group->group('/player', function (RouteCollectorProxy $group) use ($spotifyApi, $app) {
                $group->get('/currently-playing', function (Request $request, Response $response, $args) use ($spotifyApi, $app) {
                    $response->getBody()->write(json_encode($spotifyApi->getMyCurrentPlaybackInfo()));
                    return $response->withHeader('Content-type', 'application/json');
                })->setName('currentlyPlaying');
            });
            $group->delete('/tracks', function (Request $request, Response $response, $args) use ($spotifyApi, $app) {
                $response->getBody()->write(json_encode($spotifyApi->deleteMyTracks(explode(",", $_GET['ids']))));
                return $response->withHeader('Content-type', 'application/json');
            })->setName('trackUnlike');
            $group->put('/tracks', function (Request $request, Response $response, $args) use ($spotifyApi, $app) {
                $response->getBody()->write(json_encode($spotifyApi->addMyTracks(explode(",", $_GET['ids']))));
                return $response->withHeader('Content-type', 'application/json');
            })->setName('trackLike');
            $group->group('/tracks', function (RouteCollectorProxy $group) use ($spotifyApi, $app) {
                $group->get('/contains', function (Request $request, Response $response, $args) use ($spotifyApi, $app) {
                    $response->getBody()->write(json_encode($spotifyApi->myTracksContains(explode(",", $_GET['ids']))));
                    return $response->withHeader('Content-type', 'application/json');
                })->setName('trackIsLiked');
            });
        });
    });
    $group->group('/app', function (RouteCollectorProxy $group) use ($app) {
        $group->get('/playlists', function (Request $request, Response $response, $args) use ($app) {
            $playlists = R::find(
                'playlist', ' user_id = ?', [ $_SESSION['USER_ID'] ] );
            $response->getBody()->write(json_encode($playlists));
            return $response->withHeader('Content-type', 'application/json');
        })->setName('userPlaylists');
        $group->put('/playlist', function (Request $request, Response $response, $args) use ($app) {
            $payload = json_decode($request->getBody()->getContents());
            $playlist = null;
            $playlists = array_values(R::find(
                'playlist', ' spotify_playlist_id = ? LIMIT 1', [ $payload->playlistId ] ));
            if (count($playlists)>0) {
                $playlist = $playlists[0];
            } else {
                $user_playlist = R::dispense( 'playlist' );
                $user_playlist->spotify_playlist_id = $payload->playlistId;
                $user_playlist->user_id = $_SESSION['USER_ID'];
                $new_playlist_id = R::store( $user_playlist );
                $playlist = R::load('playlist', $new_playlist_id);
            }
            $response->getBody()->write(json_encode($playlist));
            return $response->withHeader('Content-type', 'application/json');
        })->setName('addUserPlaylist');
    });
});



$app->run();

R::close();
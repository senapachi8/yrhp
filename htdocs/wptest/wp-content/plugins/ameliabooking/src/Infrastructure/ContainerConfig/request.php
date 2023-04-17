<?php

use Slim\Http\Request;
use Slim\Http\Uri;

$entries['request'] = function (AmeliaBooking\Infrastructure\Common\Container $c) {

    $curUri = Uri::createFromEnvironment($c->get('environment'));

    // fix callback url for Razorpay payment through link since Razorpay encodes callback urls
    $newRoute = str_replace(
        '__payments__callback',
        '/payments/callback',
        $curUri->getQuery()
    );

    // fix callback url for whatsapp webhooks
    $newRoute = str_replace(
        '__notifications__whatsapp__webhook',
        '/notifications/whatsapp/webhook',
        $newRoute
    );

    $newRoute = str_replace(
        ['XDEBUG_SESSION_START=PHPSTORM&' . AMELIA_ACTION_SLUG, AMELIA_ACTION_SLUG],
        '',
        $newRoute
    );

    $newPath = strpos($newRoute, '&') ? substr(
        $newRoute,
        0,
        strpos($newRoute, '&')
    ) : $newRoute;

    $newQuery = strpos($newRoute, '&') ? substr(
        $newRoute,
        strpos($newRoute, '&') + 1
    ) : '';

    return Request::createFromEnvironment($c->get('environment'))
       ->withUri(
           $curUri
               ->withPath($newPath)
               ->withQuery($newQuery)
       );
};

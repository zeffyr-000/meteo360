<?php

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self';");

// On OVH (PHP-FPM via mod_proxy_fcgi), the `/api/...` routes are rewritten to
// `/index.php` with the original path carried by a custom Apache env variable
// (set through `[E=MTO_PATH_INFO:/api/...]` in www/.htaccess). Apache prefixes
// env vars with REDIRECT_ on each rewrite pass, so the value can surface as
// REDIRECT_MTO_PATH_INFO or REDIRECT_REDIRECT_MTO_PATH_INFO depending on how
// many passes happened. Scan $_SERVER and normalise the value back to
// PATH_INFO so jClassicRequest can pick it up exactly as in a direct
// /index.php/api/... access.
if (empty($_SERVER['PATH_INFO'])) {
    foreach ($_SERVER as $key => $value) {
        if (
            preg_match('/^(REDIRECT_)*MTO_PATH_INFO$/', $key) === 1
            && is_string($value)
            && $value !== ''
            && strpos($value, '/api') === 0
        ) {
            $_SERVER['PATH_INFO'] = $value;
            break;
        }
    }
}

global $l_StartTime;
$l_Time = microtime();
$l_Time = explode(' ', $l_Time);
$l_StartTime = $l_Time[1] + $l_Time[0];

require __DIR__ . '/../application.init.php';
require JELIX_LIB_CORE_PATH . 'request/jClassicRequest.class.php';

checkAppOpened();

jApp::loadConfig('index/config.ini.php');
jApp::setCoord(new jCoordinator());
jApp::coord()->process(new jClassicRequest());

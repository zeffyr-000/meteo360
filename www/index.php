<?php

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self';");

// On OVH (PHP-FPM via mod_proxy_fcgi), the `/api/...` routes are rewritten to
// `/index.php` by www/.htaccess. PHP-FPM does not receive PATH_INFO from that
// rewrite, so we reconstruct it here before jClassicRequest is instantiated.
//
// Primary source: REDIRECT_URL — Apache's standard CGI variable that is always
// set to the pre-rewrite URI during an internal redirect and is reliably
// forwarded to PHP-FPM by mod_proxy_fcgi.
//
// Fallback: the custom MTO_PATH_INFO env var injected via [E=MTO_PATH_INFO:...]
// in .htaccess. Apache prefixes env vars with REDIRECT_ on each rewrite pass,
// so the value can surface as REDIRECT_MTO_PATH_INFO or
// REDIRECT_REDIRECT_MTO_PATH_INFO depending on how many passes happened.
if (empty($_SERVER['PATH_INFO'])) {
    // Primary: REDIRECT_URL (standard Apache variable, always forwarded to FPM)
    if (!empty($_SERVER['REDIRECT_URL']) && is_string($_SERVER['REDIRECT_URL'])) {
        $redirectPath = parse_url($_SERVER['REDIRECT_URL'], PHP_URL_PATH);
        if (is_string($redirectPath) && strpos($redirectPath, '/api') === 0) {
            $_SERVER['PATH_INFO'] = $redirectPath;
        }
    }
    // Fallback: custom MTO_PATH_INFO env var
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

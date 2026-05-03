<?php

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self';");

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

<?php

$appPath = __DIR__ . DIRECTORY_SEPARATOR;
$jelixVendor = $appPath . '..' . DIRECTORY_SEPARATOR . 'jelix' . DIRECTORY_SEPARATOR . 'lib1.7' . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR;

if (!file_exists($jelixVendor . 'autoload.php')) {
    throw new RuntimeException('Jelix 1.7 is required at ../jelix/lib1.7/vendor/autoload.php');
}

require $jelixVendor . 'autoload.php';

if (file_exists($appPath . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php')) {
    require $appPath . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';
}

jApp::initPaths($appPath);

$tempPath = $appPath . '..' . DIRECTORY_SEPARATOR . 'jelix' . DIRECTORY_SEPARATOR . 'temp' . DIRECTORY_SEPARATOR . 'meteo360' . DIRECTORY_SEPARATOR;
if (!is_dir($tempPath) && !mkdir($tempPath, 0775, true) && !is_dir($tempPath)) {
    throw new RuntimeException('Unable to create Jelix temp directory at ' . $tempPath);
}

$resolvedTempPath = realpath($tempPath);
if ($resolvedTempPath === false) {
    throw new RuntimeException('Unable to resolve Jelix temp directory at ' . $tempPath);
}

jApp::setTempBasePath($resolvedTempPath . DIRECTORY_SEPARATOR);

require $jelixVendor . 'jelix_app_path.php';

jApp::declareModulesDir(array(
    __DIR__ . '/modules/'
));

jApp::declarePluginsDir(array(
    __DIR__ . '/plugins'
));

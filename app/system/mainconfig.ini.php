;<?php die(''); ?>

locale=fr_FR
charset=UTF-8
timeZone="Europe/Paris"
theme=default

[modules]
commun.enabled=on

jelix.installparam[wwwfiles]=vhost
[wwwfiles]

[coordplugins]

[jResponseHtml]

[error_handling]
quietMessage="Une erreur technique est survenue. Desole pour ce desagrement."

[logger]
_all=memory
default=file
error=file
warning=file
notice=file
deprecated=file
strict=file
debug=file

[compilation]
checkCacheFiletime=on
force=off

[urlengine]
engine=significant
jelixWWWPath="data/jelix/"
enableParser=on
multiview=off
basePath=""
defaultEntrypoint=index
entrypointExtension=.php
simple_urlengine_https=
notfoundAct=

[simple_urlengine_entrypoints]
index="@classic"
xmlrpc="@xmlrpc"
jsonrpc="@jsonrpc"
rdf="@rdf"

[logfiles]
default=messages.log
error=errors.log
warning=errors.log
notice=errors.log
deprecated=errors.log
strict=errors.log
debug=debug.log

[mailer]
webmasterEmail="contact@meteo360.fr"
webmasterName="Meteo360"
mailerType=mail
hostname=
sendmailPath="/usr/sbin/sendmail"
smtpHost=localhost
smtpPort=25
smtpHelo=
smtpAuth=off
smtpUsername=
smtpPassword=
smtpTimeout=10

[sessions]
cookieExpires=0
cookieHttpOnly=on
cookieSecure=off
storage=files
files_path="app:var/sessions/"
shared_session=on

<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

echo $headers['Accept']=='*/*'?'ok':'error';
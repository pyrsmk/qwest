<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

header('Content-Type: application/json');
echo json_encode(array(
	'status' => $_POST[0]==1 &&  $_POST[1]==2 &&  $_POST[2]==3?'ok':'error',
	'debug' => array(
		'$_POST' => $_POST
	)
));
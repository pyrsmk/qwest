<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

header('Content-Type: application/json');
echo json_encode(array(
	'status' => file_get_contents('php://input')=='test'?'ok':'error',
	'debug' => array(
		'php://input' => file_get_contents('php://input')
	)
));
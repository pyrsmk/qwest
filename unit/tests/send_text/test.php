<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

echo json_encode(array(
	'status' => ($headers['Content-Type']=='*/*' && file_get_contents('php://input')=='text')?'ok':'error',
	'debug' => array(
		'Content-Type' => $headers['Content-Type'],
		'php://input' => file_get_contents('php://input')
	)
));
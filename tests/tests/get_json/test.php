<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

header('Content-Type: application/json');
echo json_encode(array(
	'status' => $headers['Accept']=='application/json'?'ok':'error',
	'debug' => array(
		'Accept' => $headers['Accept']
	)
));
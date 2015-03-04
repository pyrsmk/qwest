<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

header('Content-Type: application/json');
echo json_encode(array(
	'status' => strpos($headers['Accept'],'application/json')===0?'ok':'error',
	'debug' => array(
		'Accept' => $headers['Accept']
	)
));
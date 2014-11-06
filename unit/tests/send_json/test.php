<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

$data=json_decode(file_get_contents('php://input'));

echo json_encode(array(
	'status' => ($headers['Content-Type']=='application/json' && $data->foo=='bar' && $data->bar[0]->foo=='bar')?'ok':'error',
	'debug' => array(
		'Content-Type' => $headers['Content-Type'],
		'php://input' => file_get_contents('php://input')
	)
));
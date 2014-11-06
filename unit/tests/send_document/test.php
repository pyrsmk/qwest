<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

echo json_encode(array(
	'status' => strpos(file_get_contents('php://input'),'<!DOCTYPE')===0?'ok':'error',
	'debug' => array(
		'php://input' => file_get_contents('php://input')
	)
));
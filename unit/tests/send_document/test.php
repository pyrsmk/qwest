<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

echo json_encode(array(
	'status' => is_int(strpos(file_get_contents('php://input'),'<!DOCTYPE'))?'ok':'error',
	'debug' => array(
		'php://input' => strpos(file_get_contents('php://input'),'<!DOCTYPE')
	)
));
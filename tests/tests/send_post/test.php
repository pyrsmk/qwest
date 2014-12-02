<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

header('Content-Type: application/json');
echo json_encode(array(
	'status' => (strpos($headers['Content-Type'],'application/x-www-form-urlencoded')===0 && $_POST['foo']=='bar' && $_POST['bar'][0]['foo']=='bar')?'ok':'error',
	'debug' => array(
		'Content-Type' => $headers['Content-Type'],
		'$_POST' => $_POST
	)
));
<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

echo json_encode(array(
	'status' => ($headers['Content-Type']=='application/x-www-form-urlencoded' && $_POST['foo']=='bar' && $_POST['bar'][0]['foo']=='bar')?'ok':'error',
	'debug' => array(
		'Content-Type' => $headers['Content-Type'],
		'$_POST' => $_POST
	)
));
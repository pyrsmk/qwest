<?php

ini_set('display_errors',0);

header('Content-Type: application/json');
echo json_encode(array(
	'status' => $_SERVER['REQUEST_METHOD']==$_GET['method']?'ok':'error',
	'debug' => array(
		'REQUEST_METHOD' => $_SERVER['REQUEST_METHOD'],
		'method' => $_GET['method']
	)
));
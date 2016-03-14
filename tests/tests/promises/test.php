<?php

ini_set('display_errors',0);

header('Content-Type: application/json');

usleep(rand(100, 1000) * 1000);

echo json_encode(array(
	'status' => 'ok',
	'response' => $_SERVER['REQUEST_METHOD']
));

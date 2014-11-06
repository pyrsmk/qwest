<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

echo json_encode(array(
	'status' => $headers['X-Running-Test']=='before'?'ok':'error',
	'debug' => array(
		'X-Running-Test' => $headers['X-Running-Test']
	)
));
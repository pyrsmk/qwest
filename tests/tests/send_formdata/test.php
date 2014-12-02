<?php

ini_set('display_errors',0);

$headers=apache_request_headers();

header('Content-Type: application/json');
echo json_encode(array(
	'status' => ($_POST['firstname']=='Pedro' && $_POST['lastname']=='Sanchez')?'ok':'error',
	'debug' => array(
		'$_POST' => $_POST
	)
));
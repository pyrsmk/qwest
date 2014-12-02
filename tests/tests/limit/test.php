<?php

ini_set('display_errors',0);

header('Content-Type: application/json');
echo json_encode(array(
	'status' => 'ok',
	'debug' => new Stdclass
));
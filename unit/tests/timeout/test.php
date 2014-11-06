<?php

ini_set('display_errors',0);

time_sleep_until(microtime(true)+0.4);

echo json_encode(array(
	'status' => 'ok'
));
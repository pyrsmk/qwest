<?php

ini_set('display_errors',0);

header('Content-Type: image/jpeg');

echo file_get_contents('img.jpg');
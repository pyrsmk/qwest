<?php

ini_set('display_errors',0);

header('Content-Type: image/jpeg');
header('Content-Length: '.filesize('img.jpg'));
readfile('img.jpg');
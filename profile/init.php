<?php

session_start();

if (!$_SESSION['auth'])
    header('Location:/');

require_once __DIR__ . '/../assets/php/lib.php';
$Data = file_get_contents(__DIR__ . '/../assets/php/data.json');
$Data_php = json_decode($Data, 1);

$categories = array_filter($Data_php['rubrics'], function ($item){
    return $item['id'] != 5;
});
$publications = array_filter($Data_php['publications'], function ($item){
    return $item['user_id'] == $_SESSION['auth']['id'] && $item['category'] != 5;
});



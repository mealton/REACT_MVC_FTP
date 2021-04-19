<?php

/**
 * @var $title string
 */
?>

<!doctype html>
<html lang="en">
<head>
    <base href="http://mvc.mealton.ru">
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="http://react.mealton.ru/assets/vendor/bootstrap/bootstrap.min.css">

    <link rel="shortcut icon" href="https://miro.medium.com/max/1200/1*K-4RqDC6zFrpAG31ayDDOg.png" type="image/x-icon">

    <link rel="stylesheet" href="http://react.mealton.ru/assets/css/index.css">

    <script crossorigin src="http://react.mealton.ru/assets/vendor/react/react.development.js"></script>
    <script crossorigin src="http://react.mealton.ru/assets/vendor/react/react-dom.development.js"></script>
    <script crossorigin src="http://react.mealton.ru/assets/vendor/babel/babel.min.js"></script>

    <script src="http://react.mealton.ru/assets/vendor/font-awesome/fee87cbaad.js" crossorigin="anonymous"></script>


    <?php require_once __DIR__ . '/assets/php/init.php'; ?>
    <title><?= $title ?></title>

</head>
<body>

<div id="app"></div>

<script src="http://react.mealton.ru/assets/js/lib.js"></script>


<script type="text/babel">
    <?php foreach (array_slice(scandir(__DIR__ . '/assets/js/components/'), 2) as $component)
        echo file_get_contents(__DIR__ . '/assets/js/components/' . $component);
     ?>
</script>

<script type="text/babel" src="http://react.mealton.ru/assets/js/index.js"></script>

</body>
</html>

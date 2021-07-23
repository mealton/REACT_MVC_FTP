<?php require_once __DIR__ . '/init.php'; ?>
<!doctype html>
<html lang="en">
<head>
    <base href="http://mvc.mealton.ru">
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="http://react.mealton.ru/assets/vendor/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="http://react.mealton.ru/assets/css/index.css">
    <link rel="icon" href="http://react.mealton.ru/assets/img/favicon.svg" type="image/x-icon">
    <script src="http://react.mealton.ru/assets/vendor/font-awesome/fee87cbaad.js" crossorigin="anonymous"></script>
    <title>Кабинет пользователя</title>
</head>
<body>

<div id="app">

    <div id="app" class="profile">
        <div class="main-div">
            <?php include_once __DIR__ . '/components/header.php'?>
            <div class="container-fluid">
                <main>
                    <?php include_once __DIR__ . '/components/aside.php'?>
                    <div class="publication import">
                        <?php include_once __DIR__ . '/components/import.php'?>
                        <hr>
                        <?php include_once __DIR__ . '/components/insert.php'?>
                    </div>
                </main>
            </div>
            <div id="lift"></div>
            <!--<div class="modal">
                <div id="modal-inner"></div>
            </div>-->
        </div>
    </div>

</div>

<script>
    let Data = <?= $Data ?>;
</script>

<script src="http://react.mealton.ru/assets/vendor/jquery/jquery.min.js"></script>
<script src="http://react.mealton.ru/assets/vendor/jquery/jquery.jrumble.1.3.min.js"></script>

<script src="http://react.mealton.ru/assets/js/lib.js"></script>
<script src="http://react.mealton.ru/assets/js/cookie.js"></script>

<script src="http://react.mealton.ru/profile/profile.js"></script>

</body>
</html>

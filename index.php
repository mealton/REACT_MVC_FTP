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

    <meta name="yandex-verification" content="c9da4b6dc9a50ce7" />

    <script crossorigin src="http://react.mealton.ru/assets/vendor/react/react.development.js"></script>
    <script crossorigin src="http://react.mealton.ru/assets/vendor/react/react-dom.development.js"></script>
    <script crossorigin src="http://react.mealton.ru/assets/vendor/babel/babel.min.js"></script>

    <script src="http://react.mealton.ru/assets/vendor/font-awesome/fee87cbaad.js" crossorigin="anonymous"></script>


    <?php require_once __DIR__ . '/assets/php/init.php'; ?>
    <title><?= $title ?></title>

    <!-- Yandex.Metrika counter -->
    <script type="text/javascript" >
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(76319608, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true
        });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/76319608" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->

</head>
<body>

<div id="app"></div>

<script src="http://react.mealton.ru/assets/js/lib.js"></script>
<script src="http://react.mealton.ru/assets/js/cookie.js"></script>


<script type="text/babel">
    <?php foreach (array_slice(scandir(__DIR__ . '/assets/js/components/'), 2) as $component)
        echo file_get_contents(__DIR__ . '/assets/js/components/' . $component);
     ?>
</script>

<script type="text/babel" src="http://react.mealton.ru/assets/js/index.js"></script>

</body>
</html>

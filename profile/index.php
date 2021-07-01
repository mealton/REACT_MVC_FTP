<?php

require_once __DIR__ . '/../assets/php/lib.php';
$Data = file_get_contents(__DIR__ . '/../assets/php/data.json');
$Data_php = json_decode($Data, 1);

$categories = $Data_php['rubrics'];
$popular = $Data_php['popular'];


session_start();

if (!$_SESSION['auth'])
    header('Location:/');

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
    <link rel="stylesheet" href="http://react.mealton.ru/assets/css/index.css">
    <link rel="icon" href="http://react.mealton.ru/assets/img/favicon.svg" type="image/x-icon">
    <script src="http://react.mealton.ru/assets/vendor/font-awesome/fee87cbaad.js" crossorigin="anonymous"></script>
    <title>Кабинет пользователя</title>
</head>
<body>

<div id="app">


    <div id="app" class="profile">
        <div class="main-div">
            <header>
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <span id="auth">
                        <span class="logout">
                            <img src="<?= $_SESSION['auth']['profile_image'] ?>" id="profile_image" alt="#">
                        </span>
                    </span>
                    <a class="navbar-brand pointer">Главная</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav">
                            <?php foreach ((array)$categories as $category): ?>
                                <a href="http://react.mealton.ru/category/<?= $category['id'] . '/' . $category['rubric_url_name'] ?>.html"
                                   class="nav-item nav-link">
                                    <?= $category['rubric_name'] ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </nav>
            </header>
            <div class="container-fluid">
                <main>
                    <aside>
                        <div>
                            <div class="aside-inner">
                                <h3>Популярно:</h3>

                                <?php foreach ((array)$popular as $item): ?>
                                    <div class="popular-item"
                                         onclick="window.location.href='http://react.mealton.ru/publication/<?= $item['id'] ?>/<?= translit($item['title']) ?>.html'">
                                        <img src="<?= $item['img'] ?>" class="popular-img" alt="">
                                        <h4><?= $item['title'] ?></h4>
                                        <p class="align-right">
                                            <span class="fa-icon views"></span>&nbsp;<?= $item['views'] ?>
                                            <span class="fa-icon likes"></span>&nbsp;<?= $item['likes'] ?></p>
                                    </div>
                                <?php endforeach; ?>

                            </div>
                        </div>
                    </aside>
                    <div class="publication import">

                        <form id="import-form" class="validate-form">
                            <div class="form-group">
                                <input type="text" name="url" placeholder="URL импортируемой публикации"
                                       class="form-control" required>
                            </div>

                            <fieldset>
                                <legend><small>Натройки</small></legend>
                                <div class="form-group settings">
                                    <input type="text" name="tags" placeholder="Селектор хештегов" class="form-control">
                                    <input type="text" name="container" placeholder="Селектор контейнера публикации"
                                           class="form-control">
                                </div>
                                <p align="right">
                                    <small>
                                        <a class="pointer" id="import-settings-fishki">
                                            Выставить для fishki.net
                                        </a>
                                    </small>
                                </p>
                            </fieldset>
                            <button type="submit" class="btn btn-primary" id="import-btn">
                                Импорт
                                <span class="loader">
                                    <i class="fas fa-spinner fa-pulse"></i>
                                </span>
                            </button>
                        </form>

                        <hr>

                        <form id="add-form" class="validate-form">
                            <input type="hidden" name="user_id" value="<?= $_SESSION['auth']['id'] ?>">
                            <div class="form-group">
                                <select name="category" class="form-control" required>
                                    <option value="" selected disabled>Выберите категорию</option>
                                    <?php foreach ((array)$categories as $category): ?>
                                        <option value="<?= $category['id'] ?>"><?= $category['rubric_name'] ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <input type="hidden" name="imported">
                            <input type="hidden" name="image_default">
                            <div class="form-group">
                                <input type="text" name="title" placeholder="Название публикации" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <textarea name="description" placeholder="Описание публикации"
                                          class="form-control"></textarea>
                            </div>
                            <div class="form-group">
                                <input type="text" name="alias" placeholder="Псевдоним публикации" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <input type="text" name="hashtags" placeholder="hashtag метки: ретро, путешествия, фото..." class="form-control" required>
                            </div>

                            <b>Предпросмотр</b>
                            <div id="content"></div>
                            <hr>
                            <div class="submit-buttons">
                                <button type="submit" class="btn btn-primary" id="submit-btn" disabled>
                                    Опубликовать
                                    <span class="loader">
                                        <i class="fas fa-spinner fa-pulse"></i>
                                    </span>
                                </button>
                                <button type="button" class="btn btn-secondary" id="cancel-btn" disabled>
                                    Отмена
                                </button>
                            </div>
                        </form>

                    </div>
                </main>
            </div>
            <div id="lift"></div>
            <div class="modal">
                <div id="modal-inner"></div>
            </div>
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

<script src="http://react.mealton.ru/assets/js/profile.js"></script>

</body>
</html>

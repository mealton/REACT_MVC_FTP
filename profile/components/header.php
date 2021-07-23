<header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <span id="auth">
            <span class="logout">
                <img src="<?= $_SESSION['auth']['profile_image'] ?>" id="profile_image" alt="#">
            </span>
        </span>
        <a href="http://react.mealton.ru" class="navbar-brand pointer">Главная</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <?php foreach ((array)$categories as $category): ?>
                    <a class="nav-item nav-link pointer" data-category="<?= $category['id'] ?>">
                        <?= $category['rubric_name'] ?>
                    </a>
                <?php endforeach; ?>
            </div>
            <form action="/search/" method="post" class="search-form" onsubmit="this.querySelector('input').blur(); return false;">
                <div class="form-group search-form-group">
                    <input type="text" name="search" autocomplete="off" class="form-control" placeholder="Поиск...">
                </div>
            </form>
        </div>
    </nav>
</header>

<aside>
    <div>
        <div class="aside-inner">

            <h3>Ваши публикации:</h3>

            <?php foreach ((array)$publications as $item): ?>
                <div class="popular-item" title="Редактировать" data-id="<?= $item['id'] ?>" data-category="<?= $item['category'] ?>">
                    <img src="<?= $item['image_default'] ? $item['image_default'] : $item['image_random'] ?>" class="popular-img" alt="">
                    <h4><?= $item['short_title'] ?></h4>
                    <p class="align-right">
                        <span class="fa-icon views"></span>&nbsp;<?= $item['views'] ?>
                        <span class="fa-icon likes"></span>&nbsp;<?= $item['likes'] ?></p>
                </div>
            <?php endforeach; ?>

        </div>
    </div>
</aside>

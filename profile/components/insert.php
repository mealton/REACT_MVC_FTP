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
        <input type="text" name="title" placeholder="Название публикации" class="form-control"
               required>
    </div>
    <div class="form-group">
                                <textarea name="description" placeholder="Описание публикации"
                                          class="form-control"></textarea>
    </div>
    <div class="form-group">
        <input type="text" name="alias" placeholder="Псевдоним публикации" class="form-control"
               required>
    </div>
    <div class="form-group">
        <input type="text" name="hashtags"
               placeholder="hashtag метки: ретро, путешествия, фото..." class="form-control"
               required>
    </div>

    <b>Предпросмотр:</b>
    <div id="content"></div>
    <hr>
    <p style="font-size: x-large; text-align: right;">
        <i class="fa fa-file-text pointer" aria-hidden="true" title="Добавить текст" onclick="profile.addItem(this, 'last', 'text')"></i>
        <i class="fa fa-picture-o pointer" aria-hidden="true" title="Добавить изображение" onclick="profile.addItem(this, 'last', 'image')"></i>
        <i class="fa fa-youtube pointer" aria-hidden="true" title="Добавить видео" onclick="profile.addItem(this, 'last', 'video')"></i>
    </p>
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
        <!--<button class="btn btn-success goto" data-href="" disabled>
            Перейти к публикации
        </button>-->
    </div>
</form>

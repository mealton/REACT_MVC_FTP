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
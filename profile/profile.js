const profile = {

    action: 'http://react.mealton.ru/assets/php/React.php',

    init() {
        setTimeout(() => {
            const sidebar = document.querySelector('.aside-inner');
            const left = sidebar.offsetLeft;
            const width = sidebar.offsetWidth;
            sidebar.classList.add('fixed');
            sidebar.style.left = left + 'px';
            sidebar.style.width = width + 'px';
            sidebar.scrollTop = 0;
        }, 200);
    },

    import(e) {
        e.preventDefault();
        const form = e.target;
        const data = validate(form);
        const submitter = form.querySelector('[type=submit]');

        if (!data)
            return false;

        submitter.querySelector('.loader').classList.add('loading');
        data.method = 'import';

        const callback = response => {
            //console.log(response);
            submitter.querySelector('.loader').classList.remove('loading');

            if (response.error)
                return false;

            const addForm = $('#add-form');
            addForm.find('[name="imported"]').val(data.url);
            addForm.find('[name="title"]').val(response.title);
            addForm.find('[name="description"]').val(response.description);
            addForm.find('[name="alias"]').val(response.alias);
            addForm.find('[name="hashtags"]').val(response.hashtags);
            const content = response.content;
            const contentContainer = $('#content');
            contentContainer.html('');

            content.forEach((item, i) => content.forEach((item, i) => contentContainer.append(this.getItemContent(item, i))));

            addForm.find('.submit-buttons button').not('.goto').prop('disabled', 0);
        };

        fetchfunc(this.action, callback, data);
    },


    getTextContent(item) {
        let text;
        switch (item.tag_category) {
            case('text'):
                text = `<p class="inner-text">${item.content}</p>`;
                break;
            case('description'):
                text = `<small class="description"><i>${item.content}</i></small>`;
                break;
            case('subtitle'):
                text = `<h3 class="subtitle"><b>${item.content}</b></h3>`;
                break;
        }
        return text;
    },


    getItemContent(item, i, publication = {}) {
        let itemContent;

        const text = this.getTextContent(item);

        if (item.tag_category === 'image')
            itemContent =
                `<img class="preview" src="${item.content}">
             <div class="edited">
                <input type="hidden" name="content.${item.tag_category}.${i}" data-tag_category="image" class="form-control" value="${item.content}">
            </div>`;
        else
            itemContent =
                `<div class="text">${text}</div>
            <div class="edited">
                <textarea name="content.${item.tag_category}.${i}" data-tag_category="${item.tag_category}" class="form-control">${item.content}</textarea>
                <small>
                    <i class="fa fa-font ${item.tag_category === 'text' ? 'active' : ''}" data-tag_category="text" onclick="profile.setTagCategory(this)" aria-hidden="true" title="Текст"></i>
                    <i class="fa fa-bold ${item.tag_category === 'subtitle' ? 'active' : ''}" data-tag_category="subtitle" onclick="profile.setTagCategory(this)" aria-hidden="true" title="Заголовок"></i>
                    <i class="fa fa-italic ${item.tag_category === 'description' ? 'active' : ''}" data-tag_category="description" onclick="profile.setTagCategory(this)" aria-hidden="true" title="Описание"></i>
                </small>                
            </div>`;

        const image_default_active = item.content === publication.image_default ? 'default' : '';
        const imageDefaultIcon = `<i class="fa fa-picture-o ${image_default_active}" title="Сделать изображением по умолчанию" aria-hidden="true" onclick="profile.setDefaultImage(this)"></i>`;

        return `<div class="content-item">
                        <div class="controls">
                            ${item.tag_category === 'image' ? imageDefaultIcon : ''}
                            <i class="fa fa-pencil-square" aria-hidden="true" title="Изменить" onclick="${item.tag_category === 'image' ? 'profile.editItemImage(this)' : 'profile.editItemText(this)'}"></i>
                            <i class="fa fa-bars" aria-hidden="true" onclick="profile.editMenu(this)"></i>
                            <i class="fa fa-window-close" aria-hidden="true" title="Удалить" onclick="profile.removeItem(this)"></i>
                        </div>
                        ${itemContent}                        
                    </div>`;
    },


    editPublication(id) {
        const publication = Data.publications[id];

        if (!publication)
            return false;

        sessionStorage.setItem('editId', id);

        window.scrollTo({top: 0});

        const addForm = $('#add-form');
        addForm.find('[name="imported"]').val(publication.imported);
        addForm.find('[name="title"]').val(publication.short_title);
        addForm.find('[name="description"]').val(publication.description);
        addForm.find('[name="alias"]').val(publication.alias);
        addForm.find('[name="hashtags"]').val(publication.hashtags);

        const content = publication.content;
        const contentContainer = $('#content');
        contentContainer.html('');

        content.forEach((item, i) => contentContainer.append(this.getItemContent(item, i, publication)));

        const categorySelect = $('select[name="category"]');
        categorySelect.find('option').prop('selected', 0);
        categorySelect.find('option[value="' + publication.category + '"]').prop('selected', 1);


        addForm.find('.submit-buttons button').prop('disabled', 0);
        const submit = addForm.find('[type="submit"]');
        submit.html(submit.html().replace('Опубликовать', 'Сохранить'));

        $('.goto').prop('disabled', 0).attr('data-href', `http://react.mealton.ru/publication/${id}/${publication.alias}.html`)
    },

    editMenu(item) {
        if (item.classList.contains('opened')) {
            item.classList.remove('opened');
            return $(item).next('.edit-menu').remove();
        }

        $(item)
            .addClass('opened')
            .after(
                `<ul class="edit-menu">
                        <li>
                            <i class="fa fa-caret-up" aria-hidden="true"></i>&nbsp;
                            <i class="fa fa-file-text" aria-hidden="true" title="Добавить текст перед данным блоком" onclick="profile.addItem(this, 'before', 'text')"></i>
                            <i class="fa fa-picture-o" aria-hidden="true" title="Добавить изображение перед данным блоком" onclick="profile.addItem(this, 'before', 'image')"></i>
                            <i class="fa fa-youtube" aria-hidden="true" title="Добавить видео перед данным блоком" onclick="profile.addItem(this, 'before', 'video')"></i>
                        </li>
                        <li>
                            <i class="fa fa-caret-down" aria-hidden="true"></i>&nbsp;
                            <i class="fa fa-file-text" aria-hidden="true" title="Добавить текст после данного блока" onclick="profile.addItem(this, 'after', 'text')"></i>
                            <i class="fa fa-picture-o" aria-hidden="true" title="Добавить изображение после данного блока" onclick="profile.addItem(this, 'after', 'image')"></i>
                            <i class="fa fa-youtube" aria-hidden="true" title="Добавить видео после данного блока" onclick="profile.addItem(this, 'after', 'video')"></i>
                        </li>
                    </ul>`);

        $('body').on('click', e => {
            if (!$(e.target).closest('.edit-menu').length && e.target !== item) {
                item.classList.remove('opened');
                $(item).next('.edit-menu').remove();
            }

        });

    },

    addItem(item, where, field) {
        const data = {
            tag_category: field,
            content: ''
        };
        const i = $('.content-item').length + 1;
        const newItemHTML = this.getItemContent(data, i);
        const contentItem = $(item).closest('.content-item');
        let newItem;
        if (where === 'before') {
            $(contentItem).before(newItemHTML);
            newItem = $(contentItem).prev('.content-item');
        } else if (where === 'after') {
            $(contentItem).after(newItemHTML);
            newItem = $(contentItem).next('.content-item');
        } else if (where === 'last') {
            $('#content').append(newItemHTML);
            newItem = $('.content-item:last-child');
        }
        newItem.find('.fa.fa-pencil-square').click();
    },

    removeItem(item) {
        if (confirm('Удалить?'))
            $(item).closest('.content-item').remove();
    },

    editItemText(item) {
        item.className = 'fa fa-check-square';
        item.setAttribute('onclick', 'profile.saveItemText(this)');
        const contentItem = $(item).closest('.content-item');
        const edited = contentItem.find('.edited');
        edited.show();
        const textarea = edited.find('textarea');
        textarea.css({height: `${+textarea[0].scrollHeight + 20}px`});
        contentItem.find('.text').hide();
    },

    editItemImage(item) {
        item.className = 'fa fa-check-square';
        item.setAttribute('onclick', 'profile.saveItemImage(this)');
        const controls = $(item).closest('.controls');
        const self = this;

        $('.content-item .uploader').remove();

        const uploader =
            `<div class="uploader">
                <input type="text" name="url" class="form-control" placeholder="url изображения" />
                <input type="file" name="file" id="file" accept="image/png, image/gif, image/jpeg" style="display: none;">
                <label for="file" class="btn btn-primary"><i class="fa fa-upload" aria-hidden="true"></i></label>
                <button type="button" class="btn btn-secondary cancel">Отмена</button>
            </div>`;

        controls.after(uploader);

        //Загрузка через URL
        $('.content-item .uploader input[name="url"]').bind('paste', function (e) {
            this.value = (e.originalEvent || e).clipboardData.getData('text/plain');
            //profile.uploadUrl(this);
            $(this).closest('.content-item').find('img.preview').attr('src', this.value);
            $(this).closest('.content-item').removeAttr('data-uploaded');
            return false;
        });

        //Загрузка с компьютера
        $('.content-item .uploader input[type="file"]').on('change', e => self.uploadFile(e.target));

        //Отмена
        $('.content-item .uploader .cancel').on('click', function () {
            const img = $(this).closest('.content-item').find('img.preview');
            const srcDefault = $(this).closest('.content-item').find('input[type="hidden"]').val();
            self.closeUploader(this);
            return img.attr('src', srcDefault);
        });

    },

    saveItemText(item) {
        item.className = 'fa fa-pencil-square';
        item.setAttribute('onclick', 'profile.editItemText(this)');
        const contentItem = $(item).closest('.content-item');
        const edited = contentItem.find('.edited');
        edited.hide();
        const textarea = edited.find('textarea');
        const text = this.getTextContent({
            tag_category: textarea.attr('data-tag_category'),
            content: textarea.val()
        });
        contentItem.find('.text').show().html(text);
    },

    closeUploader(item) {
        $(item).closest('.content-item').find('.fa-check-square').attr({
            class: 'fa fa-pencil-square',
            onclick: 'profile.editItemImage(this)'
        });
        $('.content-item .uploader').remove();
    },

    setTagCategory(item) {
        const container = $(item).closest('.content-item');
        const textarea = container.find('textarea');
        textarea.attr('data-tag_category', item.dataset.tag_category);
        $(item)
            .addClass('active')
            .siblings().removeClass('active');

    },

    saveItemImage(item) {

        const container = $(item).closest('.content-item');
        const input = container.find('input[type="hidden"]');
        const src = container.find('img.preview').attr('src');
        const self = this;

        if (container.attr('data-uploaded')) {
            input.val(src);
            container.removeAttr('data-uploaded');
            return this.closeUploader(item);
        }

        const data = {
            method: 'upload_url',
            url: src
        };

        const callback = response => {
            console.log(response);
            if (response.result) {
                input.val(response.src);
                self.closeUploader(item);
            }
        };
        fetchfunc(this.action, callback, data);

    },

    setDefaultImage(item) {

        const inputDefault = $('input[name="image_default"]');

        if (item.classList.contains('default')) {
            item.classList.remove('default');
            return inputDefault.val("");
        }

        $('.content-item .fa.fa-picture-o.default').removeClass('default');
        const src = $(item).closest('.content-item').find('img.preview').attr('src');
        item.classList.add('default');
        return inputDefault.val(src);
    },

    addImported(e) {
        e.preventDefault();
        const form = e.target;
        const data = validate(form);
        const submitter = form.querySelector('[type=submit]');

        if (!data)
            return false;

        submitter.querySelector('.loader').classList.add('loading');
        data.method = 'add_post';

        if (sessionStorage.getItem('editId')) {
            data.id = +sessionStorage.getItem('editId');
            data.method = 'update_post';
        }

        const content = [];

        Object.keys(data).forEach((key, i) => {
            if (key.match(/^content\./gi)) {
                const dataInput = document.querySelector('[name="' + key + '"]');
                content.push({
                    tag_category: dataInput.dataset.tag_category,
                    content: data[key]
                });
                delete data[key];
            }
        });

        data.content = content;
        const callback = response => {
            console.log(response);
            submitter.querySelector('.loader').classList.remove('loading');

            if (response.result) {
                //$('.goto').prop('disabled', 0).attr('data-href', `http://react.mealton.ru/publication/${response.publication.id}/${response.publication.alias}.html`);
                sessionStorage.removeItem('editId');
                window.location.href = `http://react.mealton.ru/${response.publication.id}/${response.publication.alias}.html`;
            }

        };

        //console.log(data);

        fetchfunc(this.action, callback, data);
    },


    uploadFile(file) {
        const formData = new FormData();

        const labelIcon = $(file).closest('.uploader').find('.fa.fa-upload');

        if (file.files.length)
            $.each(file.files, (i, file) => {
                formData.append("file[" + i + "]", file);
            });
        else
            return false;

        $.ajax({
            type: "POST",
            url: this.action,
            cache: false,
            dataType: "JSON",
            contentType: false,
            processData: false,
            data: formData,
            beforeSend: function () {
                labelIcon.attr('class', 'fas fa-spinner fa-pulse');
            },
            success: response => {
                console.log(response);
                labelIcon.attr('class', 'fa fa-upload');
                const src = response[0];
                if (src) {
                    const item = $(file).closest('.content-item');
                    item.find('img.preview').attr('src', src);
                    item.attr('data-uploaded', 1)
                    //item.find('input[type="hidden"]').val(src);
                }


            },
            error: (xhr, ajaxOptions, thrownError) => {
                loader.removeClass('visible');
                console.log(thrownError);
            }
        });
    },

    uploadBase64(base64) {

        const uploader = $('.content-item .uploader');

        if (!uploader.length)
            return 0;

        const data = {
            url: base64,
            method: 'upload_url'
        };
        const labelIcon = uploader.find('.fa.fa-upload');
        labelIcon.attr('class', 'fas fa-spinner fa-pulse');
        const callback = response => {
            console.log(response);
            labelIcon.attr('class', 'fa fa-upload');
            if (response.result) {
                const container = uploader.closest('.content-item');
                container.attr('data-uploaded', 1);
                container.find('img.preview').attr('src', response.src);
            }
        };
        fetchfunc(this.action, callback, data);
    },


    pasteHandler(e) {
        // если поддерживается event.clipboardData (Chrome)
        const self = this;
        if (e.clipboardData) {
            // получаем все содержимое буфера
            const items = e.clipboardData.items;
            if (items) {
                // находим изображение
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        // представляем изображение в виде файла
                        const blob = items[i].getAsFile();
                        // создаем временный урл объекта
                        const URLObj = window.URL || window.webkitURL;
                        const source = URLObj.createObjectURL(blob);

                        const reader = new FileReader();
                        reader.readAsDataURL(blob);

                        // добавляем картинку в DOM
                        reader.onloadend = () => profile.createImage(reader.result, source);
                    }
                }
            }
            // для Firefox проверяем элемент с атрибутом contenteditable
        } else {
            setTimeout(self.checkInput, 1);
        }
    },

    checkInput() {
        const child = pasteCatcher.childNodes[0];
        pasteCatcher.innerHTML = "";
        if (child) {
            // если пользователь вставил изображение – создаем изображение
            if (child.tagName === "IMG") {
                this.createImage(child.src);
            }
        }
    },

    createImage(base64data, source) {
        const pastedImage = new Image();
        const self = this;
        pastedImage.onload = () => self.uploadBase64(base64data);
        pastedImage.src = source;
    }
};


$(document).ready(() => {
    profile.init();

    $('#import-form').on('submit', e => profile.import(e));

    $('#import-settings-fishki').on('click', e => {
        $('input[name="tags"]').val('.tags');
        $('input[name="container"]').val('.post_content_inner');
    });

    $('#cancel-btn').on('click', () => {
        $('#content').html('');
        $('.profile form').each((i, form) => form.reset());
        $('.submit-buttons button').prop('disabled', 1);
        sessionStorage.removeItem('editId');
    });

    $('#add-form').on('submit', e => profile.addImported(e));

    $('#lift').on('click', e => {
        if (e.target.classList.contains('visible'))
            window.scrollTo({top: 0, behavior: 'smooth'});
    });


    window.onscroll = e => {
        const lift = document.getElementById('lift');
        if (window.pageYOffset > 800)
            lift.classList.add('visible');
        else
            lift.classList.remove('visible');
    };


    $('.nav-item.nav-link').on('click', function () {
        const publics = $('.popular-item');
        publics.show();

        if (this.classList.contains('active'))
            return this.classList.remove('active');

        $(this)
            .addClass('active')
            .siblings().removeClass('active');

        const category = this.dataset.category;
        publics.each((i, item) => {
            if (item.dataset.category === category)
                $(item).show();
            else
                $(item).hide();
        });
    });


    $('input[name="search"]').on('keyup', function () {

        const publics = $('.popular-item');
        publics.show();

        publics.each((i, item) => {
            const regExp = new RegExp(this.value, 'gi');
            const title = item.querySelector('h4');
            title.innerHTML = title.innerText;
            if (title.innerText.match(regExp)) {
                $(item).show();
                title.innerHTML = title.innerText.replace(regExp, '<mark>$&</mark>')
            } else
                $(item).hide();
        });

    });


    $('.popular-item')
        .on('click', function () {
            const id = this.dataset.id;
            profile.editPublication(id);
        });

    $('.goto').on('click', function () {
       if(this.dataset.href){
           //sessionStorage.removeItem('editId');
           window.open(this.dataset.href);
       }
    });


    const editId = sessionStorage.getItem('editId');

    if (editId)
        $('.popular-item[data-id=' + editId + ']').click();


    /*ЗАГРУЗКА ИЗОБРАЖЕНИЕ ЧЕРЕЗ BASE64*/
    // проверяем, поддерживает ли браузер объект Clipboard
    // если нет создаем элемент с атрибутом contenteditable
    if (!window.Clipboard) {
        const pasteCatcher = document.createElement("div");

        // Firefox вставляет все изображения в элементы с contenteditable
        pasteCatcher.setAttribute("contenteditable", "");

        pasteCatcher.style.display = "none";
        document.body.appendChild(pasteCatcher);

        // элемент должен быть в фокусе
        pasteCatcher.focus();
        document.addEventListener("click", function () {
            pasteCatcher.focus();
        });
    }
    // добавляем обработчик событию
    window.addEventListener("paste", profile.pasteHandler);
});



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

            content.forEach((item, i) => {

                let itemContent;

                if (item.tag_category === 'image')
                    itemContent =
                        `<img class="preview" src="${item.content}">
                        <input type="hidden" name="content.image.${i}" class="form-control" value="${item.content}">`;
                else
                    itemContent =
                        `<p>${item.content}</p>
                        <textarea name="content.text.${i}" class="form-control">${item.content}</textarea>`;

                contentContainer.append(
                    `<div class="content-item">
                        <div class="controls">
                            ${item.tag_category === 'image' ? '<i class="fa fa-picture-o" aria-hidden="true" onclick="profile.setDefaultImage(this)"></i>' : ''}
                            <i class="fa fa-pencil-square" aria-hidden="true" title="Изменить" onclick="profile.editItem(this)"></i>
                            <i class="fa fa-window-close" aria-hidden="true" title="Удалить" onclick="profile.removeItem(this)"></i>
                        </div>
                        ${itemContent}                        
                    </div>`);

            });

            addForm.find('.submit-buttons button').prop('disabled', 0);
        };

        fetchfunc(this.action, callback, data);
    },

    removeItem(item) {
        if (confirm('Удалить?'))
            $(item).closest('.content-item').remove();
    },

    editItem(item) {
        item.className = 'fa fa-check-square';
        item.setAttribute('onclick', 'profile.saveItem(this)');
        const contentItem = $(item).closest('.content-item');
        const textarea = contentItem.find('textarea');
        textarea.show().css({height: `${+textarea[0].scrollHeight + 20}px`});
        contentItem.find('p').hide();
    },

    saveItem(item) {
        item.className = 'fa fa-pencil-square';
        item.setAttribute('onclick', 'profile.editItem(this)');
        const contentItem = $(item).closest('.content-item');
        const textarea = contentItem.find('textarea');
        textarea.hide();
        contentItem.find('p').show().html(textarea.val());
    },

    setDefaultImage(item){
        const src = $(item).closest('.content-item').find('img.preview').attr('src');
        $('input[name="image_default"]').val(src);
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

        const content = {};

        Object.keys(data).forEach(key => {
            if (key.match(/^content\./gi)) {
                const arr = key.split('.');
                content[arr[2]] = {
                    tag_category: arr[1],
                    content: data[key]
                };
                delete data[key];
            }
        });

        data.content = content;
        const callback = response => {
            console.log(response);
            submitter.querySelector('.loader').classList.remove('loading');

            if(response.result)
                window.location.href = `/${response.publication.id}/${response.publication.alias}.html`;
        };

        fetchfunc(this.action, callback, data);
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
    });

    $('#add-form').on('submit', e => profile.addImported(e))
});



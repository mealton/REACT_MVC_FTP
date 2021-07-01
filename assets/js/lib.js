function fetchfunc(action, callback, json, headers = false, method = 'post', before = () => {
}) {
    before();
    const init = {
        method: method,
        mode: 'no-cors',
    };
    if (headers)
        init.headers = new Headers(headers);

    if (json)
        init.body = JSON.stringify((data = json));

    fetch(action, init)
        .then(response => response.json())
        .then(result => callback(result))
}


function formExecute(form) {
    const fields = form.elements;
    const data = {};
    for (let i in fields) {
        let field = fields[i];
        if (['SELECT', 'TEXTAREA', 'INPUT'].includes(field.tagName) && field.type !== 'submit') {
            if (field.type === 'checkbox')
                data[field.name] = field.checked;
            else if (field.type === 'radio' && !field.checked)
                continue;
            else
                data[field.name] = field.value;
        }
    }
    return data;
}

function youtubePlayer(url, playerId) {
    const video = url.split('/');
    const videoId = video[video.length - 1].replace(/\?.*/, '');
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/player_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const containerWidth = $(`#${playerId}`).closest('div').innerWidth();
    const videoWidth = containerWidth;
    const videoHeigth = containerWidth / 1280 * 720;

    setTimeout(function () {
        return new YT.Player(playerId, {
            width: videoWidth,
            height: videoHeigth,
            videoId: videoId
        });
    }, 500);
}


function getElemetsAttributes(elements, attributes = []) {
    if (typeof attributes !== 'object')
        attributes = [attributes];

    const data = {};

    elements.forEach(element => {
        attributes.forEach(attribute => {
            if (data[attribute])
                data[attribute].push(element[attribute]);
            else
                data[attribute] = [element[attribute]]
        });
    });

    return data;
}


function parseQuery() {
    const queryString = window.location.href.split('?')[1];
    if (queryString === undefined)
        return false;
    const result = {};
    const queryArray = queryString.split('&');
    queryArray.forEach(item => {
        const exp = item.split('=');
        result[exp[0]] = exp[1];
    });
    return result;
}


function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}


function historyFunc(add = "") {
    history.pushState(null, null, window.location.href.replace(window.location.pathname, '/') + add + (add ? '.html' : ''));
}


function translit(string) {
    const abc = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z',
        'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '\'', 'ы': 'y', 'ь': '\'', 'э': 'e', 'ю': 'ju', 'я': 'ja'
    };

    let translit = '';
    string = string.toLowerCase().replace(/\s+/g, '-').split('');
    string.forEach(char => {
        if (abc[char])
            translit += abc[char];
        else
            translit += char;
    });
    translit = translit.replace(/\—+|,|"|'/g, '');
    translit = translit.replace(/\-{2,}/g, '-');
    return translit.replace(/^\-|\-$/, '');
}


function convert_time(timestamp, return_time = 0) {
    const months = ['января', 'ферваля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const timestamp_parse = timestamp.split(' ');
    const date_stamp = timestamp_parse[0];
    const date_parse = date_stamp.split('-');
    const date = date_parse[2] + ' ' + months[parseInt(date_parse[1]) - 1] + ' ' + date_parse[0] + ' г.';
    const time = timestamp_parse[1].replace(/:\d{2}$/i, '');
    return return_time ? date + ' ' + time : date;
}


function closest(elem, parentTofind) {
    let parent = elem.parentElement;
    parentTofind = document.querySelectorAll(parentTofind);
    let result = false;
    while (parent !== null && !result) {
        parentTofind.forEach(parentItem => {
            if (parent === parentItem)
                result = parentItem;
        });
        parent = parent.parentElement;
    }
    return result;
}


function searchFunc(value) {
    const regExp = new RegExp(value, 'gi');
    const result = {};
    Object.values(Data.publications).forEach(row => {
        if (row.short_title.match(regExp))
            result[row.id] = row;
    });
    return result;
}


function shuffle(array) {
    const result = [];
    while (result.length < array.length) {
        let index = Math.round(Math.random() * array.length - .5);
        if (result.indexOf(array[index]) === -1)
            result.push(array[index]);
    }
    return result;
}

function srcClear(src) {
    const base = document.querySelector('base').href;
    const reg = new RegExp(base, 'gi');
    return decodeURI(src).replace(reg, '/');
}


function publicationMediaCounter(id) {
    const publication = Data.publications[id];
    const imagesCount = publication.content.filter(item => item.tag_category === 'image' && item.isHidden != 1).length;
    const videoCount = publication.content.filter(item => item.tag_category === 'video').length;
    switch (true) {
        case (imagesCount > 0 && videoCount > 0):
            return `(${imagesCount} фото и ${videoCount} видео)`;
        case (imagesCount > 0 && videoCount === 0):
            return `(${imagesCount} фото)`;
        case (imagesCount === 0 && videoCount > 0):
            return `(${videoCount} видео)`;
    }
}

function jrumble(element, duration = 800) {
    $(element).jrumble({x: 4, y: 0, rotation: 0, speed: 0}).trigger('startRumble');
    setTimeout(() => $(element).trigger('stopRumble'), duration);
}

function validate(form, fields = []) {

    const data = formExecute(form);
    const submitter = form.querySelector('[type="submit"]');
    const required = [];

    form.querySelectorAll('[data-required]').forEach(input => required.push(input.name));

    fields = fields.length === 0 ? required : fields;

    for (let i in data) {
        if (!data[i] && fields.indexOf(i) !== -1) {
            let input = form.querySelector('[name="' + i + '"]');

            input.focus();
            jrumble(submitter);
            return false;
        }
    }

    return data;
}


setTimeout(() => {
    document.querySelectorAll('.validate-form [required]').forEach(input => {
        input.required = false;
        input.setAttribute('data-required', 1)
    });
}, 1000);


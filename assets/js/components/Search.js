const Search = props => (
    <form action="/search/" method="post" className="search-form" onSubmit={search.showResult}>
        <div className="form-group search-form-group">
            <input type="text" name="search" autoComplete="off" className="form-control" placeholder="Поиск..."
                   onKeyUp={search.search}/>
            <div className="search-options"/>
        </div>
    </form>
);

const search = {

    reset() {
        document.querySelectorAll('.search-form').forEach(form => {
            form.reset();
            form.querySelector('.search-options').innerHTML = ""
        });
    },

    result: {},

    showResult(e) {
        e.preventDefault();
        let active = document.querySelector('.search-options .option.active');
        if (active !== null) {
            e.currentTarget = active;
            publication.show(e);
            search.reset();
            return true;
        }

        const value = e.currentTarget.elements.search.value;
        const menuCollapse = document.querySelector('.collapse');
        menuCollapse.classList.remove('show');
        publication.id = false;
        main.render(search.result);
        window.scrollTo({top: 0, behavior: 'smooth'});
        const add = '-search/' + value;
        main.title = 'Поиск публикаций, сожержащих #' + value;

        if(!main.playerIsOn)
            document.title = main.title;

        historyFunc(add);
        search.reset();
    },

    search(e) {

        if ([38, 40].includes(e.keyCode))
            return false;

        const value = e.currentTarget.value;
        const options = document.querySelectorAll('.search-options');

        if (value.length < 3) {
            options.forEach(options => options.innerHTML = "");
            return false;
        } else if (e.keyCode === 13) {
            console.log(this);
            return false;
        }

        search.result = {};

        let html = '';

        const searchData = searchFunc(value);

        const regExp = new RegExp(value, 'gi');

        Object.values(searchData).forEach(row => {
            search.result[row.id] = row;
            const title = row.short_title.replace(regExp, '<mark>$&</mark>');
            html += `<div class="option" data-id="${row.id}">${title}</div>`;
        });


        if (!html)
            return false;


        options.forEach(optionsBlock => {
            optionsBlock.innerHTML = `<div class="inner">${html}</div>`;
            optionsBlock.querySelectorAll('.option').forEach(option => {
                option.onclick = e => {
                    publication.show(e);
                    search.reset();
                };
            });
        });

        window.onkeyup = e => {

            const keyCode = e.keyCode;

            if (![38, 40].includes(keyCode))
                return false;

            const options = document.querySelector('.search-options .inner');
            const input = document.querySelector('input[name="search"]');
            let active = options.querySelector('.option.active');

            if (keyCode === 40)
                active = active === null ? options.firstElementChild : (active.nextElementSibling === null ? options.firstElementChild : active.nextElementSibling);
            else if (keyCode === 38)
                active = active === null ? options.lastElementChild : (active.previousElementSibling === null ? options.lastElementChild : active.previousElementSibling);

            options.querySelectorAll('.option').forEach(option => option.classList.remove('active'));
            active.classList.add('active');
            input.value = active.innerText;
        };

        document.body.onclick = e => {
            const parentForm = closest(e.target, 'form.search-form');
            if (parentForm)
                return false;
            search.reset();
        }
    }
};
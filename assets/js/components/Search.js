const Search = props => (
    <form action="/search/" method="post" className="search-form" onSubmit={search.showResult}>
        <div className="form-group search-form-group">
            <input type="text" name="search" autoComplete="off" className="form-control" placeholder="Поиск..." onKeyUp={search.search}/>
            <div className="search-options" />
        </div>
    </form>
);

const search = {

    reset(){
        document.querySelectorAll('.search-form').forEach( form => {
            form.reset();
            form.querySelector('.search-options').innerHTML = ""
        });
    },

    result:{},

    showResult(e){
        e.preventDefault();
        const value = e.currentTarget.elements.search.value;
        publication.id = false;
        main.render(search.result);
        window.scrollTo({top: 0, behavior: 'smooth'});
        const add = '-search/' + value;
        document.title = 'Поиск публикаций, сожержащих #' + value;
        historyFunc(add);
        search.reset();
    },

    search(e) {
        const value = e.currentTarget.value;
        const options = document.querySelectorAll('.search-options');

        if (value.length < 3) {
            options.forEach(options => options.innerHTML = "");
            return false;
        }
        else if(e.keyCode === 13){
            console.log(this);
            return false;
        }

        search.result = {};

        let html = '';

        const searchData = searchFunc(value);

        const regExp = new RegExp(value, 'gi');

        Object.values(searchData).forEach( row => {
            search.result[row.id] = row;
            const title = row.short_title.replace(regExp, '<mark>$&</mark>');
            html += `<div class="option" data-id="${row.id}">${title}</div>`;
        });


        if(!html)
            return false;


        options.forEach( optionsBlock => {
            optionsBlock.innerHTML = `<div class="inner">${html}</div>`;
            optionsBlock.querySelectorAll('.option').forEach(option => {
                option.onclick = e => {
                    publication.show(e);
                    search.reset();
                };
            });
        });

        document.body.onclick = e => {
            const parentForm = closest(e.target, 'form.search-form');
            if (parentForm)
                return false;
            search.reset();
        }
    }
};
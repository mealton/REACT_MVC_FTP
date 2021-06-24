const Nav = props => {
    const path = window.location.pathname.split('/').filter(el => el !== "" && el !== null);
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <span id="auth" onClick={loginForm.show}>
            {sessionStorage.getItem('auth') ? <Logout/> : <Login/>}
        </span>
            <a className="navbar-brand pointer" onClick={nav.toIndex}>Главная</a>
            <button className="navbar-toggler" onClick={nav.showNav} type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    {props.nav.map(row => {
                        if (row.id !== '5')
                            return <a className={
                                'nav-item nav-link ' +
                                (path[0] === 'category' && path[1] === row.id ? ' active' : ' pointer')}
                                      onClick={nav.category}
                                      data-category={row.id} key={row.id}>{row.rubric_name}</a>
                    })}
                </div>
                <Search/>
            </div>
        </nav>
    )};


const nav = {
        toIndex(e) {
            const menuCollapse = document.querySelector('.collapse');
            menuCollapse.classList.remove('show');
            publication.id = false;
            historyFunc();
            main.title = 'Все публикации';

            if(!main.playerIsOn)
                document.title = main.title;

            main.render();
            window.scrollTo({top: 0, behavior: 'smooth'});
        },

        category(e) {
            const menuCollapse = document.querySelector('.collapse');
            menuCollapse.classList.remove('show');
            const categoryId = e.currentTarget.getAttribute('data-category');
            const category = e.currentTarget.innerText;
            const data = {};
            for (let id in Data.publications) {
                const row = Data.publications[id];
                if (row.category === categoryId)
                    data[id] = row;
            }
            publication.id = false;
            main.render(data);
            window.scrollTo({top: 0, behavior: 'smooth'});
            const add = 'category' + '/' + categoryId + '/' + translit(category);
            main.title = category;

            if(!main.playerIsOn)
                document.title = main.title;

            document.querySelector('meta[name="description"]')
                .setAttribute("content", 'Публикации категории ' + category);
            historyFunc(add);
        },

        showNav() {
            const menuCollapse = document.querySelector('.collapse');

            if (menuCollapse.classList.contains('show')){
                menuCollapse.classList.remove('show');
            }
            else{
                menuCollapse.classList.add('show');
                document.body.onclick = e => {
                    if (!closest(e.target, 'header')) {
                        menuCollapse.classList.remove('show');
                    }
                }
            }
        }
    }
;
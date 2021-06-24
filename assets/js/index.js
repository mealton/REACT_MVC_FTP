const main = {

    title: '',

    playerIsOn: 0,

    render(data = Data.publications) {
        ReactDOM.render(
            <div className='main-div'>
                <Header rubrics={Object.values(Data.rubrics)}/>
                <div className="container-fluid">
                    <main>
                        <Sidebar popular={Data.popular}/>
                        <Content data={data}/>
                        <Music music={Data.music}/>
                    </main>
                </div>
                <Lift/>
                <Modal/>
                <Messenger/>
            </div>,
            document.getElementById('app')
        );

        setTimeout(main.afterRender, 200);
    },

    afterRender() {

        if (document.querySelector('.publication iframe') !== null) {
            document.querySelectorAll('.publication iframe').forEach(iframe => {
                iframe.width = iframe.parentElement.offsetWidth;
                iframe.height = iframe.width / 1280 * 720;
            })
        }

        //Преобразование строковых тегов в html элементы

        document.querySelectorAll('#public-content p, .message-item p').forEach(
            item => {
                const e = document.createElement('span');
                e.innerHTML = item.innerHTML;
                item.innerHTML = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
            });


        if (screen.width > 999) {
            const sidebar = document.querySelector('.aside-inner');
            const left = sidebar.offsetLeft;
            const width = sidebar.offsetWidth;
            sidebar.classList.add('fixed');
            sidebar.style.left = left + 'px';
            sidebar.style.width = width + 'px';
        }

        //Прокруткасообщений вниз
        if (window.location.search.match(/messenger=1/gi)) {
            const messagesInner = document.querySelector('.messages-inner');
            messagesInner.scrollTop = messagesInner.scrollHeight;
        }

        const postId = publication.id;

        if(postId){
            const publication = Data.publications[postId];
            document.querySelectorAll('.nav-item.nav-link').forEach(item => {
                if(+item.dataset.category === +publication.category)
                    item.classList.add('active');
            });
        }
    },

    init() {

        //проверка авторизации
        if (!sessionStorage.getItem('auth') && (Cookie.get('username') && Cookie.get('password'))) {
            fetchfunc(
                'http://react.mealton.ru/assets/php/React.php',
                response => {
                    if (!response.result)
                        return false;
                    sessionStorage.setItem('auth', 1);
                    main.render();
                },
                {
                    username: Cookie.get('username'),
                    password: Cookie.get('password'),
                    method: 'login',
                    cookie: 1
                });
        }

        const path = window.location.pathname.split('/').filter(el => el !== "" && el !== null);
        if (path[0] === 'publication' && path[1]){
            publication.id = parseInt(path[1]);
        }else if (path[0] === 'category' && path[1]) {
            const data = {};
            for (let id in Data.publications) {
                const row = Data.publications[id];
                if (row.category === path[1])
                    data[id] = row;
            }
            main.render(data);
            return true;
        } else if (path[0] === 'hashtags' && path[1]) {
            const tagName = Data.id_hashtags[path[1]].hashtag;
            const data = Data.tagsPublics[tagName];
            main.render(data);
            return true;
        } else if (path[0] === '-search' && path[1]) {
            const value = decodeURI(path[1]).replace(/\.html/gi, '');
            const data = searchFunc(value);
            console.log(value);
            main.render(data);
            return true;
        }
        main.render();
    }
};

main.init();
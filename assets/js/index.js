const main = {

    render(data = Data.publications) {
        ReactDOM.render(
            <div className='main-div'>
                <Header rubrics={Object.values(Data.rubrics)}/>
                <div className="container">
                    <main>
                        <Sidebar popular={Data.popular}/>
                        <Content data={data}/>
                        <Music music={Data.music}/>
                    </main>
                </div>
                <Lift/>
                <Modal/>
            </div>,
            document.getElementById('app')
        );
        if (document.querySelector('.publication iframe') !== null) {
            document.querySelectorAll('.publication iframe').forEach(iframe => {
                iframe.width = iframe.parentElement.offsetWidth;
                iframe.height = iframe.width / 1280 * 720;
            })
        }
    },

    init() {
        const path = window.location.pathname.split('/').filter(el => el !== "" && el !== null);
        if (path[0] === 'publication' && path[1])
            publication.id = parseInt(path[1]);
        else if (path[0] === 'category' && path[1]) {
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
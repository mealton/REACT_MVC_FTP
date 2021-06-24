const Sidebar = props => publication.id ?
    (<aside>
        <div>
            <div className="aside-inner">
                <Search/>
                <h3>Похожие:</h3>
                {sideBar.sideBar(sideBar.getSimilar(publication.id))}
            </div>
        </div>
    </aside>) :
    (<aside>
        <div>
            <div className="aside-inner">
                <Search/>
                <h3>Популярно:</h3>
                {sideBar.sideBar(props.popular)}
            </div>
        </div>
    </aside>);


const sideBar = {

    sideBar(array) {
        return array.map(row => row === undefined ? false : (
            <div className="popular-item" key={row.id} data-id={row.id} onClick={publication.show}>
                <img src={row.img} className="popular-img" alt=""/>
                <h4>{row.title}</h4>
                <p className="align-right">
                    <span className="fa-icon views"/>&nbsp;{row.views}
                    <span className="fa-icon likes"/>&nbsp;{row.likes}
                </p>
            </div>
        ));
    },

    getSimilar(id) {
        const current_tags = Data.publications[id].hashtags.split(',').map(tag => tag.trim().toLowerCase());
        const categoryId = Data.publications[id].category;
        const data = [];
        const matches = {};
        for (let id in Data.tags) {
            let match = 0;
            Data.tags[id].forEach(row => {
                if (current_tags.indexOf(row.hashtag.trim().toLowerCase()) !== -1)
                    match++;
            });
            if (match > 0 && id != publication.id)
                matches[id] = match;
        }

        let keysSorted = Object.keys(matches).sort((a, b) => matches[a] - matches[b]).reverse();
        keysSorted = keysSorted.length > 30 ? keysSorted.slice(0, 30) : keysSorted;
        keysSorted.forEach(id => data.push(Data.publications[id]));

        if (data.length < 30) {
            for (let id in Data.publications) {

                if (data.length >= 30)
                    break;

                const row = Data.publications[id];
                if (row.category === categoryId && keysSorted.indexOf(row.id) === -1 && row.id != publication.id)
                    data.push(row);
            }
        }

        data.forEach((row, i) => {
            if (row !== undefined) {
                data[i].title = row.short_title;
                data[i].img = row.image_default ? row.image_default : row.image_random;
            }
        });

        return data;
    },
};
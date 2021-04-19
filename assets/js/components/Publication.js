const PublicNavItem = props => props.data ? (
    <div className="public-nav-item" data-id={props.data.id} onClick={publication.show}>
        <img className="previrew" src={(props.data.image_default ? props.data.image_default : props.data.image_random)}
             alt="#"/>
        <div className="title">{props.data.short_title}</div>
    </div>) : <div className="public-nav-item"/>;


const PublicationsNav = props => {
    const id = props.id;
    const keys = Object.keys(Data.publications);
    const currentPosition = keys.indexOf(id);

    if (!currentPosition)
        return false;

    const prevKey = keys[(currentPosition - 1)];
    const nextKey = keys[(currentPosition + 1)];

    return (
        <div className="publication-nav clearfix">
            <PublicNavItem data={Data.publications[nextKey]}/>
            <PublicNavItem data={Data.publications[prevKey]}/>
        </div>
    );
};


const Publication = props => (
    <div className="publication">
        <h1><b>{props.publication.short_title}</b></h1>
        <PublicationsNav id={props.publication.id}/>
        <div className="description">
            <div className="tags">
                <Tags tags={props.publication.tags}/>
            </div>
            <div className="flex">
                <div className="flex-item"><small><b>{convert_time(props.publication.created_on, 1)}</b></small></div>
                <div className="flex-item">
                    <span className="views">{props.publication.views}</span>
                    <span className="likes" onClick={publication.like}
                          data-id={props.publication.id}>{props.publication.likes}</span>
                </div>
            </div>
            {props.publication.imported ?
                (<div>
                    <br/>
                    <small>
                        <b>Источник: </b>
                        <a href={props.publication.imported} target="_blank">
                            {new URL(props.publication.imported).hostname}
                        </a>
                    </small>
                </div>) : false}
            <hr/>
            <p>{props.publication.description}</p>
        </div>
        <div className="content" id="public-content">
            {props.publication.content.map(row => {
                switch (row.tag_category) {
                    case('image'):
                        return <img key={row.id} src={row.content} alt="" onClick={publication.showModalImg}/>;
                    case ('text'):
                        return <p key={row.id}>{row.content}</p>;
                    case ('subtitle'):
                        return <h2 key={row.id}>{row.content}</h2>;
                    case ('description'):
                        return <h6 key={row.id}><i>{row.content}</i></h6>;
                    case ('video'):
                        const videoArr = row.content.split('/');
                        const videoId = videoArr[videoArr.length - 1];
                        const width = 640;
                        const heigth = width / 1280 * 720;
                        return (<iframe src={'http://www.youtube.com/embed/' + videoId}
                                        key={row.id}
                                        frameBorder="0"
                                        width={width}
                                        height={heigth}
                                        title="YouTube video player"
                                        allow="fullscreen"
                        />)
                }
            })}
        </div>
        <Comments data={props.publication.comments} id={props.publication.id}/>
    </div>
);

const publication = {

    id: false,

    show(e) {

        const id = e.currentTarget.getAttribute('data-id');

        if (publication.id === id)
            return false;

        publication.id = id;

        const data = {
            id: id,
            method: 'views'
        };
        const callback = response => {
            Data.publications[id].views = response.data[0].views;

            main.render();

            window.scrollTo({top: 0, behavior: 'smooth'});
            const publication = Data.publications[id];
            const title = publication.short_title;
            const add = 'publication' + '/' + publication.id + '/' + translit(title);
            document.title = title;
            historyFunc(add);
        };
        fetchfunc('http://react.mealton.ru/assets/php/React.php', callback, data);

    },


    like(e) {
        const data = {
            id: e.currentTarget.getAttribute('data-id'),
            method: 'like'
        };
        const callback = response => {
            Data.publications[data.id].likes = response.data[0].likes;
            main.render();
        };
        fetchfunc('http://react.mealton.ru/assets/php/React.php', callback, data);
    },

    modalImgClick(img, prev = false) {
        const modal = document.querySelector('.modal');
        img = img.tagName === 'IMG' ? img : modal.querySelector('.modal-img');
        const publicationImages = document.querySelectorAll('.publication .content img');
        const publicationImagesSrc = getElemetsAttributes(publicationImages, 'src')['src'];
        const currentImagePosition = publicationImagesSrc.indexOf(img.src);
        const nextSrc = publicationImagesSrc[(prev ? currentImagePosition - 1 : currentImagePosition + 1)];
        if (nextSrc) {
            img.src = nextSrc;
            document.querySelector('#open-img-link').href = nextSrc;
            document
                .querySelector(`.publication img[src="${srcClear(nextSrc)}"]`)
                .scrollIntoView({
                    block: 'center',
                    behavior: 'smooth'
                });
        } else
            modal.style.display = 'none';
    },

    showModalImg(e) {
        const img = e.target;
        const src = img.src;
        const modal = document.querySelector('.modal');

        modal
            .querySelector('#modal-inner')
            .innerHTML =
            `<div class="publication-modal-inner">
                <span id="close-modal" onclick="modal.style.display = 'none';"></span>
                <img src="${src}" class="modal-img" onclick="publication.modalImgClick(this)" alt="#"/>
                <div class="controls modal-img-controls">
                    <div class="control-left" onclick="publication.modalImgClick(this, 1)"></div>
                    <div class="control-right" onclick="publication.modalImgClick(this)"></div>
                </div>
                <p class="open-img"><a href="${src}" target="_blank" id="open-img-link">Открыть в новом окне</a></p>
            </div>`;
        modal.style.display = 'block';

        const preventWheel = e => {
            if (modal.style.display !== 'none')
                e.preventDefault();
        };
        window.addEventListener('wheel', preventWheel, {passive: 0});

        modal.onclick = e => {
            if (!closest(e.target, '.publication-modal-inner'))
                modal.style.display = 'none';
        };

        document.getElementById('close-modal').onclick = e => modal.style.display = 'none';

    }
};
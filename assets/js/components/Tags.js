const Tags = props => props.tags.map(row => (
    <span key={row.id} className="tag tag-default">
        <span className="tagName" data-id={row.id} onClick={tags.tag}>
        {row.hashtag}</span>
        <sup>{Object.values(Data.tagsPublics[row.hashtag]).length}</sup>
    </span>
));

const tags = {
    tag(e) {
        const id = e.currentTarget.getAttribute('data-id');
        const tagName = e.currentTarget.innerText;
        const data = Data.tagsPublics[tagName];
        publication.id = false;
        main.render(data);

        window.scrollTo({top: 0, behavior: 'smooth'});
        const add = 'hashtags' + '/' + id + '/' + translit(tagName);
        main.title = '#' + tagName;

        if(!main.playerIsOn)
            document.title = main.title;

        historyFunc(add);
    }
};
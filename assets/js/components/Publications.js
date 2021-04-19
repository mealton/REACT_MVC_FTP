const Publications = props => props.publications.map(row => (
    <div className="publications-item" key={row.id} data-id={row.id} onClick={publication.show}>
            {row.comments.length > 0 ? <span className="comments-count">{row.comments.length}</span> : ''}
        <img src={row.image_default ? row.image_default : row.image_random}
             className="article-random-img" alt="#"/>
        <br/>
        <h5><b>{row.short_title} {publicationMediaCounter(row.id)}</b></h5>
        <br/>
        <small className="description">{row.description}</small>
    </div>));
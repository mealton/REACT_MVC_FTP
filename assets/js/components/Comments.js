const Comments = props => (
    <div className="comments">
        <hr/>
        <h4>Комментарии:</h4>
        <CommentForm id={props.id}/>
        <br/><br/>
        <div className="comments-inner">
            {props.data.map(row => <Comment key={row.id} data={row} progile_img={row.profile_image}/>)}
        </div>
    </div>
);

const Comment = props => (
    <div className="comment-item">
        <h6>
            {!props.progile_img ?
                <span className="profile-img-default"/> :
                <img src={props.progile_img} alt="#" className="profile-img"/>}
            {props.data.username}
        </h6>
        <div className="comment-images">
            {JSON.parse(props.data.pics_json)
                .map(src => <img key={Math.random()} src={src} alt="#" width="150" className="comment-image"/>)}
        </div>
        <p>{props.data.comment}</p>
        <p className="align-right"><sub>{convert_time(props.data.date, 1)}</sub></p>
    </div>
);
const Comments = props => (
    <div className="comments">
        <hr/>
        <h4>Комментарии:</h4>
        <CommentForm id={props.id}/>
        <br/><br/>
        <div className="comments-inner">
            {props.data.map(row => <Comment key={row.id} data={row}/>)}
        </div>
    </div>
);

const CommentForm = props => (
    <form action="http://react.mealton.ru/assets/php/React.php" method="post" id="comment-form"
          onSubmit={comment.addComment}>
        <input type="hidden" name="post_id" value={props.id}/>
        <input type="hidden" name="pics_json" value="[]"/>
        <textarea name="comment" placeholder="Комментарий" className="form-control"/>
        <button className="btn btn-primary">Отправить</button>
    </form>
);

const Comment = props => (
    <div className="comment-item">
        <div className="comment-images">
            {JSON.parse(props.data.pics_json).map(src => <img key={Math.random()} src={src} alt="#" width="150"
                                                              className="comment-image"/>)}
        </div>
        <p>{props.data.comment}</p>
    </div>
);

const comment = {
    addComment(e) {
        e.preventDefault();
        const form = e.target;
        const data = formExecute(form);
        data.method = 'addComment';
        const callback = response => {
            console.log(response);
            Data.publications[data.post_id].comments.unshift(response.data[0]);
            main.render();
            const newComment = document.querySelector('.comment-item');
            window.scrollTo({
                top: (window.pageYOffset + newComment.offsetHeight),
                behavior: 'smooth'
            });
            form.reset();
        };
        fetchfunc(form.action, callback, data);
    }
};
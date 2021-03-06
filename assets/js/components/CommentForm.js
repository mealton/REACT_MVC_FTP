const CommentForm = props => {
    const auth = sessionStorage.getItem('auth');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return auth ? (
        <form action="http://react.mealton.ru/assets/php/React.php" method="post" id="comment-form" className="validate-form"
              onSubmit={comment.addComment}>
            <input type="hidden" name="user_id" value={userInfo.id}/>
            <input type="hidden" name="post_id" value={props.id}/>
            <input type="hidden" name="pics_json" value="[]"/>
            <div className="profile">
                <img src={userInfo.profile_image} alt="" className="profile_img"/>
                <h5 className="username">{userInfo.username}</h5>
            </div>
            <div className="inputs">
                <textarea name="comment" placeholder="Комментарий" className="form-control" required/>
                <button className="btn btn-primary" type="submit">Отправить</button>
            </div>
        </form>
    ) : (
        <form title="Авторизуйтесь, чтобы комментировать публикации">
            <textarea name="comment" placeholder="Комментарий" className="form-control" disabled/>
            <button className="btn btn-primary" type="submit" disabled>Отправить</button>
        </form>
    )
};

const comment = {
    addComment(e) {
        e.preventDefault();
        const form = e.target;
        const data = validate(form);

        if(!data)
            return false;

        data.method = 'addComment';
        const callback = response => {
            console.log(response);
            ym(76319608,'reachGoal','comment');
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
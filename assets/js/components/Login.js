const Login = () => (
    <form method="post" action="http://react.mealton.ru/assets/php/React.php" className="auth login"
          onSubmit={loginForm.login}>
        <div className="form-group">
            <input type="text" name="username" placeholder="Логин" className="form-control" required/>
        </div>
        <div className="form-group">
            <input type="password" name="password" placeholder="Пароль" className="form-control" required/>
        </div>
        <button type="submit" className="btn btn-primary">Авторизоваться</button>
    </form>
);

const Logout = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return (
        <div className="logout">
            {userInfo.profile_image ? <img src={userInfo.profile_image} id="profile_image" alt="#"/> : ''}
            <form method="post" action="http://react.mealton.ru/assets/php/React.php" className="auth"
                  onSubmit={loginForm.logout}>
                <div className="form-group">
                    <p><b>{userInfo.username}</b></p>
                </div>
                <button type="submit" className="btn btn-primary">Выйти</button>
            </form>
        </div>
    );
}


const loginForm = {

    show() {
        const auth = document.querySelector('.auth');
        auth.classList.add('visible');
        document.body.onclick = e => {
            if (!closest(e.target, '.auth'))
                auth.classList.remove('visible');
        }
    },

    login(e) {
        e.preventDefault();
        const form = e.target;
        const data = formExecute(form);
        data.method = 'login';
        const callback = response => {
            console.log(response);
            if (response.result) {
                localStorage.setItem('userInfo', JSON.stringify(response.userData));
                sessionStorage.setItem('auth', 1);
                main.render();
            } else {
                const button = form.querySelector('[type="submit"]');
                button.innerHTML = 'Ошибка';
                button.classList.add('btn-danger');
                setTimeout(() => {
                    button.innerHTML = 'Авторизоваться';
                    button.classList.remove('btn-danger');
                }, 4000);
            }
        };
        fetchfunc(form.action, callback, data);
    },

    logout(e) {
        e.preventDefault();
        const form = e.target;
        const data = {method: 'logout'};
        const callback = response => {
            console.log(response);
            if (response.result) {
                localStorage.removeItem('userInfo');
                sessionStorage.removeItem('auth');
                main.render();
            }
        };
        fetchfunc(form.action, callback, data);
    }

};
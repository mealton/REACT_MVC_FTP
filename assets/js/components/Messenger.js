const Messenger = () => {

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!window.location.search.match(/messenger=1/gi) || !userInfo.id)
        return false;

    const query = parseQuery();
    const messages = query.user ? Data.messages[query.user] : [];

    messenger.date = false;

    document.body.classList.add('overflow-hidden');
    return (
        <div className="messenger">
            <div className="messenger-inner">
                <span id="messenger-close" onClick={messenger.close}/>
                <div className="userlist">
                    <Userlist userId={query.user}/>
                </div>
                <div className="messages-list">
                    <Messages messages={messages} userId={userInfo.id}/>
                    <MessagesForm from={userInfo.id} to={query.user}/>
                </div>
            </div>
        </div>
    );
};

const Userlist = props => (
    <div className="userlist-inner">
        {Data.messengerUsers.map(item => (
            <div className={'userlist-item' + (props.userId === item.id ? ' active' : '')}
                 onClick={messenger.getMessages}
                 key={item.id}
                 data-id={item.id}>
                <div className="profile-img">
                    <img
                        src={item.profile_image ? item.profile_image : 'http://react.mealton.ru/assets/img/profile-img.png'}
                        alt=""/>
                </div>
                <div className="username">{item.username}</div>
            </div>
        ))}
    </div>);


const Messages = props => (
    <div className="messages-inner">
        {props.messages.map(row => {
                let dateP = false;
                if (messenger.date !== convert_time(row.date)) {
                    dateP = convert_time(row.date);
                    messenger.date = convert_time(row.date);
                }
                return (<div data-id={row.id} key={row.id}
                             className={'message-item ' + (row.to_user === props.userId ? 'to' : 'from')}>
                        {dateP ? <p className="messages-date">{dateP}</p> : ''}
                        <div className="message-item-inner">
                            <p>{row.message}</p>
                            <sub className="time">{convert_time(row.date, 1)}</sub>
                        </div>
                    </div>
                )
            }
        )}
    </div>
);

const MessagesForm = props => (
    <form action="" id="messenger-form" onSubmit={messenger.sendMessage}>
        <div className="form-group">
            <input type="hidden" name="from_user" value={props.from}/>
            <input type="hidden" name="to_user" value={props.to ? props.to : 0}/>
            <textarea name="message" placeholder="Текст сообщения" className="form-control"/>
        </div>
        <button className="btn btn-primary">Отправить</button>
    </form>
);


const messenger = {

    action: 'http://react.mealton.ru/assets/php/React.php',

    show(e) {
        e.preventDefault();
        history.pushState(
            null,
            null,
            window.location.href + '?messenger=1');
        main.render();
    },

    close() {
        history.pushState(
            null,
            null,
            window.location.href.replace(/\??messenger=1(&user=\d+)?/gi, ''));
        main.render();
    },
    getMessages(e) {
        const userId = e.currentTarget.getAttribute('data-id');
        history.pushState(
            null,
            null,
            window.location.href.replace(/messenger=1(&user=\d+)?/gi, 'messenger=1&user=' + userId));
        main.render();
        document.getElementById('messenger-form').reset();
    },
    sendMessage(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = formExecute(form);

        if (!data.to_user)
            return false;

        data.method = 'sendMessage';
        const callback = response => {
            console.log(response);
            if (response.result) {
                Data.messages[data.to_user].push(response.message[0]);
                main.render();
                form.reset();
            }
        };
        fetchfunc(messenger.action, callback, data);
    }

};
const Music = props => (
    <div id="player">
        <div id="playlist">
            <div className="align-right caret" title="Открыть плейлист" onClick={music.openPlaylist}/>
            <div className="albums clearfix">
                <select name="albums" onChange={music.album} className="form-control">
                    <option value="default">Все альбомы</option>
                    {Data.musicAlbums.map(album => <option key={Math.random()}>{album}</option>)}
                </select>
                <span id="shuffle" onClick={music.shuffle} title="Перемешать плейлист"/>
            </div>
            <ol id="play-list">
                {props.music.map((row, i) => <li key={row.id} onClick={music.play} data-src={row.src}
                                                 className={i === 0 ? 'active' : ''}>{row.title}</li>)}
            </ol>
        </div>
        <audio id="audio"
               onPlay={music.onPlay}
               onEnded={music.playNext}
               onLoadStart={music.loading}
               onLoadedData={music.duration}
               onPause={music.onPause}
               src={props.music[0].src}
        />
        <div id="music-player">
            <div className="controls">
                <span id="play-pause" onClick={music.playPause}/>
                <span id="next" onClick={music.playNext}/>
            </div>
            <div className="bar">
                <div id="progress-bar" onClick={music.setPosition}>
                    <div id="position"/>
                </div>
                <div className="marquee"><span id="title">{props.music[0].title}</span></div>
            </div>
            <div className="volume" onClick={music.showVolume}>
                <div id="level">
                    <div id="scale"/>
                </div>
            </div>
            <div className="time fa-3x">
                <span className="pointer" onClick={music.timeDesc} id="time-position">00:00</span>/<span
                id="time-duration"><i className="fas fa-spinner fa-pulse"/></span>
            </div>
        </div>
    </div>
);

const music = {

    setPlaylist(musicList) {
        const playList = document.getElementById('play-list');
        const audio = document.getElementById('audio');
        const base = document.querySelector('base').href;
        const reg = new RegExp(base, 'gi');
        const src = decodeURI(audio.src);
        const srcClear = src.replace(reg, '/');
        const playlist = musicList.map(row => `<li onclick="music.play(this)" data-src="${row.src}"
                                                 class="${srcClear === row.src ? 'active' : ''}">${row.title}</li>`);

        playList.innerHTML = playlist.join('');
    },

    album(e) {
        const album = e.target.value;
        const musicList = (album === 'default') ?
            Data.music :
            Data.music.filter(row => row.album.trim() === album.trim());

        music.setPlaylist(musicList);
    },


    shuffle(e) {
        const icon = e.target;
        const select = document.querySelector('select[name="albums"]');
        let musicList = (select.value === 'default') ?
            Data.music :
            Data.music.filter(row => row.album.trim() === select.value.trim());

        if (icon.classList.contains('checked')) {
            icon.classList.remove('checked');
        } else {
            musicList = shuffle(musicList);
            icon.classList.add('checked')
        }

        music.setPlaylist(musicList);
    },

    loading() {
        const duration = document.getElementById('time-duration');
        duration.innerHTML = '<span id="time-duration"><i class="fas fa-spinner fa-pulse"/>';

    },

    playNext() {
        const playlist = document.getElementById('playlist');
        const active = playlist.querySelector('.active');
        const audio = document.getElementById('audio');

        if (active === playlist.lastElementChild)
            return false;

        const next = active.nextElementSibling;


        if (next !== null) {
            const src = decodeURI(next.getAttribute('data-src'));
            document.querySelectorAll('#player ol li').forEach(li => li.classList.remove('active'));
            next.classList.add('active');
            audio.src = src;
            audio.play();
        }
    },

    getRadioTitle(title) {

        const data = {
            title: title,
            method: 'getRadioTitle'
        };

        const callback = response => {
            const titleElement = document.getElementById('title');
            console.log(response.title);
            if (response.title && titleElement.innerHTML !== response.title)
                document.title = titleElement.innerHTML = response.title;
        };

        fetchfunc('http://react.mealton.ru/assets/php/React.php', callback, data);

    },

    timeDesc(e) {
        const timePosition = document.getElementById('time-position');
        if (timePosition.classList.contains('desc'))
            timePosition.classList.remove('desc');
        else
            timePosition.classList.add('desc')
    },

    onPause(){
        clearInterval(music.getRadioTitleInterval);
        document.title = main.title;
        main.playerIsOn = 0;
    },

    onPlay() {

        ym(76319608, 'reachGoal', 'music');

        main.playerIsOn = 1;

        music.playInterval = setInterval(() => {
            const audio = document.getElementById('audio');
            const timePosition = document.getElementById('time-position');

            const duration = audio.duration;
            const currentTime = timePosition.classList.contains('desc') ?
                audio.duration - audio.currentTime : audio.currentTime;

            const progressBar = document.getElementById('progress-bar');
            const progressBarPosition = progressBar.querySelector('#position');
            timePosition.innerHTML = music.time(currentTime);
            const progressBarWidth = Math.round(progressBar.offsetWidth * audio.currentTime / duration);
            progressBarPosition.style.width = progressBarWidth + 'px';
        }, 1000);

        const base = document.querySelector('base').href;
        const reg = new RegExp(base, 'gi');
        const src = decodeURI(audio.src);
        const srcClear = src.replace(reg, '/');
        const item = Data.music.find(row => row.src === srcClear);
        clearInterval(music.getRadioTitleInterval);

        const title = document.getElementById('title');

        if (parseInt(item.is_radio) === 1) {
            music.getRadioTitleInterval = setInterval(() => music.getRadioTitle(item.title), 1000);
        } else {
            const li = document.querySelector('#playlist .active');

            if (li !== undefined && title.innerHTML !== li.innerHTML)
                title.innerHTML = li.innerHTML;
            clearInterval(music.getRadioTitleInterval);
        }

        document.title = title.innerHTML;

    },

    showVolume() {
        const level = document.getElementById('level');
        const scale = level.querySelector('#scale');
        level.classList.add('visible');
        const audio = document.getElementById('audio');

        setTimeout(() => {
            level.onclick = e => {
                const y = level.offsetHeight - (e.clientY - level.getBoundingClientRect().top) - 5;

                if (y > 90 || y < 5)
                    return false;

                const volume = y / level.offsetHeight;
                scale.style.height = y + 'px';
                console.log(y);
                audio.volume = volume;
            };

            level.onwheel = e => {
                e.preventDefault();

                if (e.deltaY > 0 && audio.volume > 0.1) {
                    audio.volume -= .1;
                } else if (e.deltaY < 0 && audio.volume < .9) {
                    audio.volume += .1;
                }

                scale.style.height = (level.offsetHeight * audio.volume) + 'px';
                scale.style.opacity = audio.volume;

            }
        }, 500);


        document.body.onclick = e => {
            if (e.target !== level)
                level.classList.remove('visible');
        }
    },

    setPosition(e) {
        const audio = document.getElementById('audio');
        if (audio.paused)
            return false;
        const progressBar = document.getElementById('progress-bar');
        const x = e.clientX - progressBar.getBoundingClientRect().left;
        audio.currentTime = x / progressBar.offsetWidth * audio.duration;
    },

    openPlaylist(e) {
        const playList = e.currentTarget.parentNode;
        playList.className = playList.classList.contains('opened') ? '' : 'opened';
    },

    duration() {

        const audio = document.getElementById('audio');
        const duration = document.getElementById('time-duration');

        if (!isFinite(audio.duration)) {
            duration.innerHTML = '99:99';
            return false;
        }

        duration.innerHTML = music.time(audio.duration);
    },

    time(time) {
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);

        if (minutes === 0)
            minutes = '00';
        else if (minutes < 10)
            minutes = '0' + parseInt(minutes);

        if (seconds === 0)
            seconds = '00';
        else if (seconds < 10)
            seconds = '0' + parseInt(seconds);

        return minutes + ':' + seconds;
    },

    playPause() {
        const audio = document.getElementById('audio');
        if (audio.paused)
            audio.play();
        else {
            audio.pause();
            clearInterval(music.playInterval)
        }
    },

    play(e) {
        const li = e.tagName === 'LI' ? e : e.currentTarget;
        const src = decodeURI(li.getAttribute('data-src'));
        const audio = document.getElementById('audio');
        if (src) {
            document.querySelectorAll('#player ol li').forEach(li => li.classList.remove('active'));
            li.classList.add('active');
            audio.src = src;
            audio.play();
        }
    },
};
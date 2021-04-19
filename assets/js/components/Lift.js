const Lift = () => <div id="lift" onClick={lift.lift}/>;


window.onscroll = e => {
    const lift = document.getElementById('lift');

    const sidebar = document.querySelector('.aside-inner');
    const left = sidebar.offsetLeft;
    const width = sidebar.offsetWidth;

    sidebar.classList.add('fixed');
    sidebar.style.left = left + 'px';
    sidebar.style.width = width + 'px';

    if (window.pageYOffset > 800)
        lift.classList.add('visible');
    else
        lift.classList.remove('visible');
};


const lift = {
    lift(e) {
        if (e.target.classList.contains('visible'))
            window.scrollTo({top: 0, behavior: 'smooth'});
    }
};
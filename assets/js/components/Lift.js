const Lift = () => <div id="lift" onClick={lift.lift}/>;


window.onscroll = e => {
    const lift = document.getElementById('lift');
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
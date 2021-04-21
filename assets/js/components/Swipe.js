const Swipe = {
    showSideBar(e) {
        Swipe.sideBar.classList.add('visible');
        document.body.classList.add('overflow-hidden');
        document.body.onclick = e => {
            if (!closest(e.target, 'aside'))
                Swipe.hideSidebar();
        }
    },
    hideSidebar() {
        document.body.classList.remove('overflow-hidden');
        Swipe.sideBar.classList.remove('visible');
    }
};

if (screen.width < 1000) {
    const swipeLimit = 80;
    const menuBtn = document.querySelector('.navbar-toggler');


    window.ontouchstart = e => {
        Swipe.init = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        Swipe.sideBar = document.querySelector('aside');
    };

    window.ontouchmove = e => {
        if (e.touches[0].clientX > Swipe.init.x + swipeLimit)
            Swipe.showSideBar(e);
        else if (e.touches[0].clientX < Swipe.init.x - swipeLimit)
            Swipe.hideSidebar();
    };
}

/*
*
*
# catch pdf and redirect no pdf_logger.php
RewriteRule (^.*\.pdf)	/pdf_logger.php?url=$1 [QSA,L]
*
* Redirect 301 /newsletter/newsletter_images_neftegaz2021-scheme-fluid-line-1.pdf http://fluidaline.ru/newsletter/newsletter_images_neftegaz2021-scheme-fluid-line_Optimized.pdf
*
* */
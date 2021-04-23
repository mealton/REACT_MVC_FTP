const Cookie = {

    get(cookie_name) {
        const results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
        return results ? unescape(results[2]) : null;
    },

    set(name, value, exp_y, exp_m, exp_d, path, domain, secure) {
        let cookie_string = name + "=" + escape(value);

        if (exp_y) {
            const expires = new Date(exp_y, exp_m, exp_d);
            cookie_string += "; expires=" + expires.toGMTString();
        }

        if (path)
            cookie_string += "; path=" + escape(path);

        if (domain)
            cookie_string += "; domain=" + escape(domain);

        if (secure)
            cookie_string += "; secure";

        document.cookie = cookie_string;
    },

    delete(cookie_name) {
        const cookie_date = new Date();  // Текущая дата и время
        cookie_date.setTime(cookie_date.getTime() - 1);
        document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
    }
};
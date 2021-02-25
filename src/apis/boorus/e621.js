const fetch = require('node-fetch');

class E621 {

    static request(endpoint, params = [], options = {}) {
        options = Object.assign({
            method: 'GET',
            headers: { 'User-Agent': E621.USER_AGENT },
        }, options);

        if (E621.USERNAME && E621.API_KEY && !options.headers.Authorization) {
            options.headers.Authorization = `Basic ${Buffer.from(`${E621.USERNAME}:${E621.API_KEY}`).toString('base64')}`;
        }

        params = params.map((param) => `${param[0]}=${encodeURIComponent(param[1])}`).join('&');
        const url = `https://e621.net/${endpoint}.json?${params}`;
        return fetch(url, options).then(res => res.json());
    }

    static tags(tags = String()) {
        return E621.request('tags', [['search[name_matches]', tags]])
    }

    static random(tags = String()) {
        return E621.request('posts/random', [['tags', tags]])
            .then(res => {
                if (!res.post) return { success: false, message: 'There are no posts for the requested tag(s)' };
                return Object.assign({ success: true }, res.post)
            });
    }

    static autocomplete(tag = String()) {
        return E621.request('tags/autocomplete', [['search[name_matches]', tag]]);
    }

    static get404() {
        return E621.random('404_(not_found_error)').then(res => res.file.url);
    }
};

E621.API_KEY = process.env.E621_API_KEY || null;
E621.USERNAME = process.env.E621_USERNAME || null;
E621.USER_AGENT = process.env.E621_USER_AGENT = 'nodejs app'
module.exports = E621;

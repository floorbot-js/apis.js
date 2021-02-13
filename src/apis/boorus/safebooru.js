const fetch = require('node-fetch');

class Safebooru {

    static request(endpoint, params = [], options = {}) {
        options = Object.assign({
            method: 'GET',
            headers: {}
        }, options);

        if (Safebooru.USERNAME && Safebooru.API_KEY && !options.headers.Authorization) {
            options.headers.Authorization = `Basic ${Buffer.from(`${Safebooru.USERNAME}:${Safebooru.API_KEY}`).toString('base64')}`;
        }

        params = params.map((param) => `${param[0]}=${param[1]}`).join('&');
        const url = `https://safebooru.donmai.us/${endpoint}.json?${params}`;
        return fetch(url, options).then(res => res.json());
    }

    static count(tags = String()) {
        return Safebooru.request('counts/posts', [['tags', tags]]);
    }

    static random(tags = String()) {
        return Safebooru.request('posts/random', [['tags', tags]]);
    }

    static autocomplete(tag = String(), limit = 10) {
        return Safebooru.request('autocomplete', [
            ['search[query]', tag],
            ['search[type]', 'tag_query'],
            ['limit', limit]
        ]);
    }

    static get404() {
        return Safebooru.random('pool:16069').then(res => res.large_file_url);
    }
}

Safebooru.USERNAME = process.env.SAFEBOORU_USERNAME || null;
Safebooru.API_KEY = process.env.SAFEBOORU_API_KEY || null;
module.exports = Safebooru;

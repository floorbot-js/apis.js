const fetch = require('node-fetch');

class Danbooru {

    static request(endpoint, params = [], options = {}) {
        options = Object.assign({
            method: 'GET',
            headers: {}
        }, options);

        if (Danbooru.USERNAME && Danbooru.API_KEY && !options.headers.Authorization) {
            options.headers.Authorization = `Basic ${Buffer.from(`${Danbooru.USERNAME}:${Danbooru.API_KEY}`).toString('base64')}`;
        }

        params = params.map((param) => `${param[0]}=${param[1]}`).join('&');
        const url = `https://danbooru.donmai.us/${endpoint}.json?${params}`;
        return fetch(url, options).then(res => res.json());
    }

    static count(tags = String()) {
        return Danbooru.request('counts/posts', [['tags', tags]]);
    }

    static random(tags = String()) {
        return Danbooru.request('posts/random', [['tags', tags]]);
    }

    static autocomplete(tag = String(), limit = 10) {
        return Danbooru.request('autocomplete', [
            ['search[query]', tag],
            ['search[type]', 'tag_query'],
            ['limit', limit]
        ]);
    }

    static get404() {
        return Danbooru.random('pool:16069').then(res => res.large_file_url);
    }
}

Danbooru.USERNAME = process.env.DANBOORU_USERNAME || null;
Danbooru.API_KEY = process.env.DANBOORU_API_KEY || null;
module.exports = Danbooru;

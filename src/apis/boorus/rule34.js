const fetch = require('node-fetch');
const xml2js = require('xml2js');

class Rule34 {

    static request(endpoint, params = [], options = {}) {
        options = Object.assign({ method: 'GET' }, options);
        params = [['page', 'dapi'], ['s', 'post'], ['q', 'index']].concat(params)
        params = params.map((param) => `${param[0]}=${encodeURIComponent(param[1])}`).join('&');
        const url = `https://rule34.xxx/${endpoint}.php?${params}`;
        return fetch(url, options);
    }

    static count(tags = String(), options) {
        return Rule34.request('index', [
         ['tags', tags],
         ['limit', 1]
     ], options)
            .then(res => res.text())
            .then(xml => xml2js.parseStringPromise(xml))
            .then(json => {
                return {
                    count: parseInt(json.posts['$'].count),
                    offset: parseInt(json.posts['$'].offset),
                    success: true
                }
            })
    }

    static random(tags = String()) {
        return Rule34.count(tags).then(res => {
            if (!res.count) return { success: false, message: 'There are no posts for the requested tag(s)' };
            const params = [
                ['pid', Math.min(res.count, Rule34.MAX_PAGE) * Math.random() << 0],
                ['limit', 1]
            ];
            if (tags && tags.length) params.push(['tags', tags]);
            return Rule34.request('index', params)
                .then(res => res.text())
                .then(xml => xml2js.parseStringPromise(xml))
                .then(json => {
                    const post = json.posts.post[0]['$'];
                    post.total_posts = res.count;
                    post.success = true;
                    return post;
                });
        });
    }

    static autocomplete(tag = String()) {
        return Rule34.request('autocomplete', [['q', tag]])
            .then(res => res.json())
            .then(res => {
                // The post count is attached to the label
                res.forEach(tag => tag.count = parseInt(/(\d+)\)$/.exec(tag.label)[1]));
                return res;
            });
    }

    static get404() {
        return Promise.resolve('https://rule34.xxx/images/404.gif');
    }
};

// Rule34 accessible page limit
Rule34.MAX_PAGE = 200000;
module.exports = Rule34;

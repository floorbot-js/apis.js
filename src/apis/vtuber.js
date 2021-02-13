const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

class VTuber {
    static request(endpoint, params = [], options = {}) {
        options = Object.assign({ method: 'GET' }, options);
        params = params.map((param) => `${param[0]}=${param[1]}`).join('&');
        const url = `https://virtualyoutuber.fandom.com/${endpoint}?${params}`;
        return fetch(url, options).then(res => res.json());
    }

    static searchVTubers(query) {
        return VTuber.request('wikia.php', [
            ['controller', 'UnifiedSearchSuggestionsController'],
            ['method', 'getSuggestions'],
            ['format', 'json'],
            ['scope', 'internal'],
            ['query', query]
        ]).then(res => {
            return res.suggestions
                .filter(suggestion => !suggestion.includes('/'))
                .filter(suggestion => !suggestion.includes('(disambiguation)'));
        })
    }

    static getVTuber(name) {
        const url = `https://virtualyoutuber.fandom.com/wiki/${name.replace(/\s/, '_')}`

        // <https://samiprogramming.medium.com/puppeteer-on-raspbian-nodejs-3425ccea470e>
        return new Promise((resolve, reject) => {
            if (process.arch !== 'arm') return resolve(puppeteer.launch());
            return resolve(puppeteer.launch({
                headless: true,
                executablePath: '/usr/bin/chromium-browser',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }));
        }).then(browser => {
            return browser.newPage().then(page => {
                page.setDefaultNavigationTimeout(0);
                return page.goto(url).then(() => {
                    return page.content();
                }).then(content => {
                    const data = {
                        profileUrl: url,
                        name: /id\=\"firstHeading\".*?\>(.*?)\</gm.exec(content)?. [1],
                        originalName: /Original Name(?:.|\n)*?">(.*?)</gm.exec(content)?. [1],
                        imageUrl: /og:image" content="(.*?)"/gm.exec(content)?. [1],
                        nicknames: (/data-source="nick_name"(?:.|\n)*?pi-font">(.*?)<\/div>/gm.exec(content)?. [1] || String()).split('<br>'),
                        description: /og:description" content="(.*?)\. 1/gm.exec(content)?. [1],
                        channelLink: /data-source="channel"(?:.|\n)*?href="(.*?)"/gm.exec(content)?. [1],
                        channelName: /data-source="channel"(?:.|\n)*?href=".*?">(.*?)<\/a>/gm.exec(content)?. [1],
                        gender: /data-source="gender"(?:.|\n)*?pi-font">(.*?)</gm.exec(content)?. [1],
                        age: /data-source="age"(?:.|\n)*?pi-font">(.*?)</gm.exec(content)?. [1],
                        birthday: /data-source="birthday"(?:.|\n)*?pi-font">(.*?)</gm.exec(content)?. [1],
                        height: /data-source="height"(?:.|\n)*?pi-font">(.*?)</gm.exec(content)?. [1]
                    }
                    return browser.close().then(() => {
                        return data;
                    });
                })
            })
        })
    }
};

module.exports = VTuber;

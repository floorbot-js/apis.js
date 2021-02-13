const fetch = require('node-fetch');

class AniList {

    static request(query, variables) {
        return fetch(`https://graphql.anilist.co`, {
            method: 'POST',
            body: JSON.stringify({ query: query, variables: variables }),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json());
    }
}

module.exports = AniList;

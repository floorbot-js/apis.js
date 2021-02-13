# apis.js

These are web apis that floorbot uses

### Installation

```bash
npm install git://github.com/floorbot-js/apis.js
```

### Booru API Examples

#### [Danbooru](http://danbooru.donmai.us/) Examples

```js
const { Danbooru } = require('apis.js');

Danbooru.USERNAME = '<username>';                        // An optional danbooru username
Danbooru.API_KEY = '<api-key>'                           // An optional danbooru api key

Danbooru.count('1girl').then(console.log);               // Get the total post count for specified tags
Danbooru.random('1girl').then(console.log);              // Get a random post from specified tags
Danbooru.autocomplete('1g').then(console.log);           // Get autocomplete suggestions for tag partials
Danbooru.get404().then(console.log);                     // Get a random danbooru 404 image url
```

#### [e621](https://e621.net/) Examples

```js
const { E621 } = require('apis.js');

E621.USER_AGENT = '<:app: (by :username: on e621)>';     // Add a custom user agent to the headers

E621.tags('solo').then(console.log);                     // Get info and data for specified tags
E621.random('solo').then(console.log);                   // Get a random post from specified tags
E621.autocomplete('so').then(console.log);               // Get autocomplete suggestions for tag partials
E621.get404().then(console.log);                         // Get a random e621 404 image url
```

#### [Rule34](https://rule34.xxx/) Examples

```js
const { Rule34 } = require('apis.js');

Rule34.count('1girl').then(console.log);                 // Get the total post count for specified tags
Rule34.random('1girl').then(console.log);                // Get a random post from specified tags
Rule34.autocomplete('1g').then(console.log);             // Get autocomplete suggestions for tag partials
Rule34.get404().then(console.log);                       // Get a random rule34 404 image url
```

Note that the api returns in XML format and this package uses the [xml2js](https://www.npmjs.com/package/xml2js) dependency to convert this to a js object

#### [Safebooru](http://safebooru.donmai.us/) Examples

```js
const { Safebooru } = require('apis.js');

Safebooru.USERNAME = '<username>';                       // An optional safebooru username
Safebooru.API_KEY = '<api-key>'                          // An optional safebooru api key

Safebooru.count('1girl').then(console.log);              // Get the total post count for specified tags
Safebooru.random('1girl').then(console.log);             // Get a random post from specified tags
Safebooru.autocomplete('1g').then(console.log);          // Get autocomplete suggestions for tag partials
Safebooru.get404().then(console.log);                    // Get a random safebooru 404 image url
```

### [AniList](https://anilist.gitbook.io/anilist-apiv2-docs/) API Examples

```js
const { AniList } = require('apis.js');

AniList.request('<query.gql>', { vars })                 // Query the AniList GraphQL API
    .then(console.log);
```

### [OpenWeather](https://openweathermap.org/api/) API Examples

```js
const { OpenWeather } = require('apis.js');

OpenWeather.API_KEY = '<api-key>'

OpenWeather.forecast(params).then(console.log);          // Get the forecast for s specified search
OpenWeather.weather(params).then(console.log);           // Get the weather for s specified search
```

### [UrbanDictionary](https://www.urbandictionary.com/) API Examples

```js
const { UrbanDictionary } = require('apis.js');

UrbanDictionary.define('word').then(console.log);        // Get the definition of a specified word
UrbanDictionary.random().then(console.log);              // Get the definition of a random word
```

### [VTuber](https://virtualyoutuber.fandom.com/wiki/Virtual_YouTuber_Wiki) API Examples

```js
const { VTuber } = require('apis.js');

VTuber.searchVTubers('gura').then(console.log);          // Get a list of VTuber that can be fetched
VTuber.getVTuber().then(console.log);                    // Get details of the specified VTuber
```

Note that this is not an official API and instead a scraper that requires [puppeteer](https://www.npmjs.com/package/puppeteer) to work correctly. However on ARM architectures puppeteer does not always work and requires chromium to be installed separately. There is a helpful [tutorial](https://samiprogramming.medium.com/puppeteer-on-raspbian-nodejs-3425ccea470e) for this but essentially just says to run the following command to install required packages

```bash
sudo apt install chromium-browser chromium-codecs-ffmpeg
```

and use the following code on ARM processors which this package does automatically

```js
puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
}).then(browser => { ... });
```

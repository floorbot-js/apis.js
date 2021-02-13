const fetch = require('node-fetch');

class OpenWeather {
    static request(endpoint, params = [], options = {}) {
        options = Object.assign({ method: 'GET' }, options);
        if (!params.some(param => param[0] === 'APPID')) params.push(['APPID', OpenWeather.API_KEY])
        params = params.map((param) => `${param[0]}=${param[1]}`).join('&');
        const url = `https://api.openweathermap.org/data/2.5/${endpoint}?${params}`;
        return fetch(url, options).then(res => res.json());
    }

    static forecast(params) { return OpenWeather.request('forecast', params); }
    static weather(params) { return OpenWeather.request('weather', params); }
};

OpenWeather.API_KEY = process.env.OPEN_WEATHER_API_KEY || null;
module.exports = OpenWeather;

const {CRYPTO_API_KEY} = require('../config');
const axios = require('axios');

const BASE_URL = "https://coingecko.p.rapidapi.com"

class Crypto {
    static async getMarketChart(id, currency){
        currency = currency.toLowerCase();
        let res = await axios({
            method: 'get',
            url: `${BASE_URL}/coins/${id}/market_chart`,
            params: {vs_currency: currency, days: 2},
            headers: {
                'X-RapidAPI-Host': 'coingecko.p.rapidapi.com',
                'X-RapidAPI-Key': CRYPTO_API_KEY
            }
        });
        return res.data;
    }
};

module.exports = Crypto;
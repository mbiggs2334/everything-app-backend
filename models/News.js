const {NEWS_API_KEY} = require('../config');
const axios = require('axios');

const BASE_URL = "https://newsx.p.rapidapi.com/search";

class News {
    static async getNewsStories(skip='0'){
        try {
            let res = await axios({
                method: 'GET',
                url: BASE_URL,
                params: {limit: '10', skip},
                headers: {
                    'X-RapidAPI-Host': 'newsx.p.rapidapi.com',
                    'X-RapidAPI-Key': '08d1bd2c2fmsh0a1862eb3327676p12955djsneb36f2f23e49'
                }
            });
            return res.data;
        } catch(e){
            throw new Error(e);
        }
        
    }
};

module.exports = News;
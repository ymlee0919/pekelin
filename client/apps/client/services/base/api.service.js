const axios = require('axios');
const apiUrl = process.env.API_URL;

async function load(url) {
    try {
        const response = await axios.get(`${apiUrl}${url}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching data');
    }
}

module.exports = { load };
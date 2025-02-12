const api = require('./base/api.service');

async function loadHomeOffers() {
    return await api.load('/offers/home');
}

async function loadOffers() {
    return await api.load('/offers');
}

module.exports = {loadHomeOffers, loadOffers};
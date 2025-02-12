const api = require('./base/api.service');

async function loadServices() {
    return await api.load('/services');
}

async function loadServicesList() {
    return await api.load('/services/list');
}

module.exports = {loadServices, loadServicesList};
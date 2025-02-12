const api = require('./base/api.service');

async function loadBusinessInfo() {
    return await api.load('/business');
}

module.exports = {loadBusinessInfo};
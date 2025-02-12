const api = require('./base/api.service');

async function loadHomeGallery() {
    return await api.load('/gallery/home');
}

async function loadGallery() {
    return await api.load('/gallery');
}

module.exports = {loadHomeGallery, loadGallery};
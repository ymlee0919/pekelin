var express = require('express');
var router = express.Router();

var galleryService = require('./../services/gallery.service');

/* GET Gallery page. */
router.get('/', async function(req, res, next) {
  	let images = await  galleryService.loadGallery();
	res.render('gallery.html.twig', {images});
});

module.exports = router;

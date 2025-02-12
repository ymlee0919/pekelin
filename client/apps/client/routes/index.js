var express = require('express');
var router = express.Router();

var galleryService = require('./../services/gallery.service');
var offersService = require('./../services/offers.service');
var servicesService = require('./../services/services.service');

/* GET home page. */
router.get('/', async function(req, res, next) {
	let [images, offers, services] = await Promise.all([
		galleryService.loadHomeGallery(),
		offersService.loadHomeOffers(),
		servicesService.loadServices()
	]);

	res.render('home.html.twig', {
		images, offers, services
	});
});

router.get('/home', function(req, res, next) {
  	res.render('home.html.twig');
});

module.exports = router;

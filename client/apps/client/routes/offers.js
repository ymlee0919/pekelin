var express = require('express');
var router = express.Router();

var offersService = require('./../services/offers.service');

/* GET offers page. */
router.get('/', async function(req, res, next) {
  let offers = await offersService.loadOffers();
  res.render('offers.html.twig', {offers});
});

module.exports = router;

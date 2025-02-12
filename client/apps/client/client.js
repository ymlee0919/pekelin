const express = require('express');

// Config
const configureViewEngine = require('./server/viewEngine');
const configureServer = require('./server/config');

// Middlewares
const setLocals = require('./middleware/locals.middleware');
const errorHandler = require('./middleware/error.middleware');
const notFoundHandler = require('./middleware/notFound.middleware');

// Create server
var client = express();

// Configure view engine
configureViewEngine(client);

// Configure server features
configureServer(client);

// Middlewares
client.use(setLocals);


// Configure routes
const indexRouter = require('./routes/index');
const offersRouter = require('./routes/offers');
const galleryRouter = require('./routes/gallery');
const contactRouter = require('./routes/contact');

client.use('/', indexRouter);
client.use('/offers', offersRouter);
client.use('/gallery', galleryRouter);
client.use('/contact', contactRouter);

client.use(notFoundHandler);
client.use(errorHandler);

module.exports = client;

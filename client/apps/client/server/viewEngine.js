const path = require('path');
const twig = require('twig');

module.exports = (app) => {
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'twig');
  app.engine('twig', twig.__express);
};

var businessService = require('./../services/business.service');

module.exports = async (req, res, next) => {
    if(req.method === 'GET') {
        res.locals.statics = process.env.STATICS_URL;
        res.locals.business = await businessService.loadBusinessInfo();
    }
    
    next();
}
  
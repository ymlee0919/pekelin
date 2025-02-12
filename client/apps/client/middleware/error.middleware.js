module.exports = (err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    if (err.status === 404) {
		console.log('Error 404')
      	//res.render('404');
    } else {
		console.log(err)
      	//res.render('error');
    }
};
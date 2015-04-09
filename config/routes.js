var indexController = require('../controllers/index');
var aboutController = require('../controllers/about');
var paymentsController = require('../controllers/payments');

module.exports = function (app, passport) {
	app.get('/', indexController.index)
	app.get('/about', aboutController.index)
	app.get('/payments/create', paymentsController.index)
	
}
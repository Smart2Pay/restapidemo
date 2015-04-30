var indexController = require('../controllers/index');
var paymentsController = require('../controllers/payments');

module.exports = function (app, passport) {
	app.get('/', indexController.index)
	app.get('/partials/:viewname', indexController.partials)
	
	app.post('/payments', paymentsController.post)	
	app.post('/payments/get', paymentsController.get)	
	app.get('/payments/methods', paymentsController.methods)
	app.get('/payments/appSettings', paymentsController.appSettings)
	
	
}
var indexController = require('../controllers/index');
var paymentsController = require('../controllers/payments');

module.exports = function (app, passport) {
	app.get('/', indexController.index('paymentsCtrl','init', 'Payments'))

	app.get('/payments/init', paymentsController.init)
	app.post('/payments', paymentsController.post)
	
}
var indexController = require('../controllers/index');
var aboutController = require('../controllers/about');

module.exports = function (app, passport) {
	app.get('/', indexController.index)
	app.get('/about', aboutController.index)
}
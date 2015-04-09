var express = require('express')
var jade = require('jade')
var morgan = require('morgan')
var config = require('./config/routes')
var passport = require('passport')
var should = require('should')
var mocha = require('mocha')
var winston = require('winston')
var mylogger = require('./node_modules_my/logger')

//initialize app server
var app = express()

//initilize logging for app server
app.use(morgan('dev', {immediate: true}))

//initialize logger singleton
var logger = mylogger()

//setup view engine
app.set('view engine', 'jade')
app.set('views', __dirname + '/views');


// bootstrap routes
require('./config/routes')(app, passport);
app.use(express.static('public'));

// start app server
var server = app.listen(3000, function(){
	var host = server.address().address
	var port = server.address().port

	logger.info('Server listening on ' + host + ':' + port)
})


module.exports = app;
var express = require('express')
var jade = require('jade')
var morgan = require('morgan')
var config = require('./config/routes')
var passport = require('passport')
var should = require('should')
var mocha = require('mocha')
var winston = require('winston')
var mylogger = require('./node_modules_my/logger')
var os = require('os')

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
var server = app.listen(process.env.port || 3000, function(){
	var host = server.address().address
	var port = server.address().port
	logOSInfo(logger)
	logger.info('Server listening on ' + host + ':' + port)
})


function logOSInfo(logger){
	logger.info('hostname: ',os.hostname())
	logger.info('platform: ',os.platform())
	logger.info('release: ', os.release())
	logger.info('uptime: ',os.uptime())
	logger.info('arch: ', os.arch())
	logger.info('cpus: ', os.cpus().length)
	logger.info('total mem: ', os.totalmem()/1024/1000000 + ' Gb')
	logger.info('free mem: ', os.freemem()/1024/1000000 + ' Gb')
}

module.exports = app;



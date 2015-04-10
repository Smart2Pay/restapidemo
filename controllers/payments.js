var jade = require('jade')
var request = require('request')
var fs = require('fs');
var winston = require('winston')
var config = require('config');
var mylogger = require('../node_modules_my/logger')

var logger = mylogger()

exports.create = function(req, res){
	var renderPayments = jade.compileFile('./views/paymentsCreate.jade', {pretty: true})
 	var htmlPayments  =  renderPayments()
	res.send(htmlPayments)

}

exports.init = function(req,res){
	res.send(config.get('testData'))
}

exports.post = function(req, res){
	var message = {};
    req.on('data', function (data) {
    	
        message = JSON.parse(data);
        //console.log(message)
        if (message.length > 1e6)
            req.connection.destroy();

    });
    req.on('end', function () { 
        //console.log(body['headers'])
		 var options = {
			 url: config.get('env.host') + '/payments',
	    	 headers: {
	        	"Authorization": "Basic " + message['headers']
	    	},
	    	body: message.body
		}  	     
		logger.info(options)
		request.post(options, function (error, response, body){
			 var parsedBody = null
			  parsedBody = contentParse(body)
			  if (!error && response.statusCode >= 200 && response.statusCode < 300) {
			  	
			    logger.info(response.statusCode)
			    
			  }
			  else{
			  	logger.error(response.statusCode)
			  	
			  }
			  logger.info(body)
			  res.send(JSON.stringify(parsedBody))
		})

	})
}

exports.get = function(req, res){

	var renderPayments = jade.compileFile('./views/payments.jade', {pretty: true})

	logger.info('APIKEY:' + config.util.getEnv('APIKEY'))

	var options = {
		 url: config.get('env.host') + '/payments',
    	 headers: {
        	'Authorization': 'Basic '+ config.util.getEnv('APIKEY')
    	}
	}

	logger.info(options)

	request.get(options, function (error, response, body) {				  
		  
		  var parsedBody = null
		  if (!error && response.statusCode > 200 && response.code < 300) {
		  	
		    logger.info(body)
		    parsedBody = contentParse(body)
		  }
		  else{
		  	logger.error(response.statusCode)
		  	parsedBody = ''
		  }
		  
		  var info = {info: {body : parsedBody}}
		  var htmlPayments  =  renderPayments(info)
		  res.send(htmlPayments)
		
		})
}

function contentParse(content){
    content = content.replace(/\n?\r\n/g, '<br/>' ).replace(/"/g, '\'').replace(/ /g, '&nbsp;')
    return content;
}
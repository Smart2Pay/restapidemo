var jade = require('jade')
var request = require('request')
var fs = require('fs');
var winston = require('winston')
var config = require('config');
var mylogger = require('../node_modules_my/logger')

var logger = mylogger()

exports.index = function(req, res){

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
		  if (!error && response.statusCode == 200) {
		  	
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
var jade = require('jade')
var request = require('request')
var fs = require('fs')
var url = require('url')
var winston = require('winston')
var mylogger = require('../node_modules_my/logger')
var logger = mylogger()

var config = require('config');
process.env['ALLOW_CONFIG_MUTATIONS'] = true //needed to change MerchantTransactionID (!!!)


exports.appSettings = function(req,res){
		var appSettings = config.get('appSettings')
		res.send(appSettings)
	}

exports.methods = function(req,res){
	 var paymentRequest = config.get('appSettings')
     var options = {
			 url: config.get('appSettings.host') + '/methods?country='+req.query.country,
	    	 headers: {
	        	"Authorization": "Basic " + new Buffer(paymentRequest.APIKEY).toString('base64')
	    	}
		}  	   
	console.log(options)
    request.get(options, function (error, response, body) { 
			var data = {}
			console.log(error)
			console.log(body)
			res.statusCode = response.statusCode
			res.send(body)
		
	})
}


exports.post = function(req, res){
	var message = {};
    req.on('data', function (data) {
    	
        message = JSON.parse(data);        
    	if (message.length > 1e6)
            req.connection.destroy();

    });
    req.on('end', function () { 
        //console.log(body['headers'])
		 var options = {
			 url: config.get('appSettings.host') + '/payments',
	    	 headers: {
	        	"Authorization": "Basic " + message['headers']
	    	},
	    	body: message.body
		}  	     
		logger.info(options)
		request.post(options, function (error, response, body){
			  var data = {}
			  parsedBody = contentParse(body)
			  if (!error && response.statusCode >= 200 && response.statusCode < 300) {
			  	
			    logger.info(response.statusCode)
			    
			  }
			  else{
			  	logger.error(response.statusCode)
			  	
			  }
			  logger.info(body)
			  data.headers = response.headers
			  data.statusCode = response.statusCode
			  data.body = parsedBody
			  res.send(JSON.stringify(data))
		})

	})
}

exports.getTrxId = function(req, res){
	var message = {}
	req.on('data', function (data) {
        message = JSON.parse(data); 
           
    	if (message.length > 1e6)
            req.connection.destroy()

    })
    req.on('end', function () { 
    	 console.log(req.params.id)  
		 var options = {
			 url: config.get('appSettings.host') + '/payments/' + req.params.id,
	    	 headers: {
	        	"Authorization": "Basic " + message['headers']
	    	}
	    }
	    console.log(options)
	    request.get(options, function (error, response, body) {		
			var data = {}
			var parsedBody = null
			if (!error && response.statusCode >= 200 && response.statusCode < 300) {
				//logger.info(body)
				parsedBody = body
			}
			else{
			  	logger.error(response.statusCode + error)
			  	parsedBody = ''
			}
			data.headers = response.headers
			data.statusCode = response.statusCode
			var info = {info: {body : parsedBody}}
			data.body = info
			console.log(data)
			res.send(JSON.stringify(data))
			
	    })

	})
}


exports.get = function(req, res){
	var message = {}
    req.on('data', function (data) {
    	
        message = JSON.parse(data);       
    	if (message.length > 1e6)
            req.connection.destroy()

    })
    req.on('end', function () { 
		qs = '';
		console.log(req.query)
		for(key in req.query) {
		    qs += key + '=' + req.query[key] + '&';
		}
		qs = qs.slice(0, qs.length - 1);

		 var options = {
			 url: config.get('appSettings.host') + '/payments?' + qs,
	    	 headers: {
	        	"Authorization": "Basic " + message['headers']
	    	}
	    }

		logger.info(options)
		request.get(options, function (error, response, body) {				  
			  var data = {}
			  var parsedBody = null
			  if (!error && response.statusCode >= 200 && response.statusCode < 300) {
			    //logger.info(body)
			    parsedBody = body
			  }
			  else{
			  	logger.error(response.statusCode + error)
			  	parsedBody = ''
			  }
			  data.headers = response.headers
			  data.statusCode = response.statusCode
			  var info = {info: {body : parsedBody}}
			  data.body = info
			  console.log(data)
			  res.send(JSON.stringify(data))
			
		})
		
	})
}


function contentParse(content){
    content = content.replace(/\n?\r\n/g, '<br/>' ).replace(/"/g, '\'').replace(/ /g, '&nbsp;')
    return content;
}
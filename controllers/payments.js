var jade = require('jade')
var request = require('request')

exports.index = function(req, res){
	var renderPayments = jade.compileFile('./views/payments.jade', 
	{pretty: true})
 	
	var options = {
		 url: 'https://paytest.smart2pay.com/v1/payments',
    	 headers: {
        	'Authorization': 'Basic VWhsT0xtb0RGbzFaSEdWekx1N0hxNGhWUEhZY3VQUUg6'
    	}
	}

	request.get(options, function (error, response, body) {
				  var info = {info: {body : contentParse(body)}}
					
				  if (!error && response.statusCode == 200) {
				    console.log(body) 

				  }
				  else{
				  	console.log(error) 
				  }
				  var htmlPayments  =  renderPayments(info)
				  res.send(htmlPayments)
				})
}

function contentParse(content){
    content = content.replace(/\n?\r\n/g, '<br/>' ).replace(/"/g, '\'').replace(/ /g, '&nbsp;')
    return content;
}
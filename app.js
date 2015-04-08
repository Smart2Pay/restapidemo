var express = require('express')
var jade = require('jade')
var logger = require('morgan');

var app = express()

app.set('view engine', 'jade')
app.set('views', __dirname + '/views');

try{

	var renderIndex = jade.compileFile('./views/index.jade', 
		{pretty: true})

	var htmlIndex  =  renderIndex()

	var renderAbout = jade.compileFile('./views/about.jade', 
		{pretty: true})

	var htmlAbout  =  renderAbout({info: {line1 : "This is dynamic"}})

	app.get('/', function(req, res){
		res.send(htmlIndex)
	})

	app.get('/about', function(req, res){
		res.send(htmlAbout)
	})

	var server = app.listen(3000, function(){
		var host = server.address().address
		var port = server.address().port

		console.log('Server listening on ' + host + ':' + port)
	})
}
catch(error){
	console.log('Error: ' + error)
}

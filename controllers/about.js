var jade = require('jade')

exports.index = function(req, res){
	var renderAbout = jade.compileFile('./views/about.jade', 
	{pretty: true})

	var htmlAbout  =  renderAbout({info: {line1 : "This is dynamic"}})

	res.send(htmlAbout)
}
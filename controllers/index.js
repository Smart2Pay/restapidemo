var jade = require('jade')

exports.index = function(req, res){
			var renderIndex = jade.compileFile('./views/index.jade', 
				{pretty: true})
			var htmlIndex  =  renderIndex()
			res.send(htmlIndex)
		}

exports.partials = function(req, res){
		var viewname = req.params.viewname
  		var renderIndex = jade.compileFile('./views/' + viewname + '.jade', 
				{pretty: true})
			var htmlIndex  =  renderIndex()
			res.send(htmlIndex)
	}



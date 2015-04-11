var jade = require('jade')

exports.index = function(ngController, ngAction, viewName){
		return function(req, res){
			var renderIndex = jade.compileFile('./views/index.jade', 
				{pretty: true})
			var opts = {ngController: ngController, ngAction : ngAction, viewName: viewName}
			var htmlIndex  =  renderIndex(opts)
			res.send(htmlIndex)
		}
	}


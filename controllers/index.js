var jade = require('jade')

exports.index = function(req, res){
			var renderIndex = jade.compileFile('./views/index.jade', 
				{pretty: true})

			var htmlIndex  =  renderIndex()

			res.send(htmlIndex)
		}


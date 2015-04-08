//var should = require('should')
var mocha = require('mocha')
var indexController = require('../controllers/index')
var app = require('../app')
request = require('supertest')

describe('IndexController', function(){
	describe('GET /', function(){
			it('GET should return 200 OK', function(done){
				request(app).get('/').expect(200).end(function(err, res){
				    if (err) throw err
				    done()
				  })
				
			})		
		})
	})

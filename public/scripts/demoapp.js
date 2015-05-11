var paymentsApp = angular.module('paymentsApp', ['ngSanitize', 'ngStorage','ngRoute','ui.grid', 'ui.grid.resizeColumns'])

paymentsApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider, $locationProvider){
		$routeProvider
	      .when('/payments/get',{
	      	templateUrl: 'partials/payments-get',
	        controller: 'paymentsCtrl'
	      })
	      .when('/payments', {
	        templateUrl: 'partials/payments-post',
	        controller: 'paymentsCtrl'
	      })
	      .when('/methods/get', {
	      	templateUrl: 'partials/methods-get',
	      	controller: 'methodsCtrl'
	      })
	      .otherwise(
	      {
	      	redirectTo: '/payments'
	      })
  	
  		//$locationProvider.html5Mode(true)
  	}
])


var paymentsApp = angular.module('paymentsApp', ['ngSanitize', 'ngStorage','ngRoute','ui.grid'])

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
	      .otherwise(
	      {
	      	redirectTo: '/payments'
	      })
  	
  		//$locationProvider.html5Mode(true)
  	}
])


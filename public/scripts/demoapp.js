var paymentsApp = angular.module('paymentsApp', ['ngSanitize', 'ngStorage','ngRoute']);

paymentsApp.config(['$routeProvider', 
	function($routeProvider){
		$routeProvider
	      .when('/payments', {
	        templateUrl: 'partials/payments-post',
	        controller: 'paymentsCtrl'
	      })
	      .otherwise(
	      {
	      	redirectTo: '/payments'
	      })
  	}
])


var paymentsApp = angular.module('paymentsApp', ['ngSanitize']);


paymentsApp.controller('paymentsCtrl',  function($scope, $http, $filter) {
	
	$scope.init = function(){
		var req = {url: '/payments/init'}

		$http(req).success(function(data) {
	       $scope.requestHeader = data.APIKEY
	       $scope.requestBody = JSON.stringify(data.body,null, "  ")
	       console.log($scope.requestHeader)
	       console.log($scope.requestBody)
	    });	
	}

	

	$scope.post = function(){
		
		console.log('Body:' + $scope.requestBody)
			
		if(!$scope.requestHeader || !$scope.requestBody){
			return
		}

		var req = {
			url : 'payments',
			method : 'post',
			data : {
				headers: $scope.requestHeader,
				body: $filter('cleanJson')($scope.requestBody)
			}
		}
		console.log('starting post2')

		$('.wait').show()

		$http(req)
				.success(function(data) {
					$scope.responseBody = JSON.parse(data)
					console.log($scope.responseBody)
					$('.wait').hide()
					//$scope.responseHeader = data.header
				})
	}
})



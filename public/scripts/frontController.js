var paymentsApp = angular.module('paymentsApp', ['ngSanitize']);


paymentsApp.controller('paymentsCtrl',  function($scope, $http, $filter) {
	
	angular.element(document).ready(function () {
        $scope.init()
    });


	$scope.init = function(){
		
		var req = {url: '/payments/init'}
		$http(req).success(function(data) {
	       $scope.requestHeader = data.APIKEY
	       $scope.requestBody = JSON.stringify({Payment: data.Payment},null, "  ")
	       console.log($scope.requestHeader)
	       console.log($scope.requestBody)
	    });	

	    var req = {url: '/payments/initCheckout'}
		$http(req).success(function(data) {
	       $scope.products = data;
	       $scope.shoppingCart = []
	       $scope.customer = null;
	       $scope.billingAddress = null;
	       $scope.shoppingCart[0] = true;
	       for(var $i=1;$i<$scope.products.length;$i++){
	       		$scope.shoppingCart[$i] = false
	       }
	       console.log($scope.products)
	       $scope.updateShoppingCart()
	    });	
	}

	$scope.updateShoppingCart = function(){
		var payment = JSON.parse($scope.requestBody)
		payment.Payment.Amount = 0;
		var i = 0
		$scope.shoppingCart.forEach(function(productIndex){
			if(productIndex){
				payment.Payment.Amount += $scope.products[i].price
			}
			i++
		})
		$scope.requestBody = JSON.stringify(payment, null, "  ")
		
	}

	$scope.billingAddressChanged = function(){
		var payment = JSON.parse($scope.requestBody)
		if(!payment.Payment.Customer && $scope.customer){
			payment.Payment.Customer = {}
		}
		if(!payment.Payment.BillingAdress && $scope.billingAddress){
			payment.Payment.BillingAddress = {}
		}

		if($scope.customer){
			var allNull = true;
			if($scope.customer.firstName ){
				payment.Payment.Customer.FirstName = $scope.customer.firstName
				allNull= false
			}
			else{
				delete payment.Payment.Customer.FirstName
			}
			if($scope.customer.lastName){
				payment.Payment.Customer.LastName = $scope.customer.lastName 
				allNull = false
			}
			else{
				delete payment.Payment.Customer.LastName
			}	
			if ($scope.customer.email){
				payment.Payment.Customer.Email = $scope.customer.email
				allNull = false
			}
			else{
				delete payment.Payment.Customer.Email 
			}
			if(allNull){
				delete payment.Payment.Customer
			}
		}
		if($scope.billingAddress && $scope.billingAddress.country){
			payment.Payment.BillingAddress.Country = $scope.billingAddress.country;			
		}
		else{
			delete payment.Payment.BillingAddress
		}
		$scope.requestBody = JSON.stringify(payment, null, "  ")
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
		//console.log('starting post2')

		$('.wait').show()

		$http(req)
				.success(function(data) {
					console.log(data.headers)
					$scope.responseBody = data.body
					$scope.responseStatusCode = data.statusCode
					$scope.responseHeader = JSON.stringify(data.headers, null, "  ")
			
					console.log($scope.responseBody)
					$('.wait').hide()
					//$scope.responseHeader = data.header
						
				})
	}
})



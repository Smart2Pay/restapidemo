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
		   var reqInit = {url: '/payments/initCheckout'}
		   $http(reqInit).success(function(dataInit) {
		       $scope.products = dataInit;
		       $scope.shoppingCart = []
		       $scope.customer = null;
		       $scope.billingAddress = null;
		       $scope.shoppingCart[0] = true;
		       for(var $i=1;$i<$scope.products.length;$i++){
		       		$scope.shoppingCart[$i] = false
		       }
		       console.log($scope.products)
		       $scope.updateShoppingCart()

		       $scope.methods = null
		       $scope.paymentMethod = null
		       $scope.tempMessage = "Please choose your country first..."
		    });   
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
		if($scope.billingAddress && $scope.billingAddress.country){
			$scope.methods = null
			$scope.paymentMethod = null
			payment.Payment.BillingAddress = {}
			payment.Payment.BillingAddress.Country = $scope.billingAddress.country;	
			delete payment.Payment.MethodID
			var req = {url: '/payments/methods?country=' + $scope.billingAddress.country}
			$scope.tempMessage = "Loading payment method list..."
			$http(req)
				.success(function(data) {
					$scope.tempMessage = null
					$scope.methods = data
				})
				.error(function(data, status, headers, config){
					$scope.tempMessage = "Error loading payment methods (status code: " + status + ")"
				})
			

		}
		else{
			delete payment.Payment.BillingAddress
			delete payment.Payment.MethodID
			$scope.methods = null
			$scope.paymentMethod = null
			$scope.tempMessage = "Please choose your country first..."

		}
		$scope.requestBody = JSON.stringify(payment, null, "  ")
	}

	$scope.customerChanged = function(){
		var payment = JSON.parse($scope.requestBody)
		if(!payment.Payment.Customer && $scope.customer){
			payment.Payment.Customer = {}
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
		
		$scope.requestBody = JSON.stringify(payment, null, "  ")
	}

	$scope.paymentMethodChanged = function(){
		var payment = JSON.parse($scope.requestBody)
		if($scope.paymentMethod){
			payment.Payment.MethodID = $scope.paymentMethod
		}
		else{
			delete payment.Payment.MethodID
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



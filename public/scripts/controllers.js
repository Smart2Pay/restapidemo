paymentsApp.controller('paymentsCtrl',  function($scope, $http, $filter, $localStorage) {
	
	angular.element(document).ready(function () {
		delete $localStorage.appSettings
		//alert($localStorage.appSettings)
        $scope.init()
    });

	$scope.applySettings = function(){
		$localStorage.appSettings = $filter('cleanJson')($scope.appSettings)
		$('#appSettingsDialog').modal('hide')
		$scope.init()
		
	}

	$scope.restoreSettings = function(){
		var answer = confirm("Are you sure you want to reset settings to default?");
		if(answer){
			delete $localStorage.appSettings
			//alert($localStorage.appSettings)
	        $scope.init()
	    }
		
	}


	$scope.init = function(){
		$scope.responseBody = null
		$scope.responseHeader = null
		$scope.responseStatusCode = null

		if($localStorage.appSettings){ //check if anything in local storage, if so load from there
			$scope.appSettings = JSON.parse($localStorage.appSettings)
			console.log("load from localStorage: " + $scope.appSettings)
			populateFields($scope.appSettings)
		}
		else{
			console.log("load from defaults")
			var req = {url: '/payments/init'}
			$http(req).success(function(appSettings) {
				$scope.appSettings = appSettings
				console.log(appSettings)
				populateFields(appSettings)			
			})
		}
	}

	function populateFields(appSettings){
		var num = Math.ceil(Math.random()*10000000)
		appSettings.Payment.MerchantTransactionID = num
      	$scope.requestHeader = window.btoa(appSettings.APIKEY)
		$scope.requestBody = JSON.stringify({Payment: appSettings.Payment},null, "  ")
		$scope.products = appSettings.products;	
		$scope.shoppingCart = []
		$scope.referenceNumber = null;
		$scope.customer = null;
		$scope.billingAddress = null;
		$scope.shoppingCart[0] = true;
		for(var $i=1;$i<$scope.products.length;$i++){
				$scope.shoppingCart[$i] = false
		}
		$scope.updateShoppingCart()
		$scope.methods = null
		$scope.paymentMethod = null
		$scope.tempMessage = "Please choose your country first..."
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

	$scope.referenceNumberChanged = function(){
		var payment = JSON.parse($scope.requestBody)
		if($scope.referenceNumber){
			payment.Payment.Details = {}
			payment.Payment.Details.ReferenceNumber = $scope.referenceNumber

		}
		else{
			delete payment.Payment.Details	
		}
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
					if(!data.Methods){
						$scope.tempMessage = "No methods found for country: '" + payment.Payment.BillingAddress.Country + "'" 
 					}
					else{
						$scope.tempMessage = null
						$scope.methods = data
					}

					
				})
				.error(function(data, status, headers, config){

					$scope.tempMessage = "Error loading payment methods: " + data.Message
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
					//console.log(data.headers)
					$scope.responseBody = data.body
					$scope.responseStatusCode = data.statusCode
					$scope.responseHeader = JSON.stringify(data.headers, null, "  ")
					//console.log($scope.responseBody)
					$('.wait').hide()
					console.log(data.body)
					var payment = JSON.parse($filter('cleanJson')(data.body))
					if(payment && payment.RedirectURL && config.get('appSettings').autoRedirect){
						window.location = payment.RedirectURL
					}

				})
	}
})



paymentsApp.controller('paymentsCtrl',  function($scope, $http, $filter, $localStorage) {
	
	angular.element(document).ready(function () {
        //$scope.init()
    });

	$scope.$on('reload', function() {$scope.init()});

	$scope.applySettings = function(){
		alert(JSON.stringify($filter('cleanJson')($scope.appSettings)))
		$localStorage.appSettings = JSON.stringify($filter('cleanJson')($scope.appSettings))
		//$('#appSettingsDialog').modal('hide').data( 'modal', null );
		$scope.init()
		
	}

	$scope.restoreSettings = function(){
		var answer = confirm("Are you sure you want to reset settings to default?");
		if(answer){
			delete $localStorage.appSettings
	        $scope.init()
	    }
		
	}


	$scope.init = function(){
		$scope.requestDefinition = null
		$scope.responseBody = null
		$scope.responseHeader = null
		$scope.responseStatusCode = null
		var parsedAppSettings = null
		try{

			parsedAppSettings = JSON.parse($localStorage.appSettings)
			console.log(parsedAppSettings)
		}
		catch(e){
			console.log("Could not load from local storage")
		}
		if(parsedAppSettings){ //check if anything in local storage, if so load from there
			$scope.appSettings = parsedAppSettings
			console.log("load from localStorage")
			//console.log($scope.appSettings)
			populateFields($scope.appSettings)
		}
		else{
			console.log("load from defaults")
			var req = {url: '/payments/appSettings'}
			$http(req).success(function(appSettings) {
				$scope.appSettings = appSettings
				//console.log($scope.appSettings)
				populateFields($scope.appSettings)			
			})
		}
		
	}

	function populateFields(appSettings){
		console.log(appSettings)
		var num = Math.ceil(Math.random()*10000000)
		appSettings.Payment.MerchantTransactionID = num
      	$scope.requestDefinition = 'POST ' + appSettings.host + '/payments/'
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
				body: JSON.stringify($filter('cleanJson')($scope.requestBody))
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
					var payment = $filter('cleanJson')(data.body)
					if(payment && payment.RedirectURL && $scope.appSettings.autoRedirect){
						console.log(payment.RedirectURL)
						window.location = payment.RedirectURL
					}

				})
	}
})
.controller('paymentsGetCtrl',  function($scope, $http, $filter, $localStorage) {
	angular.element(document).ready(function () {
        //$scope.init()
    });

	$scope.init = function(){
		$scope.requestDefinition = null
		$scope.responseBody = null
		$scope.responseHeader = null
		$scope.responseStatusCode = null
		$scope.requestTrxId = null
		var parsedAppSettings = null
		try{

			parsedAppSettings = JSON.parse($localStorage.appSettings)
			console.log(parsedAppSettings)
		}
		catch(e){
			console.log("Could not load from local storage")
		}
		if(parsedAppSettings){ //check if anything in local storage, if so load from there
			$scope.appSettings = parsedAppSettings
			console.log("load from localStorage")
			//console.log($scope.appSettings)
			populateFields($scope.appSettings)
		}
		else{
			console.log("load from defaults")
			var req = {url: '/payments/appSettings'}
			$http(req).success(function(appSettings) {
				$scope.appSettings = appSettings
				//console.log($scope.appSettings)
				populateFields($scope.appSettings)			
			})
		}
		
	}

	$scope.getTrxIdInfoChanged = function(){
		$scope.requestTrxId = $filter('cleanHtml')($scope.requestTrxId)

		if(!$scope.requestTrxId || $scope.requestTrxId.length == 0){
			$scope.init()
			return
		}
		$scope.requestDefinition = 'GET ' + $scope.appSettings.host + '/payments/' + $scope.requestTrxId

		var req = {
			url : 'payments/get/'+$scope.requestTrxId,
			method : 'post',
			data : {
				headers: $scope.requestHeader,
			}
		}
		//console.log('starting post2')

		$('.wait').show()
		$http(req)
				.success(function(data) {
					//console.log(data.headers)
					$scope.responseBody = data.body.info.body
					$scope.responseStatusCode = data.statusCode
					$scope.responseHeader = JSON.stringify(data.headers, null, "  ")
					//console.log($scope.responseBody)
					$('.wait').hide()
					console.log(data.body)
				})

	}

	function populateFields(appSettings){
      	$scope.requestDefinition = 'GET ' + appSettings.host + '/payments/'
      	$scope.requestHeader = window.btoa(appSettings.APIKEY)
		$scope.requestBody = null

		//we also run already the command
		//
		var req = {
			url : 'payments/get',
			method : 'post',
			data : {
				headers: $scope.requestHeader,
			}
		}
		//console.log('starting post2')

		$('.wait').show()
		$http(req)
				.success(function(data) {
					//console.log(data.headers)
					$scope.responseBody = data.body.info.body
					$scope.responseStatusCode = data.statusCode
					$scope.responseHeader = JSON.stringify(data.headers, null, "  ")
					//console.log($scope.responseBody)
					$('.wait').hide()
					console.log(data.body)
					responseArray = JSON.parse($scope.responseBody)
					$scope.myData = []
					responseArray.Payments.forEach(function(item){
						$scope.myData.push(
							{
								'ID' : item.ID,
								'MerchantTransactionID' : item.MerchantTransactionID,
								'Amount' : item.Amount,
								'CCY' : item.Currency,
								'Status' : item.Status.Info,
								'MethodID' : item.MethodID
							}
						)
					})
					//TODO: parse response
				})
	}
	$scope.$on('reload', function() {$scope.init()});


	
})
.controller('genericCtrl',  function($scope, $http, $filter, $localStorage) {
	$scope.$on('$viewContentLoaded', 
		function() {
			$scope.$broadcast('reload', null)
		})
})


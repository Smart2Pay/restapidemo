var paymentsApp = angular.module('paymentsApp', ['ngSanitize']);

paymentsApp.filter('formatText', function (){
  return function(input) {
    if(!input) return input;
    var output = input
      //replace possible line breaks.
      .replace(/(\r\n|\r|\n)/g, '<br/>')
      //replace tabs
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;')
      //replace spaces.
      .replace(/ /g, '&nbsp;');

      return output;
  };
});

paymentsApp.filter('cleanJson', function (){
  return function(input) {
    if(!input) return input;
    var output = input
      //replace possible line breaks.
      .replace(/(<br>)/g, '')
      .replace(/ /g, '')

      return output;
  };
});

paymentsApp.controller('paymentsCtrl',  function($scope, $http, $filter) {
	
	var req = {url: 'init'}

	$http(req).success(function(data) {
       $scope.requestHeader = data.APIKEY
       $scope.requestBody = JSON.stringify(data.body,null, "  ")
    });

	$scope.post = function(){
		
		console.log($scope.requestBody)
			
		if(!$scope.requestHeader || !$scope.requestBody){
			return
		}

		var req = {
			url : 'post',
			method : 'post',
			data : {
				headers: $scope.requestHeader,
				body: $filter('cleanJson')($scope.requestBody)
			}
		}
		console.log('starting post2')
		$http(req)
				.success(function(data) {
					$scope.responseBody = JSON.parse(data)
					console.log($scope.responseBody)
					//$scope.responseHeader = data.header
				})
	}
})


angular.module('paymentsApp').directive('contenteditable', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attr, ngModel) {
        var read;
        if (!ngModel) {
          return;
        }
        ngModel.$render = function() {
          return element.html(ngModel.$viewValue);
        };
        element.bind('blur', function() {
          if (ngModel.$viewValue !== $.trim(element.html())) {
            return scope.$apply(read);
          }
        });
        return read = function() {
          console.log("read()");
          return ngModel.$setViewValue($.trim(element.html()));
        };
      }
    };
  });



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



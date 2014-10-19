App.directive("buttonPromise", function ($parse) {
  return {
    restrict: "E",
    scope: {
      action: "&",
      icon: "@",
      waitIcon: "@",
      doneIcon: "@",
      errorIcon: "@"
    },
    templateUrl: "dist/views/buttonPromise.html",
    link: function (scope, element, attr) {
      scope.activeIcon = scope.icon;
      var fn = $parse(scope.action);
      $(element).on("click", function () {
        var r = scope.action();
        scope.activeIcon = scope.waitIcon || "ion-ios7-reloading";
        scope.$apply();
        r.then(function () {
          scope.activeIcon = scope.doneIcon || "ion-ios7-checkmark-outline";
          scope.$apply();
        }, function () {
          scope.activeIcon = scope.errorIcon || "ion-ios7-close-outline";
          scope.$apply();
        });
      });

    }
  }
});
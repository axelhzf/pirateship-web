angular.module("app").directive("spinner", function () {
  return {
    restrict: "E",
    scope: {
      waitFor: "="
    },
    templateUrl: "templates/spinner.html",
    link: function (scope, element, attrs) {

    }
  }
});
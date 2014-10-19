angular.module("app").directive("spinner", function () {
  return {
    restrict: "E",
    scope: {
      waitFor: "="
    },
    templateUrl: "dist/views/spinner.html",
    link: function (scope, element, attrs) {

    }
  }
});
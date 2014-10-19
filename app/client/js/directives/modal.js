angular.module("app").directive("modal", function () {
  return {
    restrict: "E",
    templateUrl: "dist/views/modal.html",
    transclude : true,
    scope: {
      "visible": "="
    }
  }
});
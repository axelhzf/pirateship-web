App.directive("fadeImg", function () {
  return {
    restrict: "E",
    templateUrl: "assets/templates/fadeImg.html",
    scope: {
      src: "="
    },
    link: function (scope, element, attrs) {
      scope.loaded = false;
      element.find("img").on("load", function () {
        scope.loaded = true;
        scope.$apply();
      });
      scope.$watch("src", function (newValue, oldValue) {
        if (newValue !== oldValue) {
          scope.loaded = false;
        }
      });

    }
  }
});
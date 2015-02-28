"use strict";

App.directive("fadeImg", function ($sce) {
  return {
    restrict: "E",
    templateUrl: "templates/fadeImg.html",
    scope: {
      img: "@"
    },
    link: function (scope, element, attrs) {
      scope.loaded = false;
      element.find("img").on("load", function () {
        scope.loaded = true;
        scope.$apply();
      });
      scope.$watch("img", function (newValue, oldValue) {
        scope.trustedSrc = $sce.trustAsResourceUrl(newValue);
        if (newValue !== oldValue) {
          scope.loaded = false;
        }
      });
    }
  };
});
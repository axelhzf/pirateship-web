var _s = require("underscore.string");

angular.module("app").directive("hd", function () {
  return {
    restrict: "E",
    scope: {
      title: "="
    },
    templateUrl: "dist/views/hd.html",
    link: function (scope) {
      scope.isVisible = function () {
        if (scope.title) {
          var lowerFile = scope.title.toLowerCase();
          return _s.contains(lowerFile, "720p") || _s.contains(lowerFile, "1080p");
        }
      }
    }
  }
});
angular.module("app").directive("youtubePlayer", function ($sce) {
  return {
    restrict: "E",
    scope: {
      videoId: "=",
      videoUrl: "="
    },
    template: '<iframe type="text/html" width="560" height="315" allowfullscreen frameborder="0" ng-src="{{url()}}")></iframe>',
    link: function (scope) {

      scope.url = function () {
        if (scope.videoId) {
          var url = 'https://www.youtube.com/embed/' + scope.videoId + "?autoplay=1&rel=0";
          return $sce.trustAsResourceUrl(url);
        } else if (scope.videoUrl) {
          var videoId = scope.videoUrl.match(/v=(.*)/)[1];
          var url = 'https://www.youtube.com/embed/' + videoId + "?autoplay=0&rel=0";
          return $sce.trustAsResourceUrl(url);
        }
      }
    }
  }
});
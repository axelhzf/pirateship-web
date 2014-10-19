angular.module("app").directive("updateEpisode", function (episodeUpdaterService) {
  return {
    restrict: "A",
    scope: {
      "episode" : "=updateEpisode"
    },
    link: function (scope) {

      function init() {
        //episodeUpdaterService.watch(scope.episode);
      }

      function destroy() {
        //episodeUpdaterService.stopWatch(scope.episode);
      }

      function changeEpisode(newEpisode, oldEpisode) {
        if (newEpisode !== oldEpisode) {
          episodeUpdaterService.stopWatch(oldEpisode);
          episodeUpdaterService.watch(newEpisode);
        }
      }

      scope.$on('$destroy', destroy);
      scope.$watch("episode", changeEpisode);

      init();
    }
  }
});
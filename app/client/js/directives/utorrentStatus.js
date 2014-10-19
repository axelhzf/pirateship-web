angular.module("app").directive("utorrentStatus", function () {
  return {
    restrict: "E",
    templateUrl: "dist/views/utorrent_status.html",
    scope: {
      "episode": "="
    }
  }
});
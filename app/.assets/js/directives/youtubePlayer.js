"use strict";

var YoutubePlayerDirective = (function () {
  var YoutubePlayerDirective = function YoutubePlayerDirective($sce, scope) {
    this.$sce = $sce;
    this.scope = scope;
    this.modalVisible = false;
  };

  YoutubePlayerDirective.prototype.videoId = function () {
    if (this.scope.videoId) {
      return this.scope.videoId;
    } else if (this.scope.videoUrl) {
      var videoId = this.scope.videoUrl.match(/v=(.*)/)[1];
      return videoId;
    }
  };

  YoutubePlayerDirective.prototype.embedUrl = function () {
    var videoId = this.videoId();
    if (videoId) {
      var url = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0";
      return this.$sce.trustAsResourceUrl(url);
    }
  };

  YoutubePlayerDirective.prototype.thumbnailUrl = function () {
    var videoId = this.videoId();
    if (videoId) {
      var url = "http://img.youtube.com/vi/" + videoId + "/0.jpg";
      console.log(url);
      return this.$sce.trustAsResourceUrl(url);
    }
  };

  YoutubePlayerDirective.prototype.showModal = function () {
    this.modalVisible = true;
  };

  YoutubePlayerDirective.prototype.hideModal = function () {
    this.modalVisible = false;
  };

  return YoutubePlayerDirective;
})();




angular.module("app").directive("youtubePlayer", function ($sce) {
  return {
    restrict: "E",
    scope: {
      videoId: "=",
      videoUrl: "="
    },
    templateUrl: "templates/youtube_player.html",
    link: function (scope) {
      console.log("youtube player link");
      scope.ctrl = new YoutubePlayerDirective($sce, scope);
    }
  };
});
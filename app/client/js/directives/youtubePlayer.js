class YoutubePlayerDirective {
  constructor($sce, scope) {
    this.$sce = $sce;
    this.scope = scope;
    this.modalVisible = false;
  }

  videoId () {
    if (this.scope.videoId ) {
      return this.scope.videoId;
    } else if (this.scope.videoUrl) {
      var videoId = this.scope.videoUrl.match(/v=(.*)/)[1];
      return videoId;
    }
  }

  embedUrl() {
    var videoId = this.videoId();
    if (videoId) {
      var url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      return this.$sce.trustAsResourceUrl(url);
    }
  }

  thumbnailUrl() {
    var videoId = this.videoId();
    if (videoId) {
      var url = `http://img.youtube.com/vi/${videoId}/0.jpg`;
      console.log(url);
      return this.$sce.trustAsResourceUrl(url);
    }
  }

  showModal () {
    this.modalVisible = true;
  }

  hideModal () {
    this.modalVisible = false;
  }
}


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
  }
});
function MovieController($stateParams, Restangular, download, $scope) {
  this.$stateParams = $stateParams;
  this.Restangular = Restangular;
  this.downloadService = download;

  this.fetchMovie();
  this.startDownloadInterval();

  $scope.$on("$destroy", this.destroy.bind(this));
}

MovieController.prototype = {

  startDownloadInterval: function () {
    this.stopDownloadInterval();
    this.downloadInterval = setInterval(this.fetchDownload.bind(this), 1000);
  },

  stopDownloadInterval: function () {
    if (this.downloadInterval) {
      clearInterval(this.downloadInterval);
    }
  },

  fetchDownload: function () {
    var self = this;
    if (this.movie) {
      var where = {
        movie_id: this.movie.id
      };
      this.downloadService.one(where).then(function (download) {
        console.log("fetch download", download);
        self.download = download;
      });
    }
  },

  fetchMovie: function () {
    this.movie = this.Restangular.one("movies", this.$stateParams.id).get().$object;
  },

  downloadMagnet: function () {
    this.downloadService.downloadMovie(this.movie.id, this.movie.yts_magnet);
  },

  destroy: function () {
    this.stopDownloadInterval();
  }

};

angular.module("app").controller("MovieController", MovieController);
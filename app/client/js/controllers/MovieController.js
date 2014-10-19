function MovieController($stateParams, Restangular, download) {
  this.$stateParams = $stateParams;
  this.Restangular = Restangular;
  this.download = download;

  this.fetchMovie();
}

MovieController.prototype = {
  fetchMovie: function () {
    this.movie = this.Restangular.one("movies", this.$stateParams.id).get().$object;
  },
  downloadMagnet: function () {
    var magnet = this.movie.yts_magnet;
    console.log("download magnet", magnet);
    this.download.downloadMagnet(magnet);
  }
};

angular.module("app").controller("MovieController", MovieController);
class MovieController {
  constructor($stateParams, moviesStore, download, $scope, $state, $http) {
    this.$state = $state;
    this.downloadService = download;
    this.moviesStore = moviesStore;
    this.imdb = $stateParams.imdb;
    this.$http = $http;

    this.fetchMovie();
    this.fetchTorrents();

    this.tab = "trailer";

    $scope.$on("$destroy", this.destroy.bind(this));
  }

  fetchMovie() {
    var url = "/api/movies/" + this.imdb;
    this.$http({method: "get", url})
      .then((response) => {
        this.movie = response.data;
      });
  }

  fetchTorrents() {
    this.moviesStore.findTorrentsForMovie(this.imdb).then((torrents) => {
      this.torrents = torrents;
    });
  }

  downloadMagnet(magnet) {
    this.downloadService.downloadMovie(this.movie.id, this.movie.yts_magnet).then(() => {
      this.$state.go("downloads");
    })
  }

  destroy() {
    this.stopDownloadInterval();
  }

}


angular.module("app").controller("MovieController", MovieController);
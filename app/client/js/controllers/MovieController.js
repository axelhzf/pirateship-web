class MovieController {
  constructor($stateParams, moviesStore, download, $scope, $state) {
    this.$state = $state;
    this.downloadService = download;
    this.moviesStore = moviesStore;
    this.movieId = $stateParams.id;

    this.fetchMovie();
    this.fetchTorrents();

    this.tab = "trailer";

    $scope.$on("$destroy", this.destroy.bind(this));
  }

  fetchMovie() {
    this.moviesStore.get(this.movieId).then((movie) => {
      this.movie = movie;
    });
  }

  fetchTorrents() {
    this.moviesStore.findTorrentsForMovie(this.movieId).then((torrents) => {
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
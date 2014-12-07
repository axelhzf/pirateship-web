class MovieController {
  constructor($stateParams, moviesStore, download, $scope) {
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
    this.downloadService.downloadMovie(this.movie.id, this.movie.yts_magnet);
  }

  destroy() {
    this.stopDownloadInterval();
  }

}


angular.module("app").controller("MovieController", MovieController);
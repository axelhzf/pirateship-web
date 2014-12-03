class MovieController {
  constructor($stateParams, moviesStore, download, $scope) {
    this.downloadService = download;
    this.moviesStore = moviesStore;

    this.movieId = $stateParams.id;


    this.fetchMovie();
    this.fetchTorrents();
    //this.startDownloadInterval();

    this.tab = "trailer";

    $scope.$on("$destroy", this.destroy.bind(this));
  }

  startDownloadInterval() {
    this.stopDownloadInterval();
    this.downloadInterval = setInterval(this.fetchDownload.bind(this), 1000);
  }

  stopDownloadInterval() {
    if (this.downloadInterval) {
      clearInterval(this.downloadInterval);
    }
  }

  fetchDownload() {
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
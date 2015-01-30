class ShowsController {
  constructor(showsStore) {
    this.showsStore = showsStore;
    this.fetchMovies();
  }

  fetchMovies() {
    this.showsStore.find({limit: 1000}).then((shows) => {
      this.shows = shows;
    });
  }

}

angular.module("app").controller("ShowsController", ShowsController);
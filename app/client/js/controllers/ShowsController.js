class ShowsController {
  constructor($http, showsStore) {
    this.$http = $http;
    this.showsStore = showsStore;
    this.fetchMovies();
  }

  fetchMovies() {
    this.shows = {
      state: "loading"
    };
    this.$http({method: "get", url: "/api/shows"})
      .then((response) => {
        this.shows.items = response.data;
        this.shows.state = "loaded";
      });
    
  }

}

angular.module("app").controller("ShowsController", ShowsController);
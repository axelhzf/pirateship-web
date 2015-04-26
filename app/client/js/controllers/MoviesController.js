class MoviesController {

  constructor($http, $stateParams) {
    this.$http = $http;

    this.baseFilter = _.clone($stateParams);
    this.filter = _.clone($stateParams);
    this.filter.page = 1;

    this.FILTERS = {
      sort_by: [
        {key: "title", title: "Title"},
        {key: "rating", title: "Rating"},
        {key: "peers", title: "Peers"},
        {key: "download_count", title: "Downloads Count"},
        {key: "like_count", title: "Like Count"},
        {key: "date_added", title: "Date Added"}
      ]
    };

    this.movies = {
      items: []
    };

    this.fetchMovies();
  }
  
  fetchMovies() {
    this.movies.state = "loading";

    this.$http({
      method: "get",
      url: "/api/movies",
      params: this.filter
    }).then((response) => {
      this.movies.items = this.movies.items.concat(response.data);
      this.movies.state = "loaded";
    });
  }

  loadNextPage() {
    console.log("load next page");
    this.filter.page = this.filter.page + 1;
    this.fetchMovies();
  }

  extendFilter(options) {
    return _.defaults(options, this.baseFilter);
  }

}

angular.module("app").controller("MoviesController", MoviesController);
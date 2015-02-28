class MoviesController {
  constructor($http) {
    this.$http = $http;
    this.fetchMovies();
  }
  
  fetchMovies() {
    this.movies = {
      state: "loading"
    };
    
    this.$http({method: "get", url: "/api/movies"})
      .then((response) => {
        this.movies.items = response.data;
        this.movies.state = "loaded";
      });
    
  }
}


angular.module("app").controller("MoviesController", MoviesController);
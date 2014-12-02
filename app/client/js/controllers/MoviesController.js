class MoviesController {
  constructor($scope, moviesStore, global, movieYearsStore, movieGenresStore, $state, $location) {
    console.log("execute constructor");
    this.moviesStore = moviesStore;
    this.movieYearsStore = movieYearsStore;
    this.movieGenresStore = movieGenresStore;
    this.$location = $location;

    this.moviesStoreQuery = global.moviesStoreQuery;
    var queryParams = $state.params;
    queryParams.year = _.isNumber(queryParams.year) ? ~~queryParams.year : null;
    _.extend(this.moviesStoreQuery, $state.params);


    this.movies = null;

    this.years = [];
    this.genres = [];

    this.global = global;

    this.initialFetch();

    $scope.$watch("ctrl.selectedYear.text", () => this.moviesStoreQuery.year = this.selectedYear.value);
    $scope.$watch("ctrl.selectedGenre.text", () => this.moviesStoreQuery.genre = this.selectedGenre.value);
    $scope.$watch("ctrl.selectedSort.text", () => this.moviesStoreQuery.sort = this.selectedSort.value);
    $scope.$watch("ctrl.moviesStoreQuery", this.filterChangeQuery.bind(this), true);
  }

  initialFetch() {
    this.fetchYears();
    this.fetchGenres();
    this.fetchSort();

    this.movies = this.moviesStore.getMoviesIterator(this.moviesStoreQuery);
    this.movies.appendNextPage();
  }

  filterChangeQuery(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.changeQuery();
    }
  }

  changeQuery() {
    this.$location.search(_.pick(this.moviesStoreQuery, "query", "year", "genre", "sort")).replace();
  }

  fetchYears() {
    this.selectedYear = {text: "Year"};
    this.movieYearsStore.all().then((years) => {
      this.years = _.map(years, (year) => ({text: year, value: year}));
      this.years.unshift({text: "Year"});
      if (this.moviesStoreQuery.year) {
        this.selectedYear = _.find(this.years, (year) => year.value === this.moviesStoreQuery.year);
      }
    });
  }

  fetchGenres() {
    this.selectedGenre = {text: "Genre"};
    this.movieGenresStore.all().then((genres) => {
      this.genres = _.map(genres, (genre) => ({text: genre, value: genre}));
      this.genres.unshift({text: "Genre"});
      if (this.moviesStoreQuery.genre) {
        this.selectedGenre = _.find(this.genres, (year) => year.value === this.moviesStoreQuery.genre);
      }
    })
  }

  fetchSort() {
    this.selectedSort = {text: "Sort"};
    this.sort = [
      {text: "Sort"},
      {text: "Rating", value: "rating"}
    ];
    if (this.moviesStoreQuery.sort) {
      this.selectedSort = _.find(this.sort, (year) => year.value === this.moviesStoreQuery.sort);
    }
  }

  appendNextPage() {
    console.log("append next page", this.movies);
    this.movies.appendNextPage();
  }
}


angular.module("app").controller("MoviesController", MoviesController);
class MoviesController {
  constructor($scope, moviesStore, global, movieYearsStore, movieGenresStore, $state, $location) {
    console.log("execute constructor");
    this.$scope = $scope;
    this.moviesStore = moviesStore;
    this.movieYearsStore = movieYearsStore;
    this.movieGenresStore = movieGenresStore;
    this.$location = $location;

    this.moviesStoreQuery = global.moviesStoreQuery;
    var queryParams = _.extend({}, $state.params);
    var year = parseInt(queryParams.year, 10);
    if (!_.isNaN(year)) {
      queryParams.year = year;
    }

    _.extend(this.moviesStoreQuery, queryParams);
    console.log(this.moviesStoreQuery, queryParams);

    this.movies = null;

    this.years = [];
    this.genres = [];

    this.global = global;

    this.initialFetch();

    this.strictWatch("ctrl.selectedYear.value", (newValue) => this.moviesStoreQuery.year = newValue);
    this.strictWatch("ctrl.selectedGenre.value", (newValue) => this.moviesStoreQuery.genre = newValue);
    this.strictWatch("ctrl.selectedSort.value", (newValue) => this.moviesStoreQuery.sort = newValue);
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
    this.movieYearsStore.all().then((years) => {
      this.years = _.map(years, (year) => ({text: year, value: year}));
      this.years.unshift({text: "Year"});
      this.selectedYear = _.find(this.years, (year) => year.value === this.moviesStoreQuery.year);
    });
  }

  fetchGenres() {
    this.movieGenresStore.all().then((genres) => {
      this.genres = _.map(genres, (genre) => ({text: genre, value: genre}));
      this.genres.unshift({text: "Genre"});
      this.selectedGenre = _.find(this.genres, (year) => year.value === this.moviesStoreQuery.genre);
    })
  }

  fetchSort() {
    this.sort = [
      {text: "Sort"},
      {text: "Rating", value: "rating"}
    ];
    this.selectedSort = _.find(this.sort, (sort) => sort.value === this.moviesStoreQuery.sort);
  }

  appendNextPage() {
    console.log("append next page", this.movies);
    this.movies.appendNextPage();
  }

  strictWatch(prop, cb) {
    this.$scope.$watch(prop, function (newValue, oldValue) {
      if (newValue !== oldValue) {
        cb(newValue);
      }
    });
  }
}


angular.module("app").controller("MoviesController", MoviesController);
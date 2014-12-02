class MoviesController {
  constructor($scope, moviesStore, global, movieYearsStore, movieGenresStore) {
    this.moviesStore = moviesStore;
    this.movieYearsStore = movieYearsStore;
    this.movieGenresStore = movieGenresStore;

    this.moviesQuery = new MoviesStoreQuery();
    this.movies = null;


    this.years = [];
    this.genres = [];

    this.global = global;

    $scope.$watch("ctrl.global.query", _.bind(this.filterChangeQuery, this));
    $scope.$watch("ctrl.selectedYear.text", _.bind(this.filterChangeQuery, this));
    $scope.$watch("ctrl.selectedGenre.text", _.bind(this.filterChangeQuery, this));
    $scope.$watch("ctrl.selectedSort.text", _.bind(this.filterChangeQuery, this));

    this.selectedYear = {text: "Year"};
    this.selectedGenre = {text: "Genre"};
    this.selectedSort = {text: "Sort"};

    this.initialFetch();
  }

  initialFetch() {
    if (!this.movies) {
      this.changeQuery();
    }

    this.fetchYears();
    this.fetchGenres();
    this.fetchSort();
  }

  filterChangeQuery(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.changeQuery();
    }
  }

  changeQuery() {
    console.log("change query");
    this.movies = this.moviesStore.getMoviesIterator(this.moviesQuery);
    this.movies.appendNextPage();
  }

  fetchYears() {
    this.movieYearsStore.all().then((years) => {
      this.years = _.map(years, (year) => ({text: year, value: year}));
      this.years.unshift({text: "Year"});
    });
  }

  fetchGenres() {
    this.movieGenresStore.all().then((genres) => {
      this.genres = _.map(genres, (genre) => ({text: genre, value: genre}));
      this.genres.unshift({text: "Genre"});
    })
  }

  fetchSort() {
    this.sort = [
      {text: "Sort"},
      {text: "Rating", value: "rating"}
    ]
  }

  appendNextPage() {
    console.log("append next page", this.movies);
    this.movies.appendNextPage();
  }
}


angular.module("app").controller("MoviesController", MoviesController);
class MoviesController {
  constructor($scope, moviesStore, global, movieYearsStore, movieGenresStore) {
    this.moviesStore = moviesStore;
    this.movieYearsStore = movieYearsStore;
    this.movieGenresStore = movieGenresStore;

    this.moviesStoreQuery = global.moviesStoreQuery;
    this.movies = null;

    this.years = [];
    this.genres = [];

    this.global = global;

    $scope.$watch("ctrl.selectedYear.text", () => this.moviesStoreQuery.year = this.selectedYear.value);
    $scope.$watch("ctrl.selectedGenre.text", () => this.moviesStoreQuery.genre = this.selectedGenre.value);
    $scope.$watch("ctrl.selectedSort.text", () => this.moviesStoreQuery.sort = this.selectedSort.value);
    $scope.$watch("ctrl.moviesStoreQuery", this.filterChangeQuery.bind(this), true);

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
    this.movies = this.moviesStore.getMoviesIterator(this.moviesStoreQuery);
    this.movies.appendNextPage();
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
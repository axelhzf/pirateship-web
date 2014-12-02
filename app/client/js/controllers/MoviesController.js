function MoviesController(movies, global, $scope, movieYearsStore, movieGenresStore) {
  this.movies = movies;
  this.movieYearsStore = movieYearsStore;
  this.movieGenresStore = movieGenresStore;

  this.movies.limit = 20;
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

MoviesController.prototype = {

  initialFetch: function () {
    if (this.movies.items.length === 0) {
      this.changeQuery();
    }

    this.fetchYears();
    this.fetchGenres();
    this.fetchSort();
  },

  filterChangeQuery: function (newValue, oldValue) {
    if (newValue !== oldValue) {
      this.changeQuery();
    }
  },

  changeQuery: function () {
    var query = this.global.query;
    this.movies.reset();

    var where = [];
    var parameters = [];
    if (query) {
      where.push("title LIKE ?");
      parameters.push("%" + query + "%");
    }
    if (this.selectedYear.value) {
      where.push("year = ?");
      parameters.push(this.selectedYear.value);
    }

    if (this.selectedGenre.value) {
      where.push("genre = ?");
      parameters.push(this.selectedGenre.value);
    }

    where = where.join(" and ");
    parameters.unshift(where);

    this.movies.where = parameters;

    if (this.selectedSort.value) {
      this.movies.order = "rating DESC";
    } else {
      this.movies.order = [];
    }

    this.movies.fetch();
  },

  fetchYears: function () {
    var self = this;
    this.movieYearsStore.all().then(function (years) {
      self.years = _.map(years, function (year) {
        return {text: year, value: year};
      });
    });
  },

  fetchGenres: function () {
    var self = this;
    this.movieGenresStore.all().then(function (genres) {
      self.genres = _.map(genres, function (genre) {
        return {text: genre, value: genre};
      });
    })
  },

  fetchSort: function () {
    this.sort = [
      {text: "Don't sort"},
      {text: "Rating", value: "rating"}
    ]
  }

};


angular.module("app").controller("MoviesController", MoviesController);
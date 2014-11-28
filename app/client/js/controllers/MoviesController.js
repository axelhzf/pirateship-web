function MoviesController(movies, global, $scope) {
  this.movies = movies;
  this.movies.limit = 20;
  this.years = [];
  this.genres = [];

  this.global = global;
  $scope.$watch("ctrl.global.query", _.bind(this.filterChangeQuery, this));
  $scope.$watch("ctrl.selectedYear.text", _.bind(this.filterChangeQuery, this));
  $scope.$watch("ctrl.selectedGenre.text", _.bind(this.filterChangeQuery, this));

  this.selectedYear = {text: "Year"};
  this.selectedGenre = {text: "Genre"};

  this.initialFetch();
}

MoviesController.prototype = {

  initialFetch: function () {
    if (this.movies.items.length === 0) {
      this.changeQuery();
    }

    this.fetchYears();
    this.fetchGenres();
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

    if(this.selectedGenre.value) {
      where.push("genre = ?");
      parameters.push(this.selectedGenre.value);
    }

    where = where.join(" and ");
    parameters.unshift(where);

    this.movies.where = parameters;
    this.movies.fetch();
  },

  fetchYears: function () {
    var self = this;
    this.movies.getYears().then(function (years) {
      self.years = _.map(years, function (year) {
        return {text: year, value: year};
      });
    })
  },

  fetchGenres: function () {
    var self = this;
    this.movies.getGenres().then(function (genres) {
      self.genres = _.map(genres, function (genre) {
        return {text: genre, value: genre};
      });
    })
  }

};


angular.module("app").controller("MoviesController", MoviesController);
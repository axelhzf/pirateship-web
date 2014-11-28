function MoviesController(movies, global, $scope) {
  this.movies = movies;
  this.movies.limit = 20;
  this.years = [];

  this.global = global;
  $scope.$watch("ctrl.global.query", _.bind(this.filterChangeQuery, this));
  $scope.$watch("ctrl.selectedYear.text", _.bind(this.filterChangeQuery, this));
  this.selectedYear = {text: "Year"};

  this.initialFetch();
}

MoviesController.prototype = {

  initialFetch: function () {
    if (this.movies.items.length === 0) {
      this.changeQuery();
    }

    if (this.years.length === 0) {
      this.fetchYears();
    }
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
  }

};


angular.module("app").controller("MoviesController", MoviesController);
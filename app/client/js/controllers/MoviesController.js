function MoviesController(movies, global, $scope) {
  this.movies = movies;
  this.movies.limit = 20;
  this.years = [];

  if (this.movies.items.length === 0) {
    this.movies.fetch();
  }

  if (this.years.length === 0) {
    var self = this;
    this.movies.getYears().then(function (years) {
      self.years = _.map(years, function (year) {
        return {text: year, value: year};
      });
    })
  }

  this.global = global;
  $scope.$watch("ctrl.global.query", _.bind(this.changeQuery, this));
  $scope.$watch("ctrl.selectedYear.text", _.bind(this.filterByYear, this));
  this.selectedYear = {text: "Year"};
}

MoviesController.prototype = {

  changeQuery: function () {
    var query = this.global.query;
    this.movies.reset();
    this.movies.where = ["title LIKE ?", "%" + query + "%"];
    this.movies.fetch();
  },

  filterByYear: function () {
    if (this.selectedYear.value) {
      this.movies.reset();
      this.movies.where = ["year = ?", this.selectedYear.value];
      this.movies.fetch();
    }
  }

};


angular.module("app").controller("MoviesController", MoviesController);
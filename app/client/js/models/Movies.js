var apiBaseUrl = "/api";

function Movies($http) {
  this.items = [];
  this.$http = $http;
  this.limit = 10;
  this.offset = 0;
  this.where = {};
  this.order = [];
}

Movies.prototype = {
  fetch: function () {
    this.items = [];
    this.offset = 0;
    return this.appendCurrentPage();
  },
  appendCurrentPage: function () {
    var params = {
      limit: this.limit,
      offset: this.offset,
      where: this.where,
      order: this.order
    };
    var self = this;
    var paramsString = qs.stringify(params);
    var url = apiBaseUrl + "/movies?" + paramsString;

    console.log(params);
    return this.$http.get(url)
      .then(function (response) {
        var data = response.data;
        self.offset = data.offset;
        Array.prototype.push.apply(self.items, data.items);
      });
  },
  appendNextPage: function () {
    this.offset = this.offset + this.limit;
    return this.appendCurrentPage();
  },
  reset: function () {
    this.offset = 0;
    this.items = [];
  },
  getYears: function () {
    var url = apiBaseUrl + "/movies/_years";
    return this.$http.get(url).then(function (response) {
      return response.data;
    });
  },
  getGenres: function () {
    var url = apiBaseUrl + "/movies/_genres";
    return this.$http.get(url).then(function (response) {
      return response.data;
    });
  }
};

angular.module("app").factory("Movies", function () {
  return Movies;
});

angular.module("app").factory("movies", function ($http) {
  return new Movies($http);
});
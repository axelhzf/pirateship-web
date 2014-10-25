var apiBaseUrl = "/api";

function Movies($http) {
  this.items = [];
  this.$http = $http;
  this.limit = 10;
  this.offset = 0;
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
      offset: this.offset
    };
    var self = this;
    return this.$http.get(apiBaseUrl + "/movies", {params: params}).then(function (response) {
      var data = response.data;
      Array.prototype.push.apply(self.items, data.items);
    });
  },
  appendNextPage: function () {
    this.offset = this.offset + this.limit;
    return this.appendCurrentPage();
  }
};

angular.module("app").factory("Movies", function () {
  return Movies;
});
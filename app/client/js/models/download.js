function Download(http) {
  this.http = http;
}

Download.prototype = {

  one : function (where) {
    var url = "/api/downloads/one";
    return this.http.get(url, {params: where}).then(function (response) {
      return response.data;
    });
  },

  downloadMovie: function (movieId, magnet) {
    var url = "/api/movies/" + movieId + "/download/" + encodeURIComponent(magnet);
    return this.http.get(url);
  }
};

angular.module("app").factory("download", function ($http) {
  return new Download($http);
});
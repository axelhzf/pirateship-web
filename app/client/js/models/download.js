function Download(http) {
  this.http = http;
}

Download.prototype = {
  downloadMagnet: function (magnet) {
    var url = "/api/downloads/" + encodeURIComponent(magnet);
    return this.http.get(url);
  }
};

angular.module("app").factory("download", function ($http) {
  return new Download($http);
});
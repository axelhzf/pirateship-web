class Player {

  constructor($http, config) {
    this.$http = $http;
    this.config = config;
  }

  url() {
    return this.config.api.path + "/player";
  }

  play(file) {
    var params = {
      source: "pc",
      file: file
    };
    return this.$http.get(this.url() + "?" + qs.stringify(params)).then((response) => {
      return response.data;
    });
  }

  playTv(file) {
    var params = {
      source: "tv",
      file: file
    };
    return this.$http.get(this.url() + "?" + qs.stringify(params)).then((response) => {
      return response.data;
    });
  }

}

angular.module("app").service("player", Player);
  
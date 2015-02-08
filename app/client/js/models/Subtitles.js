class SubtitlesStore {
  constructor($http, config) {
    this.config = config;
    this.$http = $http;
  }
  
  url() {
    return this.config.api.path + "/subtitles";
  }
  
  download(file) {
    return this.$http.post(this.url(), {file: file});
  }
  
}

angular.module("app").service("subtitlesStore", SubtitlesStore);
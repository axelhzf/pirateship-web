class DownloadsStore extends BasicStore {

  constructor($http, $q, config) {
    super($http, $q, config)
  }

  url() {
    return this.config.api.path + "/downloads";
  }

  start(id) {
    var url = this.url() + "/" + id + "/start";
    return this.$http.post(url);
  }

  stop(id) {
    var url = this.url() + "/" + id + "/stop";
    return this.$http.post(url);
  }

}

angular.module("app").service("downloadsStore", DownloadsStore);
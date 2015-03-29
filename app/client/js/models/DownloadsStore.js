class DownloadsStore extends BasicStore {

  constructor($http, $q, config) {
    super($http, $q, config)
  }

  url() {
    return this.config.api.path + "/downloads";
  }

  start(id) {
    var url = this.url() + "/" + id + "/start";
    return this.$http.get(url);
  }

  stop(id) {
    var url = this.url() + "/" + id + "/stop";
    return this.$http.get(url);
  }

}

angular.module("app").service("downloadsStore", DownloadsStore);
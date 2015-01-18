class TorrentsStore extends BasicStore {
  constructor($http, $q, config) {
    super($http, $q, config)
  }

  url() {
    return this.config.api.path + "/torrents";
  }

  download(magnet) {
    console.log("download magnet", magnet, this.http);
    var url = "/api/torrents/download/" + encodeURIComponent(magnet);
    return this.$http.get(url);
  }

}

angular.module("app").service("torrentsStore", TorrentsStore);
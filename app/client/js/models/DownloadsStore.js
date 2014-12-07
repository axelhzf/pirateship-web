class DownloadsStore extends BasicStore {

  constructor($http, $q, config) {
    super($http, $q, config)
  }

  url() {
    return this.config.api.path + "/downloads";
  }

}

angular.module("app").service("downloadsStore", DownloadsStore);
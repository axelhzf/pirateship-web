class ShowStore extends BasicStore {
  constructor($http, $q, config) {
    super($http, $q, config)
  }

  url() {
    return this.config.api.path + "/shows";
  }

}

angular.module("app").service("showsStore", ShowStore);
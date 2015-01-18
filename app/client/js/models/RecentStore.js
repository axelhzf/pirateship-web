class RecentStore extends BasicStore {
  constructor($http, $q, config) {
    super($http, $q, config)
  }

  url() {
    return this.config.api.path + "/recents";
  }

}

angular.module("app").service("recentStore", RecentStore);
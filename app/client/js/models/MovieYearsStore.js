class MovieYearsStore extends BasicStore {
  constructor($http, $q, config) {
    super($http, $q, config)
  }

  url() {
    return this.config.api.path + "/movies/_years";
  }

}

angular.module("app").service("movieYearsStore", MovieYearsStore);

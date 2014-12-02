class MovieGenresStore extends BasicStore {
  constructor($http, $q, config) {
    super($http, $q, config)
  }

  url() {
    return this.config.api.path + "/movies/_genres";
  }

}

angular.module("app").service("movieGenresStore", MovieGenresStore);
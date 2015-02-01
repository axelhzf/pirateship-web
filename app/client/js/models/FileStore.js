class FileStore extends BasicStore {

  constructor($http, $q, config) {
    super($http, $q, config)
  }

  url() {
    return this.config.api.path + "/files";
  }

}

angular.module("app").service("fileStore", FileStore);
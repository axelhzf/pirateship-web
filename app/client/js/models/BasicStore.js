class BasicStore {
  constructor($http, $q, config) {
    this.config = config;
    this.$q = $q;
    this.$http = $http;
    this.cache = null;
  }

  all() {
    if (!this.cache) {
      return this.find();
    } else {
      return this.$q((resolve) => resolve(this.cache))
    }
  }

  find() {
    return this.$http.get(this.url()).then((response) => {
      this.cache = response.data;
      return response.data;
    });
  }

  url() {
    throw new Error("Unimplemented method");
  }
}
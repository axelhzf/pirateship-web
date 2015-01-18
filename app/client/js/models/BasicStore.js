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

  find(data) {
    console.log("params", data);
    return this.$http.get(this.url(), {params: data}).then((response) => {
      this.cache = response.data;
      return response.data;
    });
  }

  url() {
    throw new Error("Unimplemented method");
  }
}
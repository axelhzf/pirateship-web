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
    var url;
    if (data) {
      var paramsString = qs.stringify(data);
      url = this.url() + "?" + paramsString;
    } else {
      url = this.url();
    }

    return this.$http.get(url).then((response) => {
      this.cache = response.data;
      return response.data;
    });
  }

  url() {
    throw new Error("Unimplemented method");
  }
}
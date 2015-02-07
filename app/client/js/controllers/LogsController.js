class LogsController {
  
  constructor($http, config) {
    this.$http = $http;
    this.config = config;
    this.fetchLogs();
  }
  
  url() {
    return this.config.api.path + "/logs";
  }
  
  fetchLogs() {
    return this.$http.get(this.url()).then((response) => {
      this.logs = _.first(response.data.reverse(), 1000);
    });
  }
  
}

angular.module("app").controller("LogsController", LogsController);
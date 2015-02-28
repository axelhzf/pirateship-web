class SearchController {
  constructor($http, $stateParams) {
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.fetchSearch();
  }

  fetchSearch() {
    
    this.search = {
      state: "loading"
    };

    this.$http({method: "get", url: "/api/search", params: {query: this.$stateParams.query}})
      .then((response) => {
        this.search.items = _.compact(response.data);
        this.search.state = "loaded";
      });

  }
}


angular.module("app").controller("SearchController", SearchController);
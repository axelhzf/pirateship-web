class SearchController {
  constructor($http, $stateParams, $state) {
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$state = $state;
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
  
  navigate (searchItem) {
    console.log("navigate", searchItem.type);
    this.$state.go(searchItem.type, {imdb: searchItem.ids.imdb});
  }
  
  toggleFav($event, searchItem) {
    $event.stopPropagation();
    
    var url = `/api/favs/${searchItem.ids.imdb}`;
    searchItem.favorite = !searchItem.favorite;
    var method = searchItem.favorite ? "post" : "delete";
    
    this.$http({method: method, url: url, data: {}});
    
  }
  
  
}


angular.module("app").controller("SearchController", SearchController);
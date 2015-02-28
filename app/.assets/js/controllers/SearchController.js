"use strict";

var SearchController = (function () {
  var SearchController = function SearchController($http, $stateParams, $state) {
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$state = $state;
    this.fetchSearch();
  };

  SearchController.prototype.fetchSearch = function () {
    var _this = this;
    this.search = {
      state: "loading"
    };

    this.$http({ method: "get", url: "/api/search", params: { query: this.$stateParams.query } }).then(function (response) {
      _this.search.items = _.compact(response.data);
      _this.search.state = "loaded";
    });
  };

  SearchController.prototype.navigate = function (searchItem) {
    console.log("navigate", searchItem.type);
    this.$state.go(searchItem.type, { imdb: searchItem.ids.imdb });
  };

  SearchController.prototype.toggleFav = function ($event, searchItem) {
    $event.stopPropagation();

    var url = "/api/favs/" + searchItem.ids.imdb;
    searchItem.favorite = !searchItem.favorite;
    var method = searchItem.favorite ? "post" : "delete";

    this.$http({ method: method, url: url, data: {} });
  };

  return SearchController;
})();




angular.module("app").controller("SearchController", SearchController);
class HeaderController {
  constructor($state, $rootScope, global, $location) {
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.global = global;
    this.$location = $location;
  }

  clearQuery() {
    this.global.moviesStoreQuery.query = "";
  }

  next() {
    history.next();
  }

  previous() {
    history.back();
  }

  onSubmit() {
    this.$state.go("movies", {query: this.global.moviesStoreQuery.query});
  }
}

angular.module("app").controller("HeaderController", HeaderController);

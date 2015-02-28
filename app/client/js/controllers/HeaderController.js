class HeaderController {
  constructor($state, $stateParams, $rootScope, $location) {
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.query = $location.search().query;
  }

  clearQuery() {
    this.query = "";
  }

  next() {
    history.next();
  }

  previous() {
    history.back();
  }

  onSubmit() {
    this.$state.go("search", {query: this.query});
  }
}

angular.module("app").controller("HeaderController", HeaderController);

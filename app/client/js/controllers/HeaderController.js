class HeaderController {
  constructor($state, $rootScope, $location) {
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$location = $location;
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

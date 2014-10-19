function HeaderController ($state, $rootScope) {
  this.$state = $state;
  this.$rootScope = $rootScope;
  this.query = "";
  //this.global = g;
}

HeaderController.prototype = {
  clearQuery: function () {
    this.global.query = "";
  },
  next: function () {
    history.next();
  },
  previous: function () {
    history.back();
  }
};

App.ctrl(HeaderController);

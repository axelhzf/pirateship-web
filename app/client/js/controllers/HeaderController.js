function HeaderController ($state, $rootScope, global) {
  this.$state = $state;
  this.$rootScope = $rootScope;
  this.global = global;
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

class RecentsController {
  constructor(recentStore) {
    this.recentStore = recentStore;
    this.fetch();
  }

  fetch() {
    this.recentStore.find({limit: 100, order: "createdAt DESC"}).then((response) => {
      this.recents = response.items;
    })
  }

}

angular.module("app").controller("RecentsController", RecentsController);

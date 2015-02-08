class RecentController {
  constructor(recentStore, fileStore) {
    this.recentStore = recentStore;
    this.fileStore = fileStore;
    this.fetch();
    
    this.display = window.localStorage.recentDisplay || "group"; //list or group
  }
  
  setDisplay(newDisplay) {
    this.display = window.localStorage.recentDisplay = newDisplay;
  }
  
  fetch() {
    this.recentStore.find({limit: 100, order: "createdAt DESC"}).then((response) => {
      this.recent = response.items;

      var showsById = {};
      this.shows = [];
      
      this.recent.forEach((recent) => {
        this.fileStore.find({query: recent.file}).then((file) => {
          _.extend(recent, file);
          if (recent.show) {
            var showId = recent.show;
            if (!showsById[showId]) {
              var show = _.omit(recent.show, "episode");
              show.episodes = [];
              showsById[showId] = show;
              this.shows.push(show);
            }
            showsById[showId].episodes.push(recent.show.episode);
          }
        });
      });
      
    })
  }
  
}

angular.module("app").controller("RecentController", RecentController);

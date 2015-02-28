class ShowsController {
  constructor($http) {
    this.$http = $http;
    this.fetchShows();
  }
  
  fetchShows() {
    this.fetch("/api/shows").then((shows) => this.favs = shows);
    this.fetch("/api/shows?filter=popular").then((shows) => this.popular = shows);
  }
  
  fetch(path) {
    return this.$http({method: "get", url: path})
      .then((response) => {
        var shows = _.filter(response.data, function (show) {
          return show.ids.imdb !== null;
        });

        return  {
          items: shows
        };
      });
  }
  
  toggleFav($event, show) {
    $event.stopPropagation();
    
    var url = `/api/favs/${show.ids.imdb}`;
    show.favorite = !show.favorite;
    var method = show.favorite ? "post" : "delete";
    
    this.$http({method: method, url: url, data: {}}).then(() => {
      this.fetch("/api/shows").then((response) => {
        console.log("response items", response.items);
        this.favs.items = response.items;
      });
    });
    
    return false;
  }
  
}

angular.module("app").controller("ShowsController", ShowsController);
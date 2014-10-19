App.controller("MoviesController", function ($scope, Restangular) {
  $scope.movies = Restangular.all("movies").getList({limit: 30}).$object;
});

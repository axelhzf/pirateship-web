var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require("gulp-less");
var autoprefixer = require("gulp-autoprefixer");
var jade = require("gulp-jade");
var to5 = require('gulp-6to5');

gulp.task("less", function () {
  gulp.src("app/client/style/main.less")
    .pipe(less({
      paths: ["app/client/components"]
    }))
    .pipe(autoprefixer())
    .on("error", gutil.log)
    .pipe(gulp.dest("./app/.assets/style/"));
});

gulp.task("jade", function () {
  gulp.src("app/client/templates/*.jade")
    .pipe(jade())
    .pipe(gulp.dest("./app/.assets/templates/"))
});

gulp.task("watch", ["build"], function () {
  gulp.watch(["app/client/style/*.less"], ["less"]);
  gulp.watch(["app/client/templates/*.jade"], ["jade"]);
  gulp.watch(["app/client/js/**/*.js"], ["es6"]);
});

gulp.task('es6', function () {
  return gulp.src('app/client/js/**/*.js')
    .pipe(to5())
    .pipe(gulp.dest('app/.assets/js/'));
});


gulp.task("build", ["jade", "less", "es6"]);
gulp.task("default", ["build"]);
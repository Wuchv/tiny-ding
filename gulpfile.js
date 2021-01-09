const gulp = require('gulp');
const electron = require('electron-connect').server.create();

gulp.task('watch:electron', function () {
  electron.start();
  gulp.watch('./app/**/*.ts', electron.restart);
});

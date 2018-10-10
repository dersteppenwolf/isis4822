var gulp = require('gulp');
var bs = require('browser-sync').create();

gulp.task('browser-sync', function() {
    bs.init({
        server: {
            baseDir: "./"
        }
    });
});


gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(["index.html", "app.js", "data/*.csv", "js/*.js", "js/*.json", "pages/*.html", "css/*.css"]).on('change', bs.reload);
});

//プラグインの読み込み
// browserifyでファイル結合
// browser-syncでブラウザリロード
// vinyl-source-streamはgulpでbrowserifyを使うのに必要

var gulp = require('gulp');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var source = require('vinyl-source-stream');


// gulpタスクの作成
gulp.task('build', function (done) {
  browserify({
    entries: ['src/app.js'] // ビルド元
  }).bundle()
    .pipe(source('bundle.js')) // 出力ファイル名
    .pipe(gulp.dest('dist/')); // 出力ディレクトリ
  done();
});
gulp.task('browser-sync', function (done) {
  browserSync.init({
    server: {
      baseDir: "./", // 対象ディレクトリ
      index: "index.html" //indexファイル名
    }
  });
  done();
});
gulp.task('bs-reload', function (done) {
  browserSync.reload();
  done();
});

// Gulpを使ったファイルの監視
gulp.task('default', gulp.series(gulp.parallel('build', 'browser-sync'), function (done) {
  gulp.watch('./src/*.js', gulp.task('build'));
  gulp.watch("./*.html", gulp.task('bs-reload'));
  gulp.watch("./dist/*.+(js|css)", gulp.task('bs-reload'));
  done();
}));

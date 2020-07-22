
// import 変数名 from 'ライブラリ名';
// ES6の書き方。変数名はなんでもいい。
import gulp from 'gulp';
import webpackConfig from './webpack.config.js'; //webpackの設定ファイル
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';

// -------------------------
// gulpタスクの作成

// build
gulp.task('build', function () {
  gulp.src('src/js/app.js') // ビルド元ファイル
    // gulp-plumberを使って、途中でエラーが出ても最後まで処理を行う
    .pipe(plumber({
      // gulp-notifyを使って、.onError()でエラーメッセージを表示させる
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    // webpack 設定ファイルを元にwebpack()でjsファイルを変換
    .pipe(webpack(webpackConfig))
    // 出力先ディレクトリ
    .pipe(gulp.dest('dist/js/'));
});

// browser-sync
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./", // 対象ディレクトリ
      index: "index.html" //indexファイル名
    }
  });
});

// bs-reload
gulp.task('bs-reload', function () {
  browserSync.reload();
});

// -------------------------
// Gulpを使ったファイルの監視
gulp.task('default', gulp.series(gulp.parallel('build', 'browser-sync'), function () {
  gulp.watch('./src/*.js', gulp.task('build'));
  gulp.watch("./*.html", gulp.task('bs-reload'));
  gulp.watch("./dist/*.+(js|css)", gulp.task('bs-reload'));
}));

import gulp from 'gulp';
import webpackConfig from './webpack.config.js';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import eslint from 'gulp-eslint';

// gulpタスクの作成
gulp.task('build', function (done) {
  console.log('gulp build')
  gulp.src('src/js/app.js')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/js/'));
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

// ESLint
gulp.task('eslint', function () {
  return gulp.src(['src/**/*.js']) // チェック先を指定
    .pipe(plumber({
      // エラーハンドラ
      errorHandler: function (error) {
        const taskName = 'eslint';
        const title = '[task]' + taskName + ' ' + error.plugin;
        const errorMsg = 'error: ' + error.message;
        // ターミナルにエラーを出力
        console.error(title + '\n' + errorMsg);
        // エラー通知
        notify.onError({
          title: title,
          message: errorMsg,
          time: 3000
        });
      }
    }))
    .pipe(eslint({ useEslintrc: true })) // 設定ファイル .eslintrc を参照する
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(plumber.stop());
});


// ファイル監視
gulp.task('default', gulp.series(gulp.parallel('build', 'browser-sync'), function (done) {
  gulp.watch('./src/**/*.js', gulp.task('build'));
  gulp.watch('./*.html', gulp.task('bs-reload'));
  gulp.watch('./dist/**/*.+(js|css)', gulp.task('bs-reload'));
  gulp.watch('./src/**/*.js', gulp.task('eslint'));
  done();
}));

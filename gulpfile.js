// gulpプラグインの読み込み
const { src, dest, watch, series } = require('gulp');
// Sassをコンパイルするプラグインの読み込み
const gulpSass = require('gulp-sass');
const Fibers = require('fibers');
gulpSass.compiler = require('sass'); //Dart Sassを指定
const plumber = require('gulp-plumber'); //エラー時の強制終了を防止
const notify = require('gulp-notify'); //エラー発生時にデスクトップ通知する
const browserSync = require('browser-sync'); //ブラウザ反映

const sassCompile = () => {
  return (
    src('scss/**/*.scss')
      //エラーが出てもgulpを止めないけどエラー表示はさせる
      .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
      // Sassのコンパイルを実行
      .pipe(gulpSass({
        fiber: Fibers,
        outputStyle: 'expanded',　//css出力方法
      })
        // Sassのコンパイルエラーを表示
        // (これがないと自動的に止まってしまう)
        .on('error', gulpSass.logError))
      // cssフォルダー以下に保存
      .pipe(dest('css'))
      .pipe(browserSync.reload({ stream: true }))
  );
}

const browserSyncTask = (done) => {
  browserSync.init({
    server: {
      baseDir: "./", // ルートとなるディレクトリを指定
      index: "index.html"
    }
  })
  done();
}

//リロード
const bsReload = (done) => {
  browserSync.reload()
  done();
}

exports.default = series(browserSyncTask, function () {
  watch('scss/**/*.scss', sassCompile);
  watch('**/*.html', bsReload);
  watch('js/*.js', bsReload);
});


// webpackの設定ファイル

// プロジェクトまでのパスを取得して変数に格納
const path = require('path');

// オブジェクト形式で設定内容を格納
module.exports = {

  // 起点となるファイル（gulpで結合する際に大元となる変換元のファイル）
  entry: path.join(__dirname, 'src/js/app.js'),　// path.join()でフルパスにする
  // 出力先のアウトプットファイル
  output: {
    path: path.join(__dirname, 'dist/js'),// path.join()でフルパスにする
    filename: 'bundle.js'
  },

  module: {
    // webpackでbundle.jsに変換する際、'babel-loader'を使ってES6からES5に書き換える
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          // babel-presetの名前を指定
          // presets: ['react', 'es2015']
          presets: ['react', 'env']
        }
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    // 拡張子が.js .jsxのファイルを変換する
    extensions: ['.js', '.jsx']
  }
};

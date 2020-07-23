const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src/js/app.js'),
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:{
          presets: ['env']
        }
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    extensions: ['.js'],
    alias: {
      // npm install したvue(node_modules/vue/dist/vue.js) は
      // templete機能のないランタイム限定ビルドなので、
      // 以下のファイルを使うようエイリアスを張る
      vue: 'vue/dist/vue.esm.js' 
    }
  }
};

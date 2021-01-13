const path = require('path') // 파일이나 디렉터리 경로를 다루기 위한 NodeJS 기본 모듈
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
require('@babel/polyfill')

module.exports = (env, opts) => {
  const config = {
    // 중복되는 옵션(개발용, 제품용 둘다 포함)
    resolve: {
      extensions: ['.vue', '.js'],
      alias: {
        //절대경로 별칭
        '~': path.join(__dirname),
        'scss': path.join(__dirname, './scss')
      }
    },
    entry: {
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js')
      ]
    },
    output: {
      filename: '[name].js', // app.js
      path: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/, // 제외
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new CopyPlugin({
        patterns: [
          { from: 'assets/', to: '' }
        ]
      })
    ]
  }

  // 개발용
  if (opts.mode === 'development') {
    return merge(config, {
      devtool: 'eval',
      devServer: {
        open: false,
        hot: true
      }
    })
  }
  // 제품용
  else {
    return merge(config, {
      devtool: 'cheap-module-source-map',
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
  // 제품용
  // if(opts.mode === 'production'){
  // }
}

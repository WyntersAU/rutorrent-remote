const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    background: './src/background.js',
    remote: './src/remote.js',
  },
  output: {
    path: path.join(path.resolve(__dirname), 'extension', 'js'),
    filename: '[name].js',
  },
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.js$/,
      use: ['babel-loader'],
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'src',
      'node_modules',
    ],
  },
  node: {
    target: 'empty',
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  devtool: 'sourcemap',
};

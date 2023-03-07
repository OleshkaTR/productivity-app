const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const allPath = require('./myPaths');

module.exports = {
  mode: 'none',
  entry: ['regenerator-runtime/runtime.js', allPath.app],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
    alias: {
      '@less-helpers-module': path.resolve(__dirname, allPath.helpersStyle),
      '@assets-root-path': path.resolve(__dirname, allPath.assets),
      '@assets-fonts': path.resolve(__dirname, allPath.fonts),
    },
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader',
      ],
    },
    {
      test: /\.(jpg|jpeg|png|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[ext]',
        },
      }],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader'],
    },
    {
      test: /\.hbs$/,
      use: 'handlebars-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-object-rest-spread'],
        },
      },
    },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new CopyWebpackPlugin([
      allPath.index, // will copy to root of outDir (./dist folder)
      {
        from: allPath.staticPage,
        to: 'static',
      },
      {
        from: allPath.images,
        to: 'images',
      },
      {
        from: allPath.fonts,
        to: 'fonts',
      },
    ]),
  ],
  devServer: {
    contentBase: allPath.dist,
    port: 3000,
  },
};

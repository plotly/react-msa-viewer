const webpack = require('webpack');
const path = require('path');

const config = {
  entry: {
    index: ['./src/components/MSAViewer.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'react-msa-viewer',
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      amd: 'prop-types',
    },
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['react-app'],
      },
    }],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
};

module.exports = config;

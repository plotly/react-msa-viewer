const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('./src/stories'),
        loaders: [
          {
            loader: require.resolve('@storybook/addon-storysource/loader'),
            options: {
                prettierConfig: {
                  printWidth: 80,
                  singleQuote: false,
                }
              }
          },
        ],
        enforce: 'pre',
      }, {
        test: /\.(clustal|fasta|fa)$/,
        use: [
          {
            loader: 'raw-loader',
          }
        ]
      }
    ],
  },
};

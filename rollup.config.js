import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/lib.js',
  output: {
    sourcemap: true,
    name: "MSAViewer",
    file: "dist/index.umd.js",
    format: "umd",
    exports: "named", // or: 'default', 'named', 'none'
    globals: {
      react: 'React',
      'react-dom': 'ReactDom',
      'prop-types': 'PropTypes',
    }
  },
  external: [
    'react',
    'react-dom',
    'prop-types',
  ],
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react', '@babel/preset-env'],
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
      ],
      //externalHelpers: false,
    }),
    resolve({
    }),
    commonjs({
    }),
  ],
};

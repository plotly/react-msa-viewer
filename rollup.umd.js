import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: 'src/lib.js',
  output: {
    file: 'dist/index.umd.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    serve('dist'),
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
  ],
};

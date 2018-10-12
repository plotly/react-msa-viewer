import babel from 'rollup-plugin-babel';

export default {
  input: 'src/lib.js',
  output: {
    file: 'dist/index.esm.js',
    format: 'es',
    sourcemap: true,
  },
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
  ],
};

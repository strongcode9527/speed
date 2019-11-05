const resolve = require('rollup-plugin-node-resolve');
import babel from 'rollup-plugin-babel';
export default {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'cjs'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
          }),
        resolve({
            extensions: [ '.mjs', '.js', '.jsx', '.json' ],  // Default: [ '.mjs', '.js', '.json', '.node' ]
        })
    ]
  };
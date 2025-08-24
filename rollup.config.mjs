// @ts-check
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import { addDirective } from 'rollup-plugin-add-directive';

/**
 * @returns {import('rollup').RollupOptions}
 */
const createBuild = ({ inPath = '', outPath = inPath, inFile = 'index.ts' } = {}) => ({
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'reactish-state',
    'reactish-state/middleware'
  ],
  plugins: [
    nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    }),
    addDirective({ pattern: 'index' })
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false
  },
  input: `src/${inPath}${inFile}`,
  output: [
    {
      dir: `dist/cjs/${outPath}`,
      format: 'cjs',
      interop: 'default',
      entryFileNames: '[name].cjs',
      preserveModules: true
    },
    {
      dir: `dist/esm/${outPath}`,
      format: 'es',
      entryFileNames: '[name].mjs',
      preserveModules: true
    }
  ]
});

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [createBuild(), createBuild({ inPath: 'middleware/' })];

export default config;

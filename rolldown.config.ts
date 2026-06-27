import { defineConfig, type RolldownOptions } from 'rolldown';
import { addDirective } from 'rollup-plugin-add-directive';

const createBuild = ({
  inPath = '',
  outPath = inPath,
  inFile = 'index.ts'
}: { inPath?: string; outPath?: string; inFile?: string } = {}): RolldownOptions => ({
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'reactish-state',
    'reactish-state/middleware'
  ],
  plugins: [addDirective({ pattern: 'index' })],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false
  },
  transform: {
    target: ['es2020'],
    assumptions: {
      noDocumentAll: true
    },
    define: {
      'process.env.NODE_ENV': 'process.env.NODE_ENV'
    }
  },
  input: `src/${inPath}${inFile}`,
  output: [
    {
      dir: `dist/cjs/${outPath}`,
      format: 'cjs',
      entryFileNames: '[name].cjs',
      preserveModules: true,
      strict: true
    },
    {
      dir: `dist/esm/${outPath}`,
      format: 'es',
      entryFileNames: '[name].mjs',
      preserveModules: true
    }
  ]
});

export default defineConfig([
  createBuild(),
  createBuild({ inPath: 'middleware/' }),
  createBuild({ inPath: 'composable/' })
]);

import { defineConfig } from '@wagmi/cli';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const abiDir = path.resolve(__dirname, 'abi');
const outDir = path.resolve(__dirname, 'abi/generated');

const contractNames = readdirSync(abiDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => path.basename(file, '.abi.json'))
  .sort();

// Regenerate index.ts whenever wagmi loads this config.
writeFileSync(
  path.join(outDir, 'index.ts'),
  '// Auto-generated exports for all ABIs\n' +
    contractNames.map((name) => `export * from './${name}';`).join('\n') +
    '\n',
  'utf-8',
);

export default defineConfig(
  contractNames.map((name) => ({
    out: path.join(outDir, `${name}.ts`),
    contracts: [
      {
        name,
        abi: JSON.parse(
          readFileSync(path.join(abiDir, `${name}.abi.json`), 'utf-8'),
        ),
      },
    ],
    plugins: [],
  })),
);

import { defineConfig } from '@wagmi/cli';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';

/**
 * Dynamically creates a config object for each ABI JSON file in a directory.
 */
const generateContractConfigs = () => {
  const abiDir = path.resolve(__dirname, 'abi');

  const outDir = path.resolve(__dirname, 'abi/generated');
  if (!readdirSync(path.resolve(__dirname, 'abi')).includes('generated')) {
    readdirSync(path.resolve(__dirname, 'abi')).push('generated');
  }

  const filenames = readdirSync(abiDir).filter((file) =>
    file.endsWith('.json'),
  );

  return filenames.map((file) => {
    const fileContent = readFileSync(path.join(abiDir, file), 'utf-8');
    const abi = JSON.parse(fileContent);
    const contract = {
      name: path.basename(file, '.abi.json'),
      abi: abi,
    };

    return {
      out: path.join(outDir, `${contract.name}.ts`),
      contracts: [contract],
      plugins: [],
    };
  });
};

export default defineConfig(generateContractConfigs());

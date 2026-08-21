import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import type { Address } from 'viem';
import type { ContractObject } from 'shared/blockchain/types';
import type { EvmSupportedChain } from '../evm-addresses';
import type { MotionTags } from '../motion-categories';
import type { FactoryMetadata } from './define-factories';
import { FACTORIES } from './factories';

export type FactoryName = keyof typeof FACTORIES;

export type FactoryFormName = {
  [K in FactoryName]: (typeof FACTORIES)[K]['startable'] extends true
    ? K
    : never;
}[FactoryName];

export type FactoryDisplayOnlyName = Exclude<FactoryName, FactoryFormName>;

const entries = Object.entries(FACTORIES) as [FactoryName, FactoryMetadata][];

const namesWhere = <T extends FactoryName>(startable: boolean) =>
  Object.fromEntries(
    entries
      .filter(([, def]) => def.startable === startable)
      .map(([name]) => [name, name]),
  ) as { [K in T]: K };

// PascalCase on purpose: these mirror `MotionTypeForms` and
// `MotionTypeDisplayOnly`, the objects they are spread into.
export const FactoryForms = namesWhere<FactoryFormName>(true);
export const FactoryDisplayOnly = namesWhere<FactoryDisplayOnlyName>(false);

export const FACTORY_DISPLAY_NAMES = Object.fromEntries(
  entries.map(([name, def]) => [name, def.displayName]),
) as { [K in FactoryName]: string };

export const FACTORY_TAGS = Object.fromEntries(
  entries.map(([name, def]) => [name, def.tags]),
) as { [K in FactoryName]: MotionTags };

export const FACTORY_ABIS = Object.fromEntries(
  entries.map(([name, def]) => [name, def.abi]),
) as { [K in FactoryName]: (typeof FACTORIES)[K]['abi'] };

const addressesForChain = (chainId: EvmSupportedChain) =>
  Object.fromEntries(
    entries
      .filter(([, def]) => Boolean(def.addresses[chainId]))
      .map(([name, def]) => [name, def.addresses[chainId]]),
  ) as Partial<Record<FactoryName, Address>>;

export const FACTORY_ADDRESSES = {
  [CHAINS.Mainnet]: addressesForChain(CHAINS.Mainnet),
  [CHAINS.Hoodi]: addressesForChain(CHAINS.Hoodi),
};

export const FACTORY_CONTRACTS = Object.fromEntries(
  entries.map(([name, def]) => [
    name,
    { name, abi: def.abi, chainAddressMap: def.addresses },
  ]),
) as {
  [K in FactoryName]: ContractObject<(typeof FACTORIES)[K]['abi']>;
};

import type { Abi, Address } from 'viem';
import type { EvmSupportedChain } from '../evm-addresses';
import type { MotionTags } from '../motion-categories';

export type FactoryMetadata = {
  // true  -> MotionTypeForms
  // false -> MotionTypeDisplayOnly
  startable: boolean;
  abi: Abi;
  displayName: string;
  tags: MotionTags;
  addresses: Partial<Record<EvmSupportedChain, Address>>;
  // Multi-action factories only: title per `Action` enum ordinal, used to give
  // one factory address several motion titles. Ordinals are part of the
  // calldata ABI, so append only and never reorder.
  actionTitles?: readonly [string, ...string[]];
};

// Checks every entry against FactoryMetadata but keeps the exact keys and values
export const defineFactories = <T extends Record<string, FactoryMetadata>>(
  metadata: T,
) => metadata;

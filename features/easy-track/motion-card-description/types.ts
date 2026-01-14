import { DecodeFunctionResultReturnType, Abi } from 'viem';
import { REGISTRY_WITH_LIMITS_BY_MOTION_TYPE } from '../hooks/use-registry-with-limits';
import {
  NodeOperatorsRegistry,
  SandboxNodeOperatorsRegistry,
  SDVTRegistry,
} from 'shared/blockchain/contracts';

export type NestProps<T> =
  T extends Promise<infer U>
    ? NestProps<U>
    : T extends (...args: any[]) => infer R
      ? NestProps<R>
      : T extends object
        ? { [K in keyof T]: NestProps<T[K]> }
        : T;

export const NODE_OPERATORS_REGISTRY_MAP = {
  curated: NodeOperatorsRegistry,
  sdvt: SDVTRegistry,
  sandbox: SandboxNodeOperatorsRegistry,
} as const;

export type NodeOperatorsRegistryType =
  keyof typeof NODE_OPERATORS_REGISTRY_MAP;

/**
 * Helper type to extract decoded EVM script call data from an ABI
 * @example
 * type CallData = DecodeCallData<typeof myAbi>;
 */
export type DecodeCallData<T extends Abi> = DecodeFunctionResultReturnType<
  T,
  // @ts-expect-error - bypassing strict function name constraint
  'decodeEVMScriptCallData'
>;

/**
 * Standard props for motion card description components
 * @example
 * const MyComponent = ({ callData }: MotionDescriptionProps<typeof myAbi>) => {...}
 */
export type MotionDescriptionProps<T extends Abi> = {
  callData: DecodeCallData<T>;
  isOnChain?: boolean;
};

/**
 * Props for motion card descriptions with registry type
 * @example
 * const MyComponent = ({ callData, registryType }: MotionDescriptionWithRegistryProps<typeof myAbi>) => {...}
 */
export type MotionDescriptionWithRegistryProps<T extends Abi> = {
  callData: DecodeCallData<T>;
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE;
  isOnChain?: boolean;
};

/**
 * Type alias for registry keys
 */
export type RegistryType = keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE;

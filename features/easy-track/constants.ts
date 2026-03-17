import { MotionType } from './motion-types';
import {
  NodeOperatorIncreaseLimit,
  NodeOperatorsRegistry,
  SandboxNodeOperatorIncreaseLimit,
  SandboxNodeOperatorsRegistry,
  SDVTRegistry,
} from 'shared/blockchain/contracts';
import { MotionDisplayStatus } from './types';

export const MOTION_ATTENTION_PERIOD = 1 / 24;

// uint256 internal constant MAX_RESERVE_RATIO_BP = 9999;
export const MAX_RESERVE_RATIO_BP = 9999;
// uint256 internal constant MAX_FEE_BP = type(uint16).max;
export const MAX_FEE_BP = 65535;

export const INCREASE_LIMIT_MOTION_MAP = {
  [MotionType.NodeOperatorIncreaseLimit]: {
    evmContract: NodeOperatorIncreaseLimit,
    registryType: 'curated',
    motionType: MotionType.NodeOperatorIncreaseLimit,
  },
  [MotionType.SandboxNodeOperatorIncreaseLimit]: {
    evmContract: SandboxNodeOperatorIncreaseLimit,
    registryType: 'sandbox',
    motionType: MotionType.SandboxNodeOperatorIncreaseLimit,
  },
} as const;

export type IncreaseLimitMotionType = keyof typeof INCREASE_LIMIT_MOTION_MAP;

export const MAX_SUBMIT_HASH_COUNT = 200;

export const NODE_OPERATORS_REGISTRY_MAP = {
  curated: NodeOperatorsRegistry,
  sdvt: SDVTRegistry,
  sandbox: SandboxNodeOperatorsRegistry,
} as const;

export const MAX_MEV_BOOST_RELAY_STRING_LENGTH = 1024;

export const MAX_MEV_BOOST_RELAYS_COUNT = 40;

export const MAX_MEV_BOOST_UPDATE_COUNT = 20;

export const SIGNING_KEYS_ROLE =
  '0x75abc64490e17b40ea1e66691c3eb493647b24430b358bd87ec3e5127f1621ee'; // keccak256("MANAGE_SIGNING_KEYS")

export type NodeOperatorsRegistryType =
  keyof typeof NODE_OPERATORS_REGISTRY_MAP;

export const nodeOperatorsKeysInfo = (
  chainId: number,
  walletAddress: string,
  moduleAddress: string,
) =>
  `/api/node-operators/keys-info?chainId=${chainId}&walletAddress=${walletAddress}&moduleAddress=${moduleAddress}`;

export const MOTION_STATUS_COLOR_MAP: Record<MotionDisplayStatus, string> = {
  [MotionDisplayStatus.ACTIVE]: 'var(--lido-color-primary)',
  [MotionDisplayStatus.ATTENDED]: 'var(--accent-color-coral)',
  [MotionDisplayStatus.DANGER]: 'var(--accent-color-berry-light)',
  [MotionDisplayStatus.ATTENDED_DANGER]: 'var(--accent-color-berry)',
  [MotionDisplayStatus.ENACTED]: 'var(--accent-color-leaf)',
  [MotionDisplayStatus.DEFAULT]: 'var(--primary-color-black-50)',
};

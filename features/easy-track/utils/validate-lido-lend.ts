import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import {
  BaseError,
  ContractFunctionRevertedError,
  createPublicClient,
  http,
  type Abi,
  type Address,
  type Hex,
  type PublicClient,
} from 'viem';
import { readContract } from 'viem/actions';
import {
  lidoLendActivateMarketAbi,
  lidoLendCircuitBreakerActionsAbi,
  lidoLendExitBookActionsAbi,
  lidoLendGuardianActionsAbi,
  lidoLendMarketManagerActionsAbi,
  lidoLendRiskStewardActionsAbi,
} from 'abi/generated';
import { MotionType } from '@easy-track/motion-types';
import {
  encodeActivateMarketCallData,
  type FormData as ActivateMarketFormData,
} from '@easy-track/start-motion/parts/start-new-lido-lend-activate-market';
import {
  encodeManagerActionsCallData,
  type FormData as ManagerActionsFormData,
} from '@easy-track/start-motion/parts/start-new-lido-lend-market-manager-actions';
import {
  encodeGuardianActionsCallData,
  type FormData as GuardianActionsFormData,
} from '@easy-track/start-motion/parts/start-new-lido-lend-guardian-actions';
import {
  encodeCircuitBreakerActionsCallData,
  type FormData as CircuitBreakerActionsFormData,
} from '@easy-track/start-motion/parts/start-new-lido-lend-circuit-breaker-actions';
import {
  encodeExitBookActionsCallData,
  type FormData as ExitBookActionsFormData,
} from '@easy-track/start-motion/parts/start-new-lido-lend-exit-book-actions';
import {
  encodeRiskStewardActionsCallData,
  type FormData as RiskStewardActionsFormData,
} from '@easy-track/start-motion/parts/start-new-lido-lend-risk-steward-actions';
import { getScriptFactoryByMotionType } from './get-motion-type';

type ChainArgs = {
  chainId: CHAINS;
  provider: PublicClient;
  address?: Address;
  rpcUrl?: string;
};

// Reasons the form cannot rule out on its own, because they depend on on-chain state.
const REVERT_REASONS: Record<string, string> = {
  CALLER_IS_FORBIDDEN:
    'Connected account is not the trusted caller of this factory',
  MARKET_ALREADY_CREATED: 'A market with these parameters already exists',
  ZERO_VAULT: 'Preseed vault is the zero address',
  LIDO_LEND_MISMATCH:
    'Preseed vault belongs to a different Lido Lend deployment',
  MARKET_ID_MISMATCH:
    'Preseed vault was built for a different market. Check the market params against the vault.',
  MARKET_NOT_EMPTY:
    'The market already holds supply, so it cannot be preseeded',
  VAULT_NOT_EMPTY: 'Preseed vault already has shares outstanding',
  VAULT_ASSET_MISMATCH: 'Preseed vault asset does not match the loan token',
  VAULT_SHARES_TOO_LOW: 'Preseed would mint too few vault shares',
  PRESEED_EXCEEDS_MAX_DEPOSIT: 'Preseed amount is above the vault deposit cap',
  INSUFFICIENT_ASSET_BALANCE:
    'The preseeder does not hold enough of the loan token to seed this market',
  MARKET_NOT_FOUND: 'No market with this ID exists',
  MARKET_IS_NOT_FROZEN: 'One of the listed markets is not frozen',
  FEE_ALREADY_SET: 'The market already has this fee',
  SAME_CONFIG: 'The market already has this config',
  SAME_INSTANT_ACTIVATION_STATUS:
    'Instant activation is already in this state for this caller',
  INVALID_ACTIVATION_DELAYS:
    'Min activation delay must not exceed max activation delay',
  INVALID_MAX_GUARDIANS_QUORUM_DELAY:
    'Max guardians quorum delay must be zero or exceed max activation delay',
  INVALID_MIN_DEPOSIT_AMOUNT:
    'Min deposit amount must not exceed min activation amount',
  SETTLEMENT_CONFIG_OUT_OF_RANGE: 'Settlement config values are out of range',
  GUARDIAN_ALREADY_ADDED: 'This account is already a guardian of the market',
  GUARDIAN_NOT_FOUND: 'This account is not a guardian of the market',
  ACCOUNT_IS_DELEGATE:
    'This account is already a delegate of another guardian on the market',
  MAX_GUARDIANS_REACHED: 'The market already has the maximum guardian count',
  INVALID_QUORUM:
    'Quorum must be non-zero and no greater than the resulting guardian count',
  SAME_QUORUM: 'The market already has this guardians quorum',
  SAME_SUSPECT_WINDOW: 'The market already has this suspect window',
  SUSPECT_WINDOW_TOO_HIGH:
    'Suspect window is above the maximum the market allows',
  CIRCUIT_BREAKER_NOT_PAUSER:
    'The circuit breaker does not hold the PAUSER_ROLE on this market',
  PAUSE_DURATION_OUT_OF_RANGE:
    'Pause duration is outside the range the circuit breaker allows',
  HEARTBEAT_INTERVAL_OUT_OF_RANGE:
    'Heartbeat interval is outside the range the circuit breaker allows',
  EMPTY_MARKETS_LIST: 'At least one market is required',
  EMPTY_VAULTS: 'At least one vault is required',
  ZERO_STEWARD: 'Risk steward is the zero address',
  STEWARD_ALREADY_ADDED: 'This account is already a risk steward of the market',
  STEWARD_NOT_FOUND: 'This account is not a risk steward of the market',
};

// The Lido Lend factories run every check inside `createEVMScript`, a view
// function whose trusted-caller check reads its `_creator` argument rather than
// msg.sender. Dry-running it surfaces the contract's own revert reason, which
// covers the market, preseeder and controller state no form can check alone.
const dryRunCreateEvmScript = async (
  abi: Abi,
  motionType: MotionType,
  encodeCallData: () => Hex,
  { chainId, provider, address, rpcUrl }: ChainArgs,
) => {
  const factory = getScriptFactoryByMotionType(chainId, motionType);

  if (!factory || !address) {
    return null;
  }

  // The project-wide transport turns eth_call reverts into a null result, which
  // hides the revert reason this check exists to read. Bypass it when we can.
  const client = rpcUrl
    ? createPublicClient({ transport: http(rpcUrl) })
    : provider;

  try {
    await readContract(client, {
      abi,
      address: factory,
      functionName: 'createEVMScript',
      args: [address, encodeCallData()],
    });

    return null;
  } catch (error) {
    const revert =
      error instanceof BaseError
        ? error.walk((err) => err instanceof ContractFunctionRevertedError)
        : null;

    // A failed read is not a rejected motion, so leave the call to the wallet.
    if (!(revert instanceof ContractFunctionRevertedError)) {
      console.error(error);
      return null;
    }

    const reason = revert.reason;

    // viem reports a reasonless revert as the bare "execution reverted". The
    // factory only reverts that way when it calls into an address with no code,
    // so one of the supplied contracts is not what it claims to be.
    if (!reason || reason === 'execution reverted') {
      return 'Factory rejected the motion without a reason. Check that every address is the contract it should be.';
    }

    return REVERT_REASONS[reason] ?? `Factory rejected the motion: ${reason}`;
  }
};

export const validateLidoLendActivateMarket = (
  formData: ActivateMarketFormData,
  chainArgs: ChainArgs,
) =>
  dryRunCreateEvmScript(
    lidoLendActivateMarketAbi,
    MotionType.LidoLendActivateMarket,
    () => encodeActivateMarketCallData(formData),
    chainArgs,
  );

export const validateLidoLendMarketManagerActions = (
  formData: ManagerActionsFormData,
  chainArgs: ChainArgs,
) =>
  dryRunCreateEvmScript(
    lidoLendMarketManagerActionsAbi,
    MotionType.LidoLendMarketManagerActions,
    () => encodeManagerActionsCallData(formData),
    chainArgs,
  );

export const validateLidoLendGuardianActions = (
  formData: GuardianActionsFormData,
  chainArgs: ChainArgs,
) =>
  dryRunCreateEvmScript(
    lidoLendGuardianActionsAbi,
    MotionType.LidoLendGuardianActions,
    () => encodeGuardianActionsCallData(formData),
    chainArgs,
  );

export const validateLidoLendCircuitBreakerActions = (
  formData: CircuitBreakerActionsFormData,
  chainArgs: ChainArgs,
) =>
  dryRunCreateEvmScript(
    lidoLendCircuitBreakerActionsAbi,
    MotionType.LidoLendCircuitBreakerActions,
    () => encodeCircuitBreakerActionsCallData(formData),
    chainArgs,
  );

export const validateLidoLendExitBookActions = (
  formData: ExitBookActionsFormData,
  chainArgs: ChainArgs,
) =>
  dryRunCreateEvmScript(
    lidoLendExitBookActionsAbi,
    MotionType.LidoLendExitBookActions,
    () => encodeExitBookActionsCallData(formData),
    chainArgs,
  );

export const validateLidoLendRiskStewardActions = (
  formData: RiskStewardActionsFormData,
  chainArgs: ChainArgs,
) =>
  dryRunCreateEvmScript(
    lidoLendRiskStewardActionsAbi,
    MotionType.LidoLendRiskStewardActions,
    () => encodeRiskStewardActionsCallData(formData),
    chainArgs,
  );

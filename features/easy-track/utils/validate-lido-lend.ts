import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import {
  BaseError,
  ContractFunctionRevertedError,
  createPublicClient,
  http,
  type Address,
  type PublicClient,
} from 'viem';
import { readContract } from 'viem/actions';
import { lidoLendActivateMarketAbi } from 'abi/generated';
import { MotionType } from '@easy-track/motion-types';
import {
  encodeActivateMarketCallData,
  type FormData as ActivateMarketFormData,
} from '@easy-track/start-motion/parts/start-new-lido-lend-activate-market';
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
};

// The Lido Lend factory runs every check inside `createEVMScript`, a view
// function whose trusted-caller check reads its `_creator` argument rather than
// msg.sender. Dry-running it surfaces the contract's own revert reason, which
// covers the market, preseeder and controller state no form can check alone.
export const validateLidoLendActivateMarket = async (
  formData: ActivateMarketFormData,
  { chainId, provider, address, rpcUrl }: ChainArgs,
) => {
  const factory = getScriptFactoryByMotionType(
    chainId,
    MotionType.LidoLendActivateMarket,
  );

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
      abi: lidoLendActivateMarketAbi,
      address: factory,
      functionName: 'createEVMScript',
      args: [address, encodeActivateMarketCallData(formData)],
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

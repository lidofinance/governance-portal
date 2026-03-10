import { ToastError } from '@lidofinance/lido-ui';

import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { VaultsAdapter } from 'shared/blockchain/contracts';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { vaultsAdapterAbi } from 'abi/generated';
import { decodeAbiParameters, formatEther, PublicClient } from 'viem';
import { readContract } from 'viem/actions';

const WITHDRAWAL_REQUEST_ADDRESS = '0x00000961Ef480Eb55e80D19ad83579A64c007002';

type FormArgs = {
  vaults: { pubkey: string }[];
};

type ChainArgs = {
  chainId: CHAINS;
  provider: PublicClient;
};

export const validateForceExits = async (
  { vaults }: FormArgs,
  { provider, chainId }: ChainArgs,
) => {
  try {
    const { data: feeData } = await provider.call({
      to: WITHDRAWAL_REQUEST_ADDRESS,
      data: '0x',
    });

    // '0x' is truthy but has no payload; uint256 requires 32 bytes (66 chars with 0x prefix)
    if (!feeData || feeData.length < 66) {
      throw new Error('No fee data returned');
    }

    const [fee] = decodeAbiParameters([{ type: 'uint256' }], feeData);

    const numKeys = vaults.length;

    const vaultsAdapterAddress = getContractAddress(VaultsAdapter, chainId);
    if (!vaultsAdapterAddress) {
      return 'Vaults Adapter address is not defined for the selected network';
    }

    const validatorExitFeeLimit = await readContract(provider, {
      abi: vaultsAdapterAbi,
      address: vaultsAdapterAddress,
      functionName: 'validatorExitFeeLimit',
    });

    if (fee > validatorExitFeeLimit) {
      return 'Validator exit fee exceeds the limit set by the Vaults Adapter';
    }

    const balance = await provider.getBalance({
      address: vaultsAdapterAddress,
    });
    const totalFeeRequired = BigInt(numKeys) * fee;

    if (totalFeeRequired > balance) {
      return `The VaultsAdapter does not have enough ETH to cover the exit fees. Required: ${formatEther(totalFeeRequired)} ETH, available: ${formatEther(balance)} ETH`;
    }

    return null;
  } catch (error) {
    console.error('Error fetching withdrawal request fee data', {
      error,
    });
    ToastError(
      'Unable to fetch withdrawal request fee data. Transaction may fail.',
      {},
    );
    // Do not return error message to not block form submission
    return null;
  }
};

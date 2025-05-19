import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { escrowAbi } from 'abi/ts';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { computeRageQuitEscrowsBalances } from '../utils';
import { useState } from 'react';
import { WstETH } from 'shared/blockchain/contracts';

export const useEscrowBalances = () => {
  const { address: accountAddress } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const { chainId } = useLidoSDK();
  const {
    vetoSignallingAddress,
    rageQuitAddress: currentRageQuitEscrowAddress,
    historicalEscrowAddresses,
  } = useDualGovernanceContext();

  const readEscrowContract = useReadContractGetter(escrowAbi);
  const readWstEthContract = useReadContract(WstETH);

  const isEnabled =
    !!vetoSignallingAddress &&
    !!currentRageQuitEscrowAddress &&
    !!accountAddress;
  return useQuery({
    queryKey: [
      'escrow-balances',
      chainId,
      vetoSignallingAddress,
      currentRageQuitEscrowAddress,
      accountAddress,
    ],
    staleTime: Infinity,
    enabled: isEnabled,
    queryFn: async () => {
      if (!isEnabled) {
        return null;
      }

      const readVetoSignallingContract = readEscrowContract(
        vetoSignallingAddress,
      );

      const minAssetLockDuration = await readVetoSignallingContract(
        'getMinAssetsLockDuration',
      );
      const vetoSignallingBalance = await readVetoSignallingContract(
        'getVetoerDetails',
        [accountAddress],
      );

      const vetoSignallingSum =
        vetoSignallingBalance.stETHLockedShares +
        vetoSignallingBalance.unstETHLockedShares;

      const computedRageQuitEscrowsBalances =
        await computeRageQuitEscrowsBalances({
          readEscrowContract,
          historicalEscrowAddresses,
          vetoSignallingAddress,
          accountAddress,
        });

      setIsLoading(false);

      // const wstETHLockedShares = vetoSignallingBalance.stETHLockedShares;
      const wstETHLockedShares = await readWstEthContract.readContract(
        'getStETHByWstETH',
        [vetoSignallingBalance.stETHLockedShares],
      );

      const totalStETHLockedSharesInRageQuitEscrows =
        computedRageQuitEscrowsBalances
          ? Object.values(computedRageQuitEscrowsBalances).reduce(
              (sum, balance) => sum + balance.totalStETHLockedShares,
              0n,
            )
          : 0n;

      const totalUnstETHLockedSharesInRageQuitEscrows =
        computedRageQuitEscrowsBalances
          ? Object.values(computedRageQuitEscrowsBalances).reduce(
              (sum, balance) => sum + balance.totalUnstETHLockedShares,
              0n,
            )
          : 0n;
      const totalLockedSharesInRageQuitEscrows =
        totalStETHLockedSharesInRageQuitEscrows +
        totalUnstETHLockedSharesInRageQuitEscrows;

      const assetUnlockTimestamp =
        vetoSignallingBalance.lastAssetsLockTimestamp + minAssetLockDuration;

      return {
        vetoSignallingBalance: {
          totalLockedShares: vetoSignallingSum,
          wstETHLockedShares,
          ...vetoSignallingBalance,
        },
        rageQuitsBalance: {
          totalLockedShares: totalLockedSharesInRageQuitEscrows,
          historicalBalances: computedRageQuitEscrowsBalances || {},
          totalStETHLockedSharesInRageQuitEscrows,
          totalUnstETHLockedSharesInRageQuitEscrows,
        },
        totalLockedSharesInEscrows:
          vetoSignallingSum + totalLockedSharesInRageQuitEscrows,
        assetUnlockTimestamp,
        isLoading,
      };
    },
  });
};

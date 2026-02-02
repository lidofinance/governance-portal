import { useCallback } from 'react';
import { VaultData } from '../types';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { OperatorGrid, StETH, VaultHub } from 'shared/blockchain/contracts';
import { useSimpleReducer } from 'shared/hooks/use-simple-reducer';
import { Address } from 'viem';
import { stakingVaultAbi } from 'abi/generated';

const fetchVaultNodeOperator = async (
  address: string,
  vaultGetter: ReturnType<typeof useReadContractGetter<typeof stakingVaultAbi>>,
) => {
  try {
    return await vaultGetter(address as Address)('nodeOperator');
  } catch (error) {
    return null;
  }
};

// Source: VaultHub.sol - DISCONNECT_NOT_INITIATED = type(uint48).max;
const DISCONNECT_NOT_INITIATED = 0xffffffffffffn;

type OptionalDataParams = {
  includeBadDebt?: boolean;
  includeJailStatus?: boolean;
};

export const useVaultsDataMap = (params?: OptionalDataParams) => {
  const [vaultsDataMap, setState] = useSimpleReducer<
    Record<string, VaultData | null | undefined>
  >({});

  const vaultHub = useReadContract(VaultHub);
  const stETH = useReadContract(StETH);
  const operatorGrid = useReadContract(OperatorGrid);
  const stakingVault = useReadContractGetter(stakingVaultAbi);

  const getVaultData = useCallback(
    async (address: string) => {
      const lowerAddress = address.toLowerCase();

      if (vaultsDataMap[lowerAddress] !== undefined) {
        return vaultsDataMap[lowerAddress];
      }

      // Check that vault exists
      const nodeOperator = await fetchVaultNodeOperator(
        lowerAddress,
        stakingVault,
      );

      if (!nodeOperator) {
        setState({ [lowerAddress]: null });
        return null;
      }

      try {
        const vaultData = await vaultHub.readContract('vaultConnection', [
          lowerAddress as Address,
        ]);

        // For debt calculation
        let badDebtEth = 0n;
        if (params?.includeBadDebt) {
          const [vaultRecord, totalValue] = await Promise.all([
            vaultHub.readContract('vaultRecord', [lowerAddress as Address]),
            vaultHub.readContract('totalValue', [lowerAddress as Address]),
          ]);
          const totalValueShares = await stETH.readContract(
            'getSharesByPooledEth',
            [totalValue],
          );

          const badDebtShares =
            totalValueShares >= vaultRecord.liabilityShares
              ? 0n
              : vaultRecord.liabilityShares - totalValueShares;

          badDebtEth =
            badDebtShares > 0
              ? await stETH.readContract('getSharesByPooledEth', [
                  badDebtShares,
                ])
              : 0n;
        }

        let jailStatus = false;
        if (params?.includeJailStatus) {
          jailStatus = await operatorGrid.readContract('isVaultInJail', [
            lowerAddress as Address,
          ]);
        }

        // Source: VaultHub.sol - see isVaultConnected function
        const isVaultConnected = vaultData.vaultIndex !== 0n;

        // Source: VaultHub.sol - see _isPendingDisconnect function
        const isPendingDisconnect =
          BigInt(vaultData.disconnectInitiatedTs) > 0n &&
          BigInt(vaultData.disconnectInitiatedTs) !== DISCONNECT_NOT_INITIATED;

        const result = {
          nodeOperator,
          isVaultConnected,
          isPendingDisconnect,
          infraFeeBP: vaultData.infraFeeBP,
          liquidityFeeBP: vaultData.liquidityFeeBP,
          reservationFeeBP: vaultData.reservationFeeBP,
          badDebtEth,
          jailStatus,
        };

        setState({ [lowerAddress]: result });

        return result;
      } catch (error) {
        setState({ [lowerAddress]: null });
        return null;
      }
    },
    [
      vaultsDataMap,
      setState,
      vaultHub,
      stETH,
      operatorGrid,
      params,
      stakingVault,
    ],
  );

  return {
    vaultsDataMap,
    getVaultData,
  };
};

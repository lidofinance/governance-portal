import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { DualGovernance, StETH } from 'shared/blockchain/contracts';
import { useEscrowAddresses } from './use-escrow-addresses';

import { dgConfigProviderAbi, escrowAbi } from 'abi/ts';
import { formatEth, formatPercent16 } from 'shared/blockchain/utils';
import {
  DualGovernanceState,
  GovernanceState,
  VisibleGovernanceState,
} from '../types';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';

const NORMAL_WARNING_STATE_THRESHOLD_PERCENT = 30n;

// Normal: DG.Normal && < 30%
// NormalWarning: DG.Normal && >= 30%
// BlockedVetoSignalling: DG.VetoSignalling
// BlockedRageQuit: DG.RageQuit
// BlockedDeactivation: DG.VetoSignallingDeactivation
// Cooldown: DG.Cooldown
// Deadlock: DG.RageQuit && Reseal something something TBA
export const useDualGovernanceState = () => {
  const { chainId } = useLidoSDK();
  const { vetoSignallingAddress, isLoading: isEscrowLoading } =
    useEscrowAddresses();

  const dualGovernance = useReadContract(DualGovernance);
  const stEth = useReadContract(StETH);
  const readEscrowGetter = useReadContractGetter(escrowAbi);

  const dgConfigGetter = useReadContractGetter(dgConfigProviderAbi);

  const { data, isLoading } = useQuery<DualGovernanceState | null>({
    queryKey: ['dg-current-state', chainId],
    staleTime: Infinity,
    enabled: !!vetoSignallingAddress,

    queryFn: async () => {
      if (!vetoSignallingAddress) {
        return null;
      }

      const readVetoSignalling = readEscrowGetter(vetoSignallingAddress);
      const vetoSupportPercent = await readVetoSignalling('getRageQuitSupport');

      const lockedAssets = await readVetoSignalling('getLockedAssetsTotals');

      const unfinalizedShares =
        lockedAssets.stETHLockedShares + lockedAssets.unstETHUnfinalizedShares;

      const pooledEthByShares = await stEth.readContract(
        'getPooledEthByShares',
        [unfinalizedShares],
      );

      const totalStEthInEscrow =
        pooledEthByShares + lockedAssets.unstETHFinalizedETH;

      const dgConfigAddress =
        await dualGovernance.readContract('getConfigProvider');

      const { firstSealRageQuitSupport } = await dgConfigGetter(
        dgConfigAddress,
      )('getDualGovernanceConfig');

      const amountTillNextPhase = firstSealRageQuitSupport - vetoSupportPercent;

      const normalWarningStateThreshold =
        (firstSealRageQuitSupport * NORMAL_WARNING_STATE_THRESHOLD_PERCENT) /
        100n;

      const contractState =
        await dualGovernance.readContract('getPersistedState');

      let visibleState: VisibleGovernanceState = VisibleGovernanceState.Normal;

      switch (contractState) {
        case GovernanceState.Normal:
          if (vetoSupportPercent >= normalWarningStateThreshold) {
            visibleState = VisibleGovernanceState.NormalWarning;
          }
          break;
        case GovernanceState.VetoSignalling:
          visibleState = VisibleGovernanceState.BlockedVetoSignalling;
          break;
        case GovernanceState.VetoSignallingDeactivation:
          visibleState = VisibleGovernanceState.BlockedDeactivation;
          break;
        case GovernanceState.RageQuit:
          visibleState = VisibleGovernanceState.BlockedRageQuit;
          break;
        case GovernanceState.VetoCooldown:
          visibleState = VisibleGovernanceState.Cooldown;
          break;
      }

      return {
        vetoSupportPercent: formatPercent16(vetoSupportPercent),
        totalStEthInEscrow: formatEth(totalStEthInEscrow),
        amountTillNextPhasePercent: formatPercent16(amountTillNextPhase),
        visibleState,
      };
    },
  });

  return {
    data,
    isLoading: isLoading || isEscrowLoading,
  };
};

import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { DualGovernance, StETH } from 'shared/blockchain/contracts';
import { useContractInstance } from 'shared/blockchain/hooks/use-contract-instance';
import { EscrowContract, useEscrow } from './use-escrow';
import { getContractInstance } from 'shared/blockchain/get-contract-instance';

import { dgConfigProviderAbi, dualGovernanceAbi, stEthAbi } from 'abi/ts';
import { formatEth, formatPercent16 } from 'shared/blockchain/utils';
import { LidoSDKCore } from '@lidofinance/lido-ethereum-sdk';
import {
  DualGovernanceState,
  GovernanceState,
  VisibleGovernanceState,
} from '../types';

const NORMAL_WARNING_STATE_THRESHOLD_PERCENT = 30n;

// TODO: move to blockchain module
type StETHContract = ReturnType<typeof getContractInstance<typeof stEthAbi>>;
type DualGovernanceContract = ReturnType<
  typeof getContractInstance<typeof dualGovernanceAbi>
>;

// Normal: DG.Normal && < 30%
// NormalWarning: DG.Normal && >= 30%
// BlockedVetoSignalling: DG.VetoSignalling
// BlockedRageQuit: DG.RageQuit
// BlockedDeactivation: DG.VetoSignallingDeactivation
// Cooldown: DG.Cooldown
// Deadlock: DG.RageQuit && Reseal something something TBA
export const useDualGovernanceState = () => {
  const { chainId, core } = useLidoSDK();
  const dualGovernance = useContractInstance(DualGovernance);
  const stEth = useContractInstance(StETH);
  const { vetoSignallingEscrow, isLoading: isEscrowLoading } = useEscrow();

  const { data, isLoading } = useQuery<DualGovernanceState | null>({
    queryKey: ['dg-current-state', chainId],
    staleTime: Infinity,
    enabled: !!vetoSignallingEscrow,
    queryFn: async () => {
      if (!vetoSignallingEscrow) {
        return null;
      }

      const vetoSupportPercent =
        await vetoSignallingEscrow.read.getRageQuitSupport();

      const totalStEthInEscrow = await getTotalStEthAmountInDg(
        vetoSignallingEscrow,
        stEth,
      );

      const { firstSealRageQuitSupport } = await getDgConfig(
        dualGovernance,
        core,
      );

      const amountTillNextPhase = firstSealRageQuitSupport - vetoSupportPercent;

      const normalWarningStateThreshold =
        (firstSealRageQuitSupport * NORMAL_WARNING_STATE_THRESHOLD_PERCENT) /
        100n;

      const contractState = await dualGovernance.read.getPersistedState();

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

const getTotalStEthAmountInDg = async (
  escrow: EscrowContract,
  stEth: StETHContract,
) => {
  const lockedAssets = await escrow.read.getLockedAssetsTotals();

  const unfinalizedShares =
    lockedAssets.stETHLockedShares + lockedAssets.unstETHUnfinalizedShares;

  const pooledEthByShares = await stEth.read.getPooledEthByShares([
    unfinalizedShares,
  ]);

  return pooledEthByShares + lockedAssets.unstETHFinalizedETH;
};

const getDgConfig = async (
  dualGovernance: DualGovernanceContract,
  core: LidoSDKCore,
) => {
  const dgConfigAddress = await dualGovernance.read.getConfigProvider();

  const dgConfigContract = getContractInstance(
    dgConfigAddress,
    dgConfigProviderAbi,
    core,
  );

  return dgConfigContract.read.getDualGovernanceConfig();
};

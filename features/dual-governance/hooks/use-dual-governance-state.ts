import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { DualGovernance, StETH } from 'shared/blockchain/contracts';

import { escrowAbi } from 'abi/ts';
import { formatEth, parsePercent16 } from 'shared/blockchain/utils';
import {
  DualGovernanceState,
  GovernanceState,
  UseEventWatcherConfig,
  VisibleGovernanceState,
} from '../types';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { Address } from 'viem';
import { useWatchContractEvent } from 'wagmi';
import { useDualGovernanceConfig } from './use-dual-governance-config';

const NORMAL_WARNING_STATE_THRESHOLD_PERCENT = 30n;
const WATCH_EVENT_POLLING_INTERVAL = 60000;

type Args = {
  vetoSignallingAddress: Address | undefined;
};

export const useActivateNextStateEventWatcher = ({
  chainId,
  refetchFn,
}: UseEventWatcherConfig<DualGovernanceState>) => {
  useWatchContractEvent({
    address: DualGovernance.chainAddressMap[chainId] as Address,
    abi: DualGovernance.abi,
    eventName: 'DualGovernanceStateChanged',
    poll: true,
    pollingInterval: WATCH_EVENT_POLLING_INTERVAL,
    onLogs(logs) {
      console.log('Dual governance state changed', logs);
      refetchFn();
    },
  });
};

// Normal: DG.Normal && < 30%
// Warning: DG.Normal && >= 30%
// BlockedVetoSignalling: DG.VetoSignalling
// BlockedRageQuit: DG.RageQuit
// BlockedDeactivation: DG.VetoSignallingDeactivation
// Cooldown: DG.Cooldown
// Deadlock: DG.RageQuit && Reseal something something TBA
export const useDualGovernanceState = ({ vetoSignallingAddress }: Args) => {
  const { chainId } = useLidoSDK();
  const { data: dualGovernanceConfig } = useDualGovernanceConfig();

  const dualGovernance = useReadContract(DualGovernance);
  const stEth = useReadContract(StETH);
  const readEscrowGetter = useReadContractGetter(escrowAbi);

  const isEnabled = !!dualGovernanceConfig && !!vetoSignallingAddress;

  return useQuery<DualGovernanceState | undefined>({
    queryKey: ['dg-current-state', chainId],
    staleTime: Infinity,
    enabled: isEnabled,

    queryFn: async () => {
      if (!isEnabled) return;

      const readVetoSignalling = readEscrowGetter(vetoSignallingAddress);
      const rageQuitSupport = await readVetoSignalling('getRageQuitSupport');

      const lockedAssets = await readVetoSignalling(
        'getSignallingEscrowDetails',
      );

      const unfinalizedShares =
        lockedAssets.totalStETHLockedShares +
        lockedAssets.totalUnstETHUnfinalizedShares;

      const pooledEthByShares = await stEth.readContract(
        'getPooledEthByShares',
        [unfinalizedShares],
      );

      const totalStEthInEscrow =
        pooledEthByShares + lockedAssets.totalUnstETHFinalizedETH;

      const detailedState =
        await dualGovernance.readContract('getStateDetails');

      const { firstSealRageQuitSupport, secondSealRageQuitSupport } =
        dualGovernanceConfig;

      const contractState = detailedState.persistedState;

      const nextPhaseThreshold =
        contractState === GovernanceState.VetoSignalling ||
        contractState === GovernanceState.VetoSignallingDeactivation
          ? secondSealRageQuitSupport
          : firstSealRageQuitSupport;

      const amountTillNextPhase = nextPhaseThreshold - rageQuitSupport;

      const warningStateThreshold =
        (firstSealRageQuitSupport * NORMAL_WARNING_STATE_THRESHOLD_PERCENT) /
        100n;

      let visibleState: VisibleGovernanceState = VisibleGovernanceState.Loading;

      switch (detailedState.persistedState) {
        case GovernanceState.Normal:
          if (rageQuitSupport >= warningStateThreshold) {
            visibleState = VisibleGovernanceState.Warning;
          } else {
            visibleState = VisibleGovernanceState.Normal;
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

      const stEthTotalSupply = await stEth.readContract('totalSupply');

      const isAssetManagementLocked =
        detailedState.persistedState !== GovernanceState.RageQuit &&
        detailedState.effectiveState === GovernanceState.RageQuit;

      return {
        visibleState,
        rageQuitSupport,
        totalStEthInEscrow: formatEth(totalStEthInEscrow),
        amountTillNextPhasePercent: parsePercent16(amountTillNextPhase),
        nextPhaseSupportThresholdPercent: parsePercent16(nextPhaseThreshold),
        stEthTotalSupply:
          stEthTotalSupply + lockedAssets.totalUnstETHFinalizedETH,
        detailedState,
        isAssetManagementLocked,
      };
    },
  });
};

import { ProposalStatus } from '../proposals/types';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { VisibleGovernanceState } from '../types';
import { useProposalDelaysQuery } from './use-proposal-timelock';
import { useCountdown } from 'shared/hooks/use-countdown';
import { useEffect, useState } from 'react';
import { BadgeVariant } from '../proposals/shared-components/vote-status-badge/types';
import { Text } from 'shared/components/text';
import { useDualGovernanceConfig } from './use-dual-governance-config';
import { useIsEmergencyModeActive } from './useIsEmergencyModeActive';

const statusText = {
  loading: 'Loading...',
  pending: 'Pending in Dual Governance',
  readyToSchedule: 'Ready to Schedule Execution',
  readyToExecute: 'Ready to execute',
  executionScheduled: 'Execution Scheduled',
  executed: 'Executed',
  blocked: 'Blocked',
  vetoPossible: 'Veto possible for',
  cancelled: 'Cancelled',
};

type Props = {
  proposalStatus?: ProposalStatus;
  submittedAt?: number;
  scheduledAt?: number;
};

type UseProposalStatusReturnType = {
  badge: {
    text: string;
    variant: BadgeVariant;
  };
  info: React.JSX.Element | null;
} | null;

// TODO: add link
const emergencyCommitteeLinkText = (
  <span>
    Only <b>Emergency Committee</b> may stop the execution for
  </span>
);

// TODO: add Date support so it can be used in the Preview component
export const useProposalStatus = ({
  proposalStatus,
  submittedAt,
  scheduledAt,
}: Props): UseProposalStatusReturnType => {
  const [targetTime, setTargetTime] = useState(0);

  const { data: delays } = useProposalDelaysQuery({
    enabled: !!proposalStatus,
  });

  const { visibleState, detailedState, firstSealRageQuitSupport } =
    useDualGovernanceContext();
  const { data: dgConfig } = useDualGovernanceConfig();
  const vetoSignallingDeactivationMaxDuration =
    dgConfig?.vetoSignallingDeactivationMaxDuration;

  const { timeFormatted: targetCountdown, isFinished: isCountdownFinished } =
    useCountdown(targetTime);

  const { isEmergencyModeActive } = useIsEmergencyModeActive();

  const deactivationTargetTimestamp =
    detailedState?.persistedStateEnteredAt &&
    vetoSignallingDeactivationMaxDuration
      ? detailedState.persistedStateEnteredAt +
        vetoSignallingDeactivationMaxDuration
      : 0;

  const { timeFormatted: deactivationTimeFormatted } = useCountdown(
    deactivationTargetTimestamp,
  );

  useEffect(() => {
    if (proposalStatus === ProposalStatus.Submitted && submittedAt && delays) {
      if (
        visibleState === VisibleGovernanceState.Normal ||
        visibleState === VisibleGovernanceState.Warning
      ) {
        setTargetTime(submittedAt + delays.afterSubmitDelay);
      }

      /**
       * As we have 2 delays (afterSubmitDelay and vetoSignallingDeactivationMaxDuration),
       * we take the largest timestamp as the countdown target for the BlockedDeactivation state
       */
      if (visibleState === VisibleGovernanceState.BlockedDeactivation) {
        const vetoSignallingDeactivationMaxDuration =
          dgConfig?.vetoSignallingDeactivationMaxDuration;

        const deactivationTargetTimestamp =
          detailedState?.persistedStateEnteredAt &&
          vetoSignallingDeactivationMaxDuration
            ? detailedState.persistedStateEnteredAt +
              vetoSignallingDeactivationMaxDuration
            : 0;

        const afterSubmitDelayTargetTimeStamp =
          delays.afterSubmitDelay + submittedAt;

        const targetTime = Math.max(
          deactivationTargetTimestamp,
          afterSubmitDelayTargetTimeStamp,
        );

        setTargetTime(targetTime);
      }
    }
    if (proposalStatus === ProposalStatus.Scheduled && scheduledAt && delays) {
      setTargetTime(scheduledAt + delays.afterScheduleDelay);
    }
  }, [
    proposalStatus,
    submittedAt,
    delays,
    scheduledAt,
    visibleState,
    dgConfig?.vetoSignallingDeactivationMaxDuration,
    detailedState?.persistedStateEnteredAt,
  ]);

  if (!delays || !proposalStatus) {
    return null;
  }

  /**
   * Every unscheduled proposal in these states is blocked: BlockedVetoSignalling, BlockedDeactivation, BlockedRageQuit;
   * A proposal is ready to schedule as soon as it's countdown is finished
   */

  if (proposalStatus === ProposalStatus.Submitted) {
    if (
      visibleState === VisibleGovernanceState.BlockedVetoSignalling ||
      visibleState === VisibleGovernanceState.BlockedDeactivation ||
      visibleState === VisibleGovernanceState.BlockedRageQuit
    ) {
      const badge = {
        text: statusText.blocked,
        variant: 'danger' as BadgeVariant,
      };
      let info = null;

      switch (visibleState) {
        case VisibleGovernanceState.BlockedVetoSignalling:
          info = (
            <Text color="primary">
              Executable if: stETH&nbsp;&nbsp;support&nbsp;&lt;&nbsp;
              {firstSealRageQuitSupport}%
            </Text>
          );
          break;
        case VisibleGovernanceState.BlockedDeactivation:
          if (submittedAt && !isCountdownFinished) {
            info = (
              <Text color="primary">Executable in: {targetCountdown}</Text>
            );
          }
          break;
        case VisibleGovernanceState.BlockedRageQuit:
          info = (
            <Text color="primary">
              Executable if: stETH&nbsp;veto&nbsp;support&nbsp;&lt;&nbsp;
              {firstSealRageQuitSupport}%, RageQuit finished
            </Text>
          );
      }
      return {
        badge: badge,
        info,
      };
    }

    if (isCountdownFinished) {
      return {
        badge: {
          text: statusText.readyToSchedule,
          variant: 'warning',
        },
        info: null,
      };
    } else {
      return {
        badge: {
          text: statusText.pending,
          variant: 'warning',
        },
        info: (
          <Text color="primary">
            {statusText.vetoPossible}{' '}
            <Text as="span">
              <b>{targetCountdown}</b>
            </Text>
          </Text>
        ),
      };
    }
  }

  /**
   * Scheduled proposals can be executed regardless of the Governance status after the 'afterScheduleDelay'
   */

  // TODO: add badge id for conditional rendering
  if (proposalStatus === ProposalStatus.Scheduled) {
    if (isEmergencyModeActive && isCountdownFinished) {
      return {
        badge: {
          text: statusText.blocked,
          variant: 'danger',
        },
        info: (
          <Text color="primary">
            Only Emergency committee can execute blocked proposals
          </Text>
        ),
      };
    }
    return {
      badge: {
        text: isCountdownFinished
          ? statusText.readyToExecute
          : statusText.executionScheduled,
        variant: isCountdownFinished ? 'success' : 'warning',
      },
      info: isCountdownFinished ? null : visibleState ===
        VisibleGovernanceState.BlockedDeactivation ? (
        <Text>Executable in {deactivationTimeFormatted}</Text>
      ) : (
        <Text color="primary">
          {emergencyCommitteeLinkText}{' '}
          <Text as="span">
            <b>{targetCountdown}</b>
          </Text>
        </Text>
      ),
    };
  }

  if (proposalStatus === ProposalStatus.Cancelled) {
    return {
      badge: {
        text: statusText.cancelled,
        variant: 'default',
      },
      info: null,
    };
  }

  if (proposalStatus === ProposalStatus.Executed) {
    return {
      badge: {
        text: statusText.executed,
        variant: 'success',
      },
      info: null,
    };
  }

  return null;
};

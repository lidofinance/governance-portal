import { StatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';
import {
  DescriptionText,
  ProposalDescription,
  ProposalListItemWrapper,
  StatusBadgeWrapper,
  SummarySection,
  TimeLockDescription,
  TimelockWrapper,
  UnknownContract,
} from './style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import { ProposalCombinedData } from 'features/dual-governance/proposals/types';
import { ProposalTimelock } from 'features/dual-governance/proposals/shared-components/proposal-timelock';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useDualGovernanceConfig } from 'features/dual-governance/hooks/use-dual-governance-config';
import { useCountdown } from 'shared/hooks/use-countdown';
import * as contractAddresses from 'shared/blockchain/contract-addresses';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useLidoSDK } from 'providers/lido-sdk';
import { WarningIconTransparent } from 'shared/components/icons';

type Props = {
  id: number;
  description: string;
  calls: any[];
  proposalDetails: ProposalCombinedData['proposalDetails'];
};

export const ProposalsListItem = ({
  id,
  description,
  proposalDetails,
  calls,
}: Props) => {
  const { chainId } = useLidoSDK();

  const { data: dgConfig } = useDualGovernanceConfig();
  const { visibleState, detailedState, firstSealRageQuitSupport } =
    useDualGovernanceContext();
  const vetoSignallingDeactivationMaxDuration =
    dgConfig?.vetoSignallingDeactivationMaxDuration;

  const deactivationTargetTimestamp =
    detailedState?.persistedStateEnteredAt &&
    vetoSignallingDeactivationMaxDuration
      ? detailedState.persistedStateEnteredAt +
        vetoSignallingDeactivationMaxDuration
      : 0;

  const { timeFormatted: deactivationTimeFormatted } = useCountdown(
    deactivationTargetTimestamp,
  );

  const { status, scheduledAt, submittedAt } = proposalDetails;
  const descriptionLines = description.split('\n');

  const isUnknownContractCalled = calls.some((call) => {
    return !Object.values(contractAddresses).some(
      (contract) =>
        contract[chainId as CHAINS]?.toLowerCase() ===
        call.target.toLowerCase(),
    );
  });

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <ProposalName
          id={id}
          isUnknownContractCalled={isUnknownContractCalled}
        />
        <StatusBadgeWrapper>
          <StatusBadge
            proposalStatus={status}
            submittedAt={submittedAt}
            scheduledAt={scheduledAt}
          />
        </StatusBadgeWrapper>
        <TimelockWrapper>
          <ProposalTimelock
            proposalStatus={status}
            submittedAt={submittedAt}
            scheduledAt={scheduledAt}
            hideOnCountdownFinish
          />
          {visibleState === VisibleGovernanceState.BlockedVetoSignalling && (
            <TimeLockDescription>
              <span>Executable if:</span>
              <br />
              <span>{`stETH veto support < ${firstSealRageQuitSupport}%`}</span>
            </TimeLockDescription>
          )}
          {visibleState === VisibleGovernanceState.BlockedRageQuit && (
            <TimeLockDescription>
              <span>Executable if:</span>
              <br />
              <span>{`stETH veto support < ${firstSealRageQuitSupport}%`}</span>
              <br />
              <span>RageQuit finished</span>
            </TimeLockDescription>
          )}
          {visibleState === VisibleGovernanceState.BlockedDeactivation && (
            <TimeLockDescription>
              <span>Executable in {deactivationTimeFormatted}</span>
            </TimeLockDescription>
          )}
        </TimelockWrapper>
      </SummarySection>
      <ProposalDescription>
        {descriptionLines.map((line, index) => (
          <DescriptionText key={index}>{line}</DescriptionText>
        ))}
        {isUnknownContractCalled && (
          <UnknownContract>
            <WarningIconTransparent />
            <span>Unknown Сontract Сalled</span>
          </UnknownContract>
        )}
      </ProposalDescription>
    </ProposalListItemWrapper>
  );
};

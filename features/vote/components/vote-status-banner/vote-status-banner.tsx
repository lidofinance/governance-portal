import { useMemo } from 'react';
import {
  BadgeFailed,
  BadgeNoQuorum,
  BadgeOngoing,
  BadgePassed,
  BannerText,
  InfoText,
  Wrap,
} from './style';
import { VoteDetailsCountdown } from '../vote-details-countdown';
import { convertStatusToStyledVariant, VoteStatusFontSize } from './types';
// TODO: move to shared
import { ProposalStatus } from 'features/dual-governance/proposals/types';
import { VoteStatus } from 'shared/votes/types';

import { VaultIcon } from 'shared/components/icons';
import { FormattedDate } from '../formatted-date';
import { Check, Close } from '@lidofinance/lido-ui';

type Props = {
  executedAt: number | undefined;
  voteTime: number;
  objectionPhaseTime: number;
  isEnded: boolean;
  fontSize: VoteStatusFontSize;
  status: VoteStatus;
  yeaNum: number;
  nayNum: number;
  totalSupply: number;
  minAcceptQuorum: number;
  voteDualGovernanceStatus: ProposalStatus | null;
};

export const VoteStatusBanner = ({
  executedAt,
  voteTime,
  objectionPhaseTime,
  isEnded,
  fontSize,
  status,
  yeaNum,
  nayNum,
  totalSupply,
  minAcceptQuorum,
  voteDualGovernanceStatus,
}: Props) => {
  const variant = convertStatusToStyledVariant(status);

  const quorumIsReached = useMemo(() => {
    if (totalSupply === 0) {
      return false;
    }

    const yeaQuorum = yeaNum / totalSupply;
    const nayQuorum = nayNum / totalSupply;

    return yeaQuorum > minAcceptQuorum || nayQuorum > minAcceptQuorum;
  }, [totalSupply, yeaNum, nayNum, minAcceptQuorum]);

  const endDateEl = executedAt ? (
    <InfoText variant={variant}>
      <FormattedDate date={executedAt} format="DD MMM YYYY" />
    </InfoText>
  ) : null;

  return (
    <Wrap data-testid="voteCardHeader" fontSize={fontSize} variant={variant}>
      {status === VoteStatus.ActiveMain && (
        <>
          <BadgeOngoing>1</BadgeOngoing>
          <BannerText variant={variant}>Main phase ends in</BannerText>
          <InfoText variant={variant}>
            <VoteDetailsCountdown
              voteTime={voteTime - objectionPhaseTime}
              isEndedBeforeTime={isEnded}
            />
          </InfoText>
        </>
      )}

      {status === VoteStatus.ActiveObjection && (
        <>
          <BadgeOngoing>2</BadgeOngoing>
          <BannerText variant={variant}>Objection phase ends in</BannerText>
          <InfoText variant={variant}>
            <VoteDetailsCountdown
              voteTime={voteTime}
              isEndedBeforeTime={isEnded}
            />
          </InfoText>
        </>
      )}

      {status === VoteStatus.Pending && (
        <>
          <BadgePassed>
            <Check />
          </BadgePassed>
          <BannerText variant={variant}>Passed (pending)</BannerText>
        </>
      )}

      {status === VoteStatus.Passed && (
        <>
          <BadgePassed>
            <Check />
          </BadgePassed>
          <BannerText variant={variant}>Passed</BannerText>
          {endDateEl}
        </>
      )}

      {status === VoteStatus.Executed && (
        <>
          {voteDualGovernanceStatus === ProposalStatus.Cancelled && (
            <>
              <BadgeFailed>
                <VaultIcon />
              </BadgeFailed>
              <BannerText variant={variant}>
                Cancelled in Dual Governance
              </BannerText>
            </>
          )}
          {voteDualGovernanceStatus &&
            voteDualGovernanceStatus !== ProposalStatus.Cancelled &&
            voteDualGovernanceStatus !== ProposalStatus.Executed && (
              <>
                <BadgeNoQuorum>
                  <VaultIcon />
                </BadgeNoQuorum>
                <BannerText variant={variant}>
                  In Dual Governance review
                </BannerText>
              </>
            )}
          {(voteDualGovernanceStatus === ProposalStatus.Executed ||
            voteDualGovernanceStatus === null) && (
            <>
              <BadgePassed>
                <Check />
              </BadgePassed>
              <BannerText variant={variant}>Passed (enacted)</BannerText>
            </>
          )}
          {endDateEl}
        </>
      )}

      {status === VoteStatus.Rejected && quorumIsReached && (
        <>
          <BadgeFailed>
            <Close />
          </BadgeFailed>
          <BannerText variant={variant}>Rejected</BannerText>
        </>
      )}

      {status === VoteStatus.Rejected && !quorumIsReached && (
        <>
          <BadgeNoQuorum>
            <Close />
          </BadgeNoQuorum>
          <BannerText variant={variant}>No quorum</BannerText>
        </>
      )}
    </Wrap>
  );
};

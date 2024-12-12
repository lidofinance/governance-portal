import Link from 'next/link';
import { Button } from 'shared/components/button';
import { Text } from 'shared/components/text';

import {
  ControlPanelWrapper,
  PreviewControls,
  PreviewProposalList,
  Description,
  ProposalWrapper,
  VoteWrapper,
  InlineLoaderStyled,
} from './style';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from 'shared/wallet';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';
import { isVoteItem } from '../types';
import { ProposalsIcon, AragonLogo } from 'shared/components/icons';
import { ProposalCombinedData } from '../proposals/types';
import { useProposalTimelock } from '../hooks/use-proposal-timelock';
import { VoteData } from 'shared/votes/types';
import { config } from 'config';
import { PROPOSALS_PATH } from 'constants/urls';
import { getDateFromTimestamp } from 'utils/get-date-from-timestamp';

const PROPOSALS_TO_SHOW = 3;

type Props = {
  onContinue: () => void;
};

const ActiveProposal = ({
  proposal,
}: {
  proposal: ProposalCombinedData | VoteData;
}) => {
  const isVote = isVoteItem(proposal);

  if (isVote) {
    return (
      <VoteWrapper>
        <AragonLogo />
        <Text size={22}>
          <Link href={`${config.voteOrigin}/vote/${proposal.id}`}>
            {`LDO Vote #${proposal.id} `}
          </Link>
          &mdash; Not submitted to Dual Governance yet
        </Text>
      </VoteWrapper>
    );
  }

  const { status, submittedAt, scheduledAt } = proposal.proposalDetails;

  const timelockData = useProposalTimelock({
    proposalStatus: status,
    submittedAt,
    scheduledAt,
  });

  const targetTime = timelockData?.targetTime;
  let dateString;

  if (targetTime) {
    const dateObj = getDateFromTimestamp({ timestamp: targetTime });

    dateString = (
      <span>
        <b>{dateObj.date}</b> {dateObj.tz}
      </span>
    );
  }

  return (
    <ProposalWrapper>
      <ProposalsIcon />
      <Text size={22}>
        <Link href={`${PROPOSALS_PATH}/${proposal.id}`}>
          {`Proposal #${proposal.id} `}
        </Link>
        &mdash;
        {dateString && (
          <span>
            <span> Veto possible until </span>
            {dateString}
          </span>
        )}
      </Text>
    </ProposalWrapper>
  );
};

export const DualGovernanceControlPanelPreview = ({ onContinue }: Props) => {
  const { isConnected } = useAccount();
  const { votes, activeProposals, isLoading } =
    useDualGovernanceProposalsContext();
  const votesProposalsList = [...votes, ...activeProposals];

  const restProposalsAmount = votesProposalsList.length - PROPOSALS_TO_SHOW;

  return (
    <ControlPanelWrapper>
      <Text size={22} weight={600}>
        Active Proposals:
      </Text>
      {isLoading && <InlineLoaderStyled />}
      {!isLoading && (
        <>
          {votesProposalsList.length && (
            <PreviewProposalList>
              {votesProposalsList
                .map((proposal, index) => (
                  <ActiveProposal key={proposal.id} proposal={proposal} />
                ))
                .slice(0, PROPOSALS_TO_SHOW)}
              {restProposalsAmount > 0 && (
                <Text>And {restProposalsAmount} more</Text>
              )}
            </PreviewProposalList>
          )}
          {!votesProposalsList.length && (
            <>
              <br />
              <Text>No active proposals</Text>
            </>
          )}
        </>
      )}
      <Description>
        Support Veto with your stETH to help block all proposals execution
        temporarily (VetoSignaling) or withdraw your stETH before execution
        (RageQuit).
      </Description>
      <PreviewControls>
        {isConnected ? (
          <Button size="lg" onClick={onContinue}>
            Go to Veto Support
          </Button>
        ) : (
          <ConnectWalletButton size="lg">Connect wallet</ConnectWalletButton>
        )}
      </PreviewControls>
    </ControlPanelWrapper>
  );
};

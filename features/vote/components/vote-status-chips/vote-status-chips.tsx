import { Chip } from 'shared/components/chip';
import { VoteStatusWrap } from './style';
import { InfoIcon } from 'shared/components/icons/index';
import { VotePhase, VoteStatus } from 'shared/votes/types';
import { ProposalStatus } from 'features/dual-governance/proposals/types';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { VotePhasesTooltip } from '../vote-phases-tooltip';
import { Link, Tooltip } from '@lidofinance/lido-ui';
import { LinkWrap, TooltipText } from '../vote-phases-tooltip/style';
import { ExternalLinkIcon } from 'shared/components/icons/index';
import { VoteQuorumStatusTooltip } from '../vote-quorum-status-tooltip';
import { PROPOSALS_PATH } from 'constants/urls';

interface Props {
  totalSupply: number;
  minAcceptQuorum: number;
  yeaNum: number;
  nayNum: number;
  status: VoteStatus;
  executedTxHash?: string | null;
  votePhase: VotePhase | undefined;
  voteDualGovernanceStatus: ProposalStatus | null;
  proposalId: number | null;
  chainId: CHAINS;
  isQuorumReached: boolean;
}

const getWinningOption = (yeaNum: number, nayNum: number): 'Yes' | 'No' => {
  return yeaNum > nayNum ? 'Yes' : 'No';
};

export const VoteStatusChips = ({
  totalSupply,
  minAcceptQuorum,
  yeaNum,
  nayNum,
  status,
  executedTxHash,
  votePhase,
  voteDualGovernanceStatus,
  proposalId,
  isQuorumReached,
}: Props) => {
  const minQuorumSupply = totalSupply * minAcceptQuorum;

  let winningOptionChip = null;
  if (yeaNum > 0 || nayNum > 0) {
    const winningOption = getWinningOption(yeaNum, nayNum);
    const winningVariant = winningOption === 'Yes' ? 'success' : 'danger';

    winningOptionChip = (
      <Chip variant={winningVariant}>Winning: {winningOption}</Chip>
    );
  }
  let statusChip = null;

  switch (status) {
    case VoteStatus.Passed:
      statusChip = <Chip variant="success">Passed</Chip>;
      break;
    case VoteStatus.Pending:
      statusChip = <Chip variant="success">Passed (pending)</Chip>;
      break;
    case VoteStatus.Rejected:
      if (isQuorumReached) {
        statusChip = <Chip variant="danger">Rejected</Chip>;
      }
      break;
    case VoteStatus.Executed:
      if (
        voteDualGovernanceStatus === null ||
        voteDualGovernanceStatus === ProposalStatus.Executed
      ) {
        statusChip = (
          <VotePhasesTooltip
            placement="bottomLeft"
            executedTxHash={executedTxHash}
            votePhase={votePhase}
          >
            <Chip variant="success">Passed (enacted)</Chip>
          </VotePhasesTooltip>
        );
        break;
      }

      if (voteDualGovernanceStatus === ProposalStatus.Cancelled) {
        statusChip = (
          <Tooltip
            title={
              <TooltipText>
                <LinkWrap>
                  See on Dual Governance:
                  <Link href={`${PROPOSALS_PATH}/${proposalId}`}>
                    <ExternalLinkIcon />
                  </Link>
                </LinkWrap>
              </TooltipText>
            }
          >
            <div>
              <Chip variant="warning">Cancelled in Dual Governance</Chip>
            </div>
          </Tooltip>
        );
        break;
      }

      statusChip = (
        <Tooltip
          title={
            <TooltipText>
              <LinkWrap>
                See on Dual Governance
                <Link href={`${PROPOSALS_PATH}/${proposalId}`}>
                  <ExternalLinkIcon />
                </Link>
              </LinkWrap>
            </TooltipText>
          }
        >
          <div>
            <Chip variant="warning">In Dual Governance review</Chip>
          </div>
        </Tooltip>
      );
      break;
    default:
      statusChip = null;
  }

  return (
    <VoteStatusWrap data-testid="voteStatus">
      {votePhase === VotePhase.Closed && statusChip}

      {votePhase !== VotePhase.Closed && winningOptionChip}
      <VoteQuorumStatusTooltip
        minQuorumSupply={minQuorumSupply}
        totalSupply={totalSupply}
        placement="bottomLeft"
      >
        {votePhase === VotePhase.Closed ? (
          !isQuorumReached && (
            <Chip variant="warning">
              No quorum <InfoIcon />
            </Chip>
          )
        ) : isQuorumReached ? (
          <Chip variant="success">
            Quorum reached <InfoIcon />
          </Chip>
        ) : (
          <Chip variant="warning">
            No quorum <InfoIcon />
          </Chip>
        )}
      </VoteQuorumStatusTooltip>
    </VoteStatusWrap>
  );
};

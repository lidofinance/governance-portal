import {
  DescriptionWrap,
  DetailsBoxWrap,
  EnactButtonWrap,
  Layout,
  MainCard,
  MobileCTASlot,
  MobileSidebarSlot,
  NoticeWrap,
  PowerRow,
  SectionHeading,
  SideCard,
  SidebarSection,
  VoteActionsWrap,
  VotedPill,
  VoteTitle,
  YourVoteHeading,
} from './style';
import { Button } from '@lidofinance/lido-ui';
import { Button as DgButton } from 'shared/components/button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { splitVoteDescription } from '@vote/utils/split-vote-description';
import { VoteDescription } from '../vote-description';
import { VoteNotice } from '../vote-notice';
import { VotersList } from '../voters-list';
import { VoteScript } from '../vote-script/vote-script';
import { useAccount } from 'wagmi';
import { VotePhase, VoteStatus } from 'shared/votes/types';
import { useConnect } from 'reef-knot/core-react';
import { VoteInfo } from '../vote-info';
import { VoteActions } from '../vote-actions';
import { useVoteContext } from '@vote/providers/vote-context';
import { VoteProgressBar } from '../vote-progress-bar';
import { VoteQuorumPanel } from '../vote-quorum-panel';
import { VoteDetailsList } from '../vote-details-list';
import { VoteMetaBar } from '../vote-meta-bar';
import { VoteVetoSupport } from '../vote-veto-support';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useEnactVoteAction } from '@vote/write-actions/enact-vote/action';
import { useVoteAction } from '@vote/write-actions/vote/action';
import { ProposalStatus } from '@dg/proposals/types';
import { PROPOSALS_PATH } from 'constants/urls';
import { formatBalance } from 'utils/format-balance';
import { KnownToken } from 'shared/blockchain/tokens';
import { SkeletonBar } from 'shared/components/skeleton-bar';

export const VoteCard = () => {
  const {
    vote,
    canExecute,
    eventStart,
    voteTime,
    objectionPhaseTime,
    description,
    dgProposal,
    voteEvents,
    voterDaoTokenBalance,
  } = useVoteContext();

  const isSupportedChain = useIsSupportedChain();

  const { isConnected: isWalletConnected, address: walletAddress } =
    useAccount();

  const { connect } = useConnect();

  const router = useRouter();

  const processEnact = useEnactVoteAction();
  const processVote = useVoteAction();

  const [isChangeMode, setIsChangeMode] = useState(false);

  const userOwnVote = useMemo(() => {
    if (!walletAddress || voteEvents.length === 0) {
      return null;
    }
    const lower = walletAddress.toLowerCase();
    return (
      voteEvents.find((event) => event.voter.toLowerCase() === lower) ?? null
    );
  }, [walletAddress, voteEvents]);

  const hasDelegateVote = useMemo(() => {
    if (!walletAddress || voteEvents.length === 0) {
      return false;
    }
    const lower = walletAddress.toLowerCase();
    return voteEvents.some((event) =>
      event.delegatedVotes?.some(
        (delegatedVote) => delegatedVote.voter.toLowerCase() === lower,
      ),
    );
  }, [walletAddress, voteEvents]);

  useEffect(() => {
    setIsChangeMode(false);
  }, [userOwnVote?.supports]);

  const openConnectWalletModal = useCallback(async () => {
    await connect();
  }, [connect]);

  const isEnded =
    vote.state.status === VoteStatus.Rejected ||
    vote.state.status === VoteStatus.Executed;

  const isDualGovernancePhase =
    !!dgProposal &&
    (dgProposal.proposalStatus === ProposalStatus.Submitted ||
      dgProposal.proposalStatus === ProposalStatus.Scheduled);

  const { title, body } = splitVoteDescription({
    description,
    metadata: eventStart?.args.metadata,
    truncateTitle: false,
  });

  const hasBody = body !== null || !description?.trim();

  const sidebarItems = (
    <>
      <SidebarSection>
        <VoteQuorumPanel vote={vote} />
      </SidebarSection>
      {!isEnded && (
        <SidebarSection>
          <VoteProgressBar
            startDate={Number(vote.startDate)}
            voteTime={voteTime}
            objectionPhaseTime={objectionPhaseTime}
            isEnded={isEnded}
            votePhase={vote.phase}
          />
        </SidebarSection>
      )}
      <SidebarSection>
        <VoteDetailsList />
      </SidebarSection>
      {isDualGovernancePhase && dgProposal && (
        <>
          <SidebarSection>
            <VoteVetoSupport />
          </SidebarSection>
          <SidebarSection>
            <DgButton
              fullwidth
              size="sm"
              onClick={() =>
                router.push(`${PROPOSALS_PATH}/${dgProposal.proposalId}`)
              }
            >
              See on Dual Governance
            </DgButton>
          </SidebarSection>
        </>
      )}
    </>
  );

  const isClosed = vote.phase === VotePhase.Closed;
  const hasOwnVote = !!userOwnVote;
  const hasVotingPower =
    voterDaoTokenBalance !== undefined && voterDaoTokenBalance > 0n;
  const showYourVoteSection =
    hasOwnVote || hasDelegateVote || (!isClosed && hasVotingPower);
  const showVoteButtons = !isClosed && (!hasOwnVote || isChangeMode);

  const ctaItems = isDualGovernancePhase ? null : (
    <>
      {!isWalletConnected && !isClosed && (
        <Button fullwidth onClick={openConnectWalletModal}>
          Connect wallet
        </Button>
      )}
      {isWalletConnected && (
        <>
          {showYourVoteSection && (
            <>
              <YourVoteHeading>
                Your vote
                {hasOwnVote && (
                  <VotedPill $supports={userOwnVote.supports}>
                    {userOwnVote.supports ? '“Yes”' : '“No”'}
                  </VotedPill>
                )}
              </YourVoteHeading>
              {!hasOwnVote && <VoteInfo walletAddress={walletAddress} />}
              {!isClosed && (
                <PowerRow>
                  <span>My voting power</span>
                  <span>
                    {voterDaoTokenBalance === undefined ? (
                      <SkeletonBar width={60} />
                    ) : (
                      `${formatBalance(voterDaoTokenBalance)} ${KnownToken.LDO.symbol}`
                    )}
                  </span>
                </PowerRow>
              )}
              {showVoteButtons && (
                <NoticeWrap>
                  <VoteNotice />
                </NoticeWrap>
              )}
            </>
          )}
          <VoteActionsWrap $hidden={!showVoteButtons}>
            <VoteActions processVote={processVote} />
          </VoteActionsWrap>
          {hasOwnVote && !isChangeMode && !isClosed && (
            <VoteActionsWrap>
              <DgButton
                fullwidth
                size="sm"
                variant="outlined"
                onClick={() => setIsChangeMode(true)}
              >
                Change your vote
              </DgButton>
            </VoteActionsWrap>
          )}
          {canExecute && (
            <EnactButtonWrap>
              <Button
                fullwidth
                color="success"
                onClick={processEnact}
                disabled={!isSupportedChain}
              >
                Enact
              </Button>
            </EnactButtonWrap>
          )}
        </>
      )}
    </>
  );

  return (
    <Layout key={vote.id} data-testid="voteCard">
      <MainCard>
        <VoteMetaBar
          voteId={vote.id}
          status={vote.state.status}
          isQuorumReached={vote.state.isQuorumReached}
          voteTime={voteTime}
          objectionPhaseTime={objectionPhaseTime}
          startDate={Number(vote.startDate)}
          isEnded={isEnded}
          dualGovernancePhase={isDualGovernancePhase}
          withLabels
        />
        <MobileSidebarSlot>{sidebarItems}</MobileSidebarSlot>
        <SectionHeading>Proposal description</SectionHeading>
        {title && <VoteTitle data-testid="voteTitle">{title}</VoteTitle>}
        {hasBody && (
          <DescriptionWrap data-testid="voteDescription">
            <VoteDescription
              metadata={eventStart?.args.metadata}
              description={body}
              allowMD
            />
          </DescriptionWrap>
        )}
        <DetailsBoxWrap data-testid="voteScript">
          <VoteScript
            voteId={vote.id}
            script={vote.script}
            metadata={eventStart?.args.metadata || ''}
          />
        </DetailsBoxWrap>
        {ctaItems && <MobileCTASlot>{ctaItems}</MobileCTASlot>}
        <VotersList walletAddress={walletAddress} />
      </MainCard>
      <SideCard>
        {sidebarItems}
        {ctaItems && <SidebarSection>{ctaItems}</SidebarSection>}
      </SideCard>
    </Layout>
  );
};

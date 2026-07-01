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
  SeeOnDgWrap,
  SideCard,
  SidebarSection,
  VoteActionsWrap,
  VotedPill,
  VoteTitle,
  YourVoteHeading,
} from './style';
import { Button } from '@lidofinance/lido-ui';
import { Button as DgButton } from 'shared/components/button';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useVoteTitle } from '@vote/hooks/use-vote-title';
import { VoteDescription } from '../vote-description';
import { VoteNotice } from '../vote-notice';
import { VotersList } from '../voters-list';
import { VoteScript } from '../vote-script/vote-script';
import { useAccount } from 'wagmi';
import { VotePhase, VoteStatus } from 'shared/votes/types';
import { ConnectWalletButton } from 'shared/wallet';
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
import { ProposalStatus } from 'shared/types';
import { PROPOSALS_PATH } from 'constants/urls';
import { formatBalance } from 'utils/format-balance';
import { KnownToken } from 'shared/blockchain/tokens';
import { SkeletonBar } from 'shared/components/skeleton-bar';

export const VoteCard = () => {
  const {
    vote,
    eventStart,
    voteTime,
    objectionPhaseTime,
    description,
    dgProposal,
    voteEvents,
    voterDaoTokenBalance,
    totalDelegatedVotingPower,
    isDgProposalLoading,
  } = useVoteContext();

  const isSupportedChain = useIsSupportedChain();

  const { isConnected: isWalletConnected, address: walletAddress } =
    useAccount();

  const router = useRouter();

  const processEnact = useEnactVoteAction();
  const processVote = useVoteAction();

  const [isChangeMode, setIsChangeMode] = useState(false);

  const userOwnVote = useMemo(() => {
    if (!walletAddress || voteEvents.length === 0) {
      return null;
    }
    return (
      voteEvents.find(
        (event) => event.voter.toLowerCase() === walletAddress.toLowerCase(),
      ) ?? null
    );
  }, [walletAddress, voteEvents]);

  useEffect(() => {
    setIsChangeMode(false);
  }, [userOwnVote?.supports]);

  const isEnded =
    vote.state.status === VoteStatus.Rejected ||
    vote.state.status === VoteStatus.Executed;
  const isClosed = vote.phase === VotePhase.Closed;

  const isDualGovernancePhase =
    !!dgProposal &&
    (dgProposal.proposalStatus === ProposalStatus.Submitted ||
      dgProposal.proposalStatus === ProposalStatus.Scheduled);

  const { title, body } = useVoteTitle({
    description,
    metadata: eventStart?.args.metadata,
    truncateTitle: false,
    isActive: !isEnded,
  });

  const hasBody = body !== null || !description?.trim();

  const sidebarItems = (
    <>
      <SidebarSection>
        <VoteQuorumPanel vote={vote} />
      </SidebarSection>
      {!isClosed && (
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
        <SidebarSection>
          <VoteVetoSupport />
        </SidebarSection>
      )}
    </>
  );

  const hasOwnVote = !!userOwnVote;
  const hasDelegatedPower = totalDelegatedVotingPower > 0n;
  const showVoteButtons = !isClosed && (!hasOwnVote || isChangeMode);
  const isPending = vote.state.status === VoteStatus.Pending;
  const showConnectButton = !isWalletConnected && (!isClosed || isPending);
  const hasCta =
    showConnectButton ||
    isWalletConnected ||
    (isDualGovernancePhase && !!dgProposal);

  const yourVoteResult = (
    <>
      <YourVoteHeading>
        Your vote
        {hasOwnVote && (
          <VotedPill
                    $supports={userOwnVote.supports}
                    data-testid="yourVoteValue"
                  >
            {userOwnVote.supports ? '“Yes”' : '“No”'}
          </VotedPill>
        )}
      </YourVoteHeading>
      {!hasOwnVote && <VoteInfo walletAddress={walletAddress} />}
    </>
  );

  const ctaItems = (
    <>
      {showConnectButton && (
        <ConnectWalletButton fullwidth>Connect wallet</ConnectWalletButton>
      )}
      {isWalletConnected && (
        <>
          {yourVoteResult}
          {!isDualGovernancePhase && (
            <>
              {!isClosed && (
                <PowerRow>
                  <span>My voting power</span>
                  <span data-testid="myOwnVP">
                    {voterDaoTokenBalance === undefined ? (
                      <SkeletonBar width={60} />
                    ) : (
                      `${formatBalance(voterDaoTokenBalance)} ${KnownToken.LDO.symbol}`
                    )}
                  </span>
                </PowerRow>
              )}
              {!isClosed && hasDelegatedPower && (
                <PowerRow>
                  <span>Total delegated voting power</span>
                  <span data-testid="totalDelegatedVP">
                    {`${formatBalance(totalDelegatedVotingPower)} ${KnownToken.LDO.symbol}`}
                  </span>
                </PowerRow>
              )}
              {showVoteButtons && (
                <NoticeWrap>
                  <VoteNotice />
                </NoticeWrap>
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
              {isPending && (
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
      )}
      {isDualGovernancePhase && dgProposal && (
        <SeeOnDgWrap>
          <DgButton
            fullwidth
            size="sm"
            onClick={() =>
              router.push(`${PROPOSALS_PATH}/${dgProposal.proposalId}`)
            }
          >
            See on Dual Governance
          </DgButton>
        </SeeOnDgWrap>
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
          isDgProposalLoading={isDgProposalLoading}
          withLabels
        />
        <MobileSidebarSlot>{sidebarItems}</MobileSidebarSlot>
        <SectionHeading>Proposal description</SectionHeading>
        {title && <VoteTitle data-testid="voteTitle">{title}</VoteTitle>}
        {hasBody && (
          <DescriptionWrap data-testid="voteDescription">
            <VoteDescription
              metadata={eventStart?.args.metadata}
              description={description}
              allowMD
              hideLeadingHeading
              isActive={!isEnded}
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
        {hasCta && <MobileCTASlot>{ctaItems}</MobileCTASlot>}
        <VotersList walletAddress={walletAddress} />
      </MainCard>
      <SideCard>
        {sidebarItems}
        {hasCta && <SidebarSection>{ctaItems}</SidebarSection>}
      </SideCard>
    </Layout>
  );
};

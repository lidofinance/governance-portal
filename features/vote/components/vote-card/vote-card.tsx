import {
  DescriptionWrap,
  DetailsBoxWrap,
  EnactButtonWrap,
  Layout,
  MainCard,
  MobileCTASlot,
  MobileSidebarSlot,
  SectionHeading,
  SideCard,
  SidebarSection,
  VoteTitle,
} from './style';
import { Button } from '@lidofinance/lido-ui';
import { Button as DgButton } from 'shared/components/button';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { splitVoteDescription } from '@vote/utils/split-vote-description';
import { VoteDescription } from '../vote-description';
import { VotersList } from '../voters-list';
import { VoteScript } from '../vote-script/vote-script';
import { useAccount } from 'wagmi';
import { VotePhase, VoteStatus } from 'shared/votes/types';
import { useConnect } from 'reef-knot/core-react';
import { VoteInfo } from '../vote-info';
import { VotePowerInfo } from '../vote-power-info';
import { VoteActions } from '../vote-actions';
import { useVoteContext } from '@vote/providers/vote-context';
import { VoteProgressBar } from '../vote-progress-bar';
import { VoteQuorumPanel } from '../vote-quorum-panel';
import { VoteDetailsList } from '../vote-details-list';
import { VoteMetaBar } from '../vote-meta-bar';
import { VoteVetoSupport } from '../vote-veto-support';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useEnactVoteAction } from '@vote/write-actions/enact-vote/action';
import { ProposalStatus } from '@dg/proposals/types';
import { PROPOSALS_PATH } from 'constants/urls';

export const VoteCard = () => {
  const {
    vote,
    canExecute,
    eventStart,
    voteTime,
    objectionPhaseTime,
    description,
    dgProposal,
  } = useVoteContext();

  const isSupportedChain = useIsSupportedChain();

  const { isConnected: isWalletConnected, address: walletAddress } =
    useAccount();

  const { connect } = useConnect();

  const router = useRouter();

  const processEnact = useEnactVoteAction();

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

  const ctaItems = isDualGovernancePhase ? null : (
    <>
      {!isWalletConnected && vote.phase !== VotePhase.Closed && (
        <Button fullwidth onClick={openConnectWalletModal}>
          Connect wallet
        </Button>
      )}
      {isWalletConnected && (
        <>
          {vote.phase !== VotePhase.Closed && <VotePowerInfo />}
          <VoteInfo walletAddress={walletAddress} />
          {vote.phase !== VotePhase.Closed && <VoteActions />}
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

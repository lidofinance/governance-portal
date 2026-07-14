import { useState } from 'react';
import { Block, Textarea } from '@lidofinance/lido-ui';
import { MarkdownWrapper } from '@vote/components/markdown-wrapper';
import { VoteMetaBar } from '@vote/components/vote-meta-bar';
import { VoteStatus } from 'shared/votes/types';
import {
  SectionHeading,
  VoteTitle,
  DescriptionWrap,
} from '@vote/components/vote-card/style';
import {
  VoteDashboardCard,
  VoteSummary,
  VoteTitle as DashboardCardTitle,
  VoteDescriptionWrap as DashboardCardDescription,
} from '@vote/components/dashboard-vote/style';
import {
  formatVoteTitle,
  splitLeadingHeading,
} from '@vote/utils/parse-vote-title';
import {
  PreviewWrap,
  DashboardPreviewBreakout,
  DashboardPreviewContainer,
  DashboardPreviewQuorum,
} from './style';

const PREVIEW_VOTE_ID = 0;
const PREVIEW_START_DATE = 1704067200;
const PREVIEW_VOTE_TIME = 604800;
const PREVIEW_OBJECTION_TIME = 172800;

export const VoteDescriptionPreview = () => {
  const [markdown, setMarkdown] = useState('');
  const { title, body } = splitLeadingHeading(markdown);

  return (
    <PreviewWrap>
      <Textarea
        label="IPFS markdown"
        placeholder={'# Title\n\nDescription in markdown…'}
        value={markdown}
        onChange={(event) => setMarkdown(event.currentTarget.value)}
        style={{ height: 200 }}
      />

      {markdown.trim() && (
        <>
          <Block>
            <SectionHeading>Proposal description</SectionHeading>
            <VoteTitle>{formatVoteTitle(title, false)}</VoteTitle>
            {body && (
              <DescriptionWrap>
                <MarkdownWrapper>{body}</MarkdownWrapper>
              </DescriptionWrap>
            )}
          </Block>

          <DashboardPreviewBreakout>
            <DashboardPreviewContainer>
              <SectionHeading>Dashboard card preview</SectionHeading>
              <VoteDashboardCard>
                <VoteSummary>
                  <VoteMetaBar
                    voteId={PREVIEW_VOTE_ID}
                    status={VoteStatus.Executed}
                    isQuorumReached
                    voteTime={PREVIEW_VOTE_TIME}
                    objectionPhaseTime={PREVIEW_OBJECTION_TIME}
                    startDate={PREVIEW_START_DATE}
                    isEnded
                  />
                  <DashboardCardTitle>
                    {formatVoteTitle(title, true)}
                  </DashboardCardTitle>
                  {body && (
                    <DashboardCardDescription>
                      <MarkdownWrapper>{body}</MarkdownWrapper>
                    </DashboardCardDescription>
                  )}
                </VoteSummary>
                <DashboardPreviewQuorum>Quorum panel</DashboardPreviewQuorum>
              </VoteDashboardCard>
            </DashboardPreviewContainer>
          </DashboardPreviewBreakout>
        </>
      )}
    </PreviewWrap>
  );
};

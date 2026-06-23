import { useState } from 'react';
import { Block, Textarea } from '@lidofinance/lido-ui';
import { MarkdownWrapper } from '@vote/components/markdown-wrapper';
import {
  SectionHeading,
  VoteTitle,
  DescriptionWrap,
} from '@vote/components/vote-card/style';
import {
  formatVoteTitle,
  splitLeadingHeading,
} from '@vote/utils/parse-vote-title';
import { PreviewWrap } from './style';

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
        <Block>
          <SectionHeading>Proposal description</SectionHeading>
          <VoteTitle>{formatVoteTitle(title, false)}</VoteTitle>
          {body && (
            <DescriptionWrap>
              <MarkdownWrapper>{body}</MarkdownWrapper>
            </DescriptionWrap>
          )}
        </Block>
      )}
    </PreviewWrap>
  );
};

import { VoteMarkdown } from 'shared/components/vote-markdown';
import { MarkdownWrap } from './style';

type Props = {
  children: string;
};

export const MarkdownWrapper = ({ children: text }: Props) => (
  <MarkdownWrap>
    <VoteMarkdown asLink>{text}</VoteMarkdown>
  </MarkdownWrap>
);

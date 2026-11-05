import { ErrorBoundary } from 'react-error-boundary';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  replaceAddressAndCIDInMD,
  replaceImagesInMD,
  replaceLinksInMD,
  replaceLinksInMDAsAnchor,
} from 'utils/replace-custom-elements-in-MD';
import { remarkLimitVoteMarkdown } from 'utils/remark-limit-vote-markdown';

type Props = {
  children: string;
  asLink?: boolean;
};

export const VoteMarkdown = ({ children: text, asLink }: Props) => (
  <ErrorBoundary
    fallback={<>Failed to render description.</>}
    resetKeys={[text]}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkLimitVoteMarkdown]}
      components={{
        a: asLink ? replaceLinksInMDAsAnchor : replaceLinksInMD,
        img: replaceImagesInMD,
        code: replaceAddressAndCIDInMD,
      }}
    >
      {text}
    </ReactMarkdown>
  </ErrorBoundary>
);

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  replaceAddressAndCIDInMD,
  replaceImagesInMD,
  replaceLinksInMDAsAnchor,
} from 'utils/replace-custom-elements-in-MD';

import { MarkdownWrap } from './style';

type Props = React.ComponentProps<typeof ReactMarkdown>;

export const MarkdownWrapper = ({ children: text, ...rest }: Props) => {
  return (
    <MarkdownWrap>
      <ErrorBoundary
        fallback={<>Failed to render description.</>}
        resetKeys={[text]}
      >
        <ReactMarkdown
          remarkPlugins={[[remarkGfm, {}]]}
          components={{
            a: replaceLinksInMDAsAnchor,
            img: replaceImagesInMD,
            code: replaceAddressAndCIDInMD,
          }}
          {...rest}
        >
          {text}
        </ReactMarkdown>
      </ErrorBoundary>
    </MarkdownWrap>
  );
};

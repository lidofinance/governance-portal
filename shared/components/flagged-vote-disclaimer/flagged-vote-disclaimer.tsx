import { PropsWithChildren } from 'react';
import { WarningIcon } from 'shared/components/icons';
import { DisclaimerText, DisclaimerTitle, DisclaimerWrap } from './style';

export const FlaggedVoteDisclaimer = ({
  title,
  children,
}: PropsWithChildren<{ title: string }>) => (
  <DisclaimerWrap data-testid="flaggedVoteDisclaimer">
    <WarningIcon />
    <div>
      <DisclaimerTitle>{title}</DisclaimerTitle>
      <DisclaimerText>{children}</DisclaimerText>
    </div>
  </DisclaimerWrap>
);

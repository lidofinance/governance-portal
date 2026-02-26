import { Theme } from '@lidofinance/lido-ui';
import { VoteStatus } from 'shared/votes/types';

export type VoteStatusFontSize = keyof Theme['fontSizesMap'];

export enum StyledStatusVariant {
  Active = 'Active',
  Success = 'Success',
  Reject = 'Reject',
}

export const convertStatusToStyledVariant = (status: VoteStatus) => {
  if (
    status === VoteStatus.ActiveMain ||
    status === VoteStatus.ActiveObjection
  ) {
    return StyledStatusVariant.Active;
  }

  if (
    status === VoteStatus.Pending ||
    status === VoteStatus.Executed ||
    status === VoteStatus.Passed
  ) {
    return StyledStatusVariant.Success;
  }

  return StyledStatusVariant.Reject;
};

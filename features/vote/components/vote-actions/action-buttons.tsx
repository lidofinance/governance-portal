import React from 'react';
import { Tooltip } from '@lidofinance/lido-ui';
import { CheckIcon, CrossIcon } from 'shared/components/icons';
import { VotePhase } from 'shared/votes/types';
import { ActionButtonsStyled, VoteButton } from './style';
import { VoteMode } from '@vote/types';

type Props = {
  onVote: (mode: VoteMode) => void;
  disabled?: boolean;
  votePhase: VotePhase;
  loading: boolean;
  nayRef?: React.Ref<HTMLButtonElement>;
  yayRef?: React.Ref<HTMLButtonElement>;
};

export const ActionButtons = ({
  onVote,
  votePhase,
  disabled,
  nayRef,
  yayRef,
  loading,
}: Props) => {
  const isObjection = votePhase === VotePhase.Objection;

  const yesButton = (
    <VoteButton
      disabled={isObjection || disabled}
      onClick={() => onVote('yay')}
      ref={yayRef}
      loading={loading}
    >
      <CheckIcon /> Yes
    </VoteButton>
  );

  return (
    <ActionButtonsStyled>
      <VoteButton
        onClick={() => onVote('nay')}
        disabled={disabled}
        ref={nayRef}
        loading={loading}
      >
        <CrossIcon /> No
      </VoteButton>

      {isObjection ? (
        <Tooltip
          placement="bottomLeft"
          title='You can only vote "No" in the Objection phase'
        >
          <div style={{ width: '100%' }}>{yesButton}</div>
        </Tooltip>
      ) : (
        yesButton
      )}
    </ActionButtonsStyled>
  );
};

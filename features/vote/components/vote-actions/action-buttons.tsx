import React from 'react';
import { Tooltip } from '@lidofinance/lido-ui';
import { Box } from 'shared/components/box';
import { CheckIcon, CrossIcon } from 'shared/components/icons';
import { VotePhase } from 'shared/votes/types';
import { ActionButtonsStyled, VoteButton } from './style';
import { VoteMode } from '../../types';

type Props = {
  onVote: (mode: VoteMode) => void;
  disabled?: boolean;
  votePhase: VotePhase;
  nayRef?: React.Ref<HTMLButtonElement>;
  yayRef?: React.Ref<HTMLButtonElement>;
};

export const ActionButtons = ({
  onVote,
  votePhase,
  disabled,
  nayRef,
  yayRef,
}: Props) => {
  return (
    <ActionButtonsStyled>
      <VoteButton
        onClick={() => onVote('nay')}
        disabled={disabled}
        ref={nayRef}
      >
        <Box
          display="flex"
          gap={12}
          alignItems="center"
          width="100%"
          justifyContent="flex-start"
        >
          <CrossIcon /> No
        </Box>
      </VoteButton>
      <VoteButton
        disabled={votePhase === VotePhase.Objection || disabled}
        onClick={() => onVote('yay')}
        ref={yayRef}
      >
        <Box
          display="flex"
          alignItems="center"
          width={'100%'}
          justifyContent="flex-start"
        >
          {votePhase === VotePhase.Objection ? (
            <Tooltip
              placement="bottomLeft"
              title="You can only vote “No” in the Objection phase."
            >
              <Box
                display="flex"
                gap={12}
                width={'100%'}
                justifyContent="center"
                alignItems="center"
              >
                <CheckIcon /> Yes
              </Box>
            </Tooltip>
          ) : (
            <Box
              display="flex"
              gap={12}
              width={'100%'}
              justifyContent="flex-start"
              alignItems="center"
            >
              <CheckIcon /> Yes
            </Box>
          )}
        </Box>
      </VoteButton>
    </ActionButtonsStyled>
  );
};

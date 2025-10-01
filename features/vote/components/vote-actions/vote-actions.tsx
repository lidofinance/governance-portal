import { PopupMenu, PopupMenuItem, Tooltip } from '@lidofinance/lido-ui';
import { Actions, VoteButton } from './style';
import { VoteMode, VoteType } from '../../types';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { formatEther } from 'viem';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { VotePhase } from 'shared/votes/types';
import { useDelegators } from '../../hooks/use-delegators';
import { BasicActions } from './basic-actions';
import { Box } from 'shared/components/box';
import { CheckIcon, CrossIcon } from 'shared/components/icons';
import { useVoteContext } from '../../providers/vote-context';
import { useVoteActionsContext } from '../../providers/vote-actions-context';

export const VoteActions = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { voteData } = useVoteContext();

  const { handleDelegatedVote, handleOwnVote, currentMode, setCurrentMode } =
    useVoteActionsContext();

  const nayButtonRef = useRef(null);
  const yayButtonRef = useRef(null);

  const { data: tokenData } = useGovernanceToken();
  const { data: delegatorsData, isLoading: isDelegatorsLoading } =
    useDelegators();

  const canVoteWithOwnPower = useMemo(
    () => !!voteData?.votePowerWei && voteData?.votePowerWei > 0,
    [voteData?.votePowerWei],
  );

  const canVoteWithDelegatedVotePower = useMemo(() => {
    return !isDelegatorsLoading && delegatorsData.totalVotingPower > 0;
  }, [isDelegatorsLoading, delegatorsData.totalVotingPower]);

  const formattedOwnVP = useMemo(
    () => `${formatEther(voteData?.votePowerWei || 0n)} ${tokenData?.symbol}`,
    [tokenData?.symbol, voteData?.votePowerWei],
  );

  const formattedDelegatedVP = useMemo(
    () =>
      `${formatEther(delegatorsData.totalVotingPower || 0n)} ${tokenData?.symbol}`,
    [tokenData?.symbol, delegatorsData.totalVotingPower],
  );

  const handleMenu = (mode: VoteMode) => {
    setCurrentMode(mode);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleVote = useCallback(
    async ({ mode, type }: { mode: VoteMode; type: VoteType }) => {
      if (!voteData) {
        return;
      }
      setIsMenuOpen(false);

      if (type === 'own') {
        await handleOwnVote({ mode });
      }
      if (type === 'delegated') {
        await handleDelegatedVote({
          mode,
        });
      }
    },
    [voteData, handleOwnVote, handleDelegatedVote],
  );

  if (!voteData) {
    return null;
  }

  return (
    <Actions>
      {canVoteWithOwnPower && !canVoteWithDelegatedVotePower && (
        <BasicActions
          votePhase={voteData.phase}
          onVote={(mode: VoteMode) => handleVote({ mode, type: 'own' })}
        />
      )}
      {canVoteWithDelegatedVotePower && !canVoteWithOwnPower && (
        <BasicActions
          votePhase={voteData.phase}
          onVote={(mode: VoteMode) => handleVote({ mode, type: 'delegated' })}
        />
      )}
      {canVoteWithOwnPower && canVoteWithDelegatedVotePower && (
        <>
          <VoteButton onClick={() => handleMenu('nay')} ref={nayButtonRef}>
            <Box
              display="flex"
              gap={12}
              width={'100%'}
              justifyContent="center"
              alignItems="center"
            >
              <CrossIcon /> No
            </Box>
          </VoteButton>
          <VoteButton
            onClick={() => handleMenu('yay')}
            disabled={voteData.phase === VotePhase.Objection}
            ref={yayButtonRef}
          >
            <Box display="flex" alignItems="center">
              {voteData.phase === VotePhase.Objection ? (
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
                  justifyContent="center"
                  alignItems="center"
                >
                  <CheckIcon /> Yes
                </Box>
              )}
            </Box>
          </VoteButton>
        </>
      )}
      <PopupMenu
        anchorRef={currentMode === 'nay' ? nayButtonRef : yayButtonRef}
        onClose={handleMenuClose}
        style={{
          width: 200,
        }}
        variant="default"
        open={isMenuOpen}
      >
        <PopupMenuItem
          data-testid="delegatedVPBtn"
          onClick={() => handleVote({ mode: currentMode, type: 'own' })}
        >
          {`My own (${formattedOwnVP})`}
        </PopupMenuItem>
        <PopupMenuItem
          data-testid="myOwnVPBtn"
          onClick={() => handleVote({ mode: currentMode, type: 'delegated' })}
        >
          {`Delegated (${formattedDelegatedVP})`}
        </PopupMenuItem>
      </PopupMenu>
    </Actions>
  );
};

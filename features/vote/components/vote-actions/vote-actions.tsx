import { PopupMenu, PopupMenuItem, Tooltip } from '@lidofinance/lido-ui';
import { Actions, VoteButton } from './style';
import { VoteMode, VoteType } from '../../types';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { VotePhase } from 'shared/votes/types';
import { useDelegators } from '../../hooks/use-delegators';
import { BasicActions } from './basic-actions';
import { useVoteContext } from 'features/vote/providers/vote-context';
import { useVoteActionsContext } from 'features/vote/providers/vote-actions-context';
import { formatBalance } from 'utils/format-balance';
import { useEligibleDelegators } from '../../hooks/use-eligible-delegators';
import { DelegatorsSelector } from './components/delegators-selector';
import { FlexWrapper } from 'shared/styled-components';
import { Address } from 'viem';
import { Box } from 'shared/components/box';
import { CheckIcon, CrossIcon } from 'shared/components/icons';

export const VoteActions = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { voteData } = useVoteContext();

  const [selectedDelegators, setSelectedDelegators] = useState<Address[]>([]);

  const { handleDelegatedVote, handleOwnVote } = useVoteActionsContext();

  const {
    data: { eligibleDelegatedVoters },
    isLoading: isEligibleLoading,
    refetch: refetchEligibleDelegators,
  } = useEligibleDelegators({ voteId: voteData?.voteId });

  const [currentMode, setCurrentMode] = useState<VoteMode>('yay');

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
    () => `${formatBalance(voteData?.votePowerWei || 0n)} ${tokenData?.symbol}`,
    [tokenData?.symbol, voteData?.votePowerWei],
  );

  const formattedDelegatedVP = useMemo(
    () =>
      `${formatBalance(delegatorsData.totalVotingPower || 0n)} ${tokenData?.symbol}`,
    [tokenData?.symbol, delegatorsData.totalVotingPower],
  );
  const handleSelectionChange = useCallback((selectedAddresses: Address[]) => {
    setSelectedDelegators(selectedAddresses);
  }, []);

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
          voters: selectedDelegators,
        });
      }

      await refetchEligibleDelegators();
    },
    [
      voteData,
      handleOwnVote,
      handleDelegatedVote,
      selectedDelegators,
      refetchEligibleDelegators,
    ],
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
      {canVoteWithDelegatedVotePower &&
        !canVoteWithOwnPower &&
        voteData.phase !== VotePhase.Closed && (
          <FlexWrapper $flexDirection="column">
            {!isEligibleLoading && eligibleDelegatedVoters.length > 0 && (
              <DelegatorsSelector
                delegators={eligibleDelegatedVoters}
                voteEvents={voteData.voteEvents}
                onSelectionChange={handleSelectionChange}
              />
            )}
            <BasicActions
              votePhase={voteData.phase}
              onVote={(mode: VoteMode) =>
                handleVote({ mode, type: 'delegated' })
              }
            />
          </FlexWrapper>
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

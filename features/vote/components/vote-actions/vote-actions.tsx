import { PopupMenu, PopupMenuItem, Tooltip } from '@lidofinance/lido-ui';
import { Actions, VoteButton } from './style';
import { VoteMode } from '../../types';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { VotePhase } from 'shared/votes/types';
import { useDelegators } from '../../hooks/use-delegators';
import { BasicActions } from './basic-actions';
import { useVoteContext } from 'features/vote/providers/vote-context';
import { formatBalance } from 'utils/format-balance';
import { DelegatorsSelector } from './components/delegators-selector';
import { FlexWrapper } from 'shared/styled-components';
import { Address } from 'viem';
import { Box } from 'shared/components/box';
import { CheckIcon, CrossIcon } from 'shared/components/icons';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useVoteAction } from 'features/vote/write-actions/vote/action';

export const VoteActions = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { vote, voteEvents, voterDaoTokenBalance, eligibleDelegators } =
    useVoteContext();
  const isSupportedChain = useIsSupportedChain();

  const [selectedDelegators, setSelectedDelegators] = useState<Address[]>([]);

  const processVote = useVoteAction({
    voteId: BigInt(vote.id),
    onConfirm: async () => {
      // TODO: add refetch
      // await refetchEligibleDelegators();
    },
  });

  const delegatorsVotedThemselves = useMemo(() => {
    if (!voteEvents) return [];

    const delegatorSet = new Set(
      eligibleDelegators.map(({ address }) => address.toLowerCase()),
    );
    const votedThroughDelegateSet = new Set(
      voteEvents.flatMap(
        (event) =>
          event.delegatedVotes?.map((e) => e.voter.toLowerCase()) ?? [],
      ),
    );

    return voteEvents.filter(
      (event) =>
        !event.delegatedVotes?.length &&
        delegatorSet.has(event.voter.toLowerCase()) &&
        !votedThroughDelegateSet.has(event.voter.toLowerCase()),
    );
  }, [eligibleDelegators, voteEvents]);

  const [currentMode, setCurrentMode] = useState<VoteMode>('yay');

  const nayButtonRef = useRef(null);
  const yayButtonRef = useRef(null);

  const { data: tokenData } = useGovernanceToken();
  const { data: delegatorsData, isLoading: isDelegatorsLoading } =
    useDelegators();

  const canVoteForDelegators = eligibleDelegators.length > 0;

  const canVoteWithOwnPower = !!voterDaoTokenBalance;

  const canVoteWithDelegatedVotePower = useMemo(() => {
    return !isDelegatorsLoading && delegatorsData.totalVotingPower > 0;
  }, [isDelegatorsLoading, delegatorsData.totalVotingPower]);

  const formattedOwnVP = `${formatBalance(voterDaoTokenBalance || 0n)} ${tokenData?.symbol}`;

  const formattedDelegatedVP = `${formatBalance(delegatorsData.totalVotingPower || 0n)} ${tokenData?.symbol}`;

  const handleSelectionChange = (selectedAddresses: Address[]) => {
    setSelectedDelegators(selectedAddresses);
  };

  const handleMenu = (mode: VoteMode) => {
    setCurrentMode(mode);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <Actions>
      {canVoteWithOwnPower &&
        (!canVoteWithDelegatedVotePower || !canVoteForDelegators) && (
          <BasicActions
            disabled={!isSupportedChain}
            votePhase={vote.phase}
            onVote={(mode: VoteMode) => processVote({ mode })}
          />
        )}
      {canVoteWithDelegatedVotePower &&
        !canVoteWithOwnPower &&
        vote.phase !== VotePhase.Closed && (
          <FlexWrapper $flexDirection="column">
            {(canVoteForDelegators || delegatorsVotedThemselves.length > 0) && (
              <DelegatorsSelector
                delegators={eligibleDelegators}
                voteEvents={voteEvents}
                onSelectionChange={handleSelectionChange}
                delegatorsVotedThemselves={delegatorsVotedThemselves}
              />
            )}
            {canVoteForDelegators && (
              <BasicActions
                votePhase={vote.phase}
                disabled={!isSupportedChain}
                onVote={(mode: VoteMode) =>
                  processVote({
                    mode,
                    delegatedVoters: selectedDelegators,
                    shouldSkipConfirmation: true,
                  })
                }
              />
            )}
          </FlexWrapper>
        )}

      {canVoteWithOwnPower &&
        canVoteWithDelegatedVotePower &&
        canVoteForDelegators && (
          <>
            <VoteButton
              onClick={() => handleMenu('nay')}
              ref={nayButtonRef}
              disabled={!isSupportedChain}
            >
              <Box
                display="flex"
                gap={12}
                width={'100%'}
                justifyContent="flex-start"
                alignItems="center"
              >
                <CrossIcon /> No
              </Box>
            </VoteButton>
            {vote.phase === VotePhase.Objection ? (
              <Tooltip
                placement="bottomLeft"
                title="You can only vote “No” in the Objection phase."
              >
                <div>
                  <VoteButton
                    disabled
                    ref={yayButtonRef}
                    style={{ pointerEvents: 'none', width: '100%' }}
                  >
                    <Box display="flex" alignItems="center">
                      <Box
                        display="flex"
                        gap={12}
                        width={'100%'}
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <CheckIcon /> Yes
                      </Box>
                    </Box>
                  </VoteButton>
                </div>
              </Tooltip>
            ) : (
              <VoteButton
                onClick={() => handleMenu('yay')}
                disabled={!isSupportedChain}
                ref={yayButtonRef}
              >
                <Box display="flex" alignItems="center">
                  <Box
                    display="flex"
                    gap={12}
                    width={'100%'}
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <CheckIcon /> Yes
                  </Box>
                </Box>
              </VoteButton>
            )}
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
          data-testid="myOwnVPBtn"
          onClick={() => processVote({ mode: currentMode })}
        >
          {`My own (${formattedOwnVP})`}
        </PopupMenuItem>
        <PopupMenuItem
          data-testid="delegatedVPBtn"
          onClick={() => processVote({ mode: currentMode })}
        >
          {`Delegated (${formattedDelegatedVP})`}
        </PopupMenuItem>
      </PopupMenu>
    </Actions>
  );
};

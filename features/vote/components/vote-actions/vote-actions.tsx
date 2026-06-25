import { PopupMenu, PopupMenuItem } from '@lidofinance/lido-ui';
import { Actions } from './style';
import { VoteMode } from '@vote/types';
import React, { useMemo, useRef, useState } from 'react';
import { VotePhase } from 'shared/votes/types';
import { ActionButtons } from './action-buttons';
import { useVoteContext } from '@vote/providers/vote-context';
import { formatBalance } from 'utils/format-balance';
import { DelegatorsSelector } from './components/delegators-selector';
import { FlexWrapper } from 'shared/styled-components';
import { Address } from 'viem';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { ProcessVote } from '@vote/write-actions/vote/action';
import { KnownToken } from 'shared/blockchain/tokens';

type Props = {
  processVote: ProcessVote;
};

export const VoteActions = ({ processVote }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    vote,
    voterDaoTokenBalance,
    eligibleDelegators,
    isLoading,
    eligibleDelegatedVotingPower,
    delegatorsVotedThemselves,
  } = useVoteContext();
  const isSupportedChain = useIsSupportedChain();

  const canVoteWithOwnPower = !!voterDaoTokenBalance;

  const canVoteWithDelegatedVotePower =
    !isLoading && eligibleDelegatedVotingPower > 0n;

  const canVote =
    vote.phase !== VotePhase.Closed &&
    (canVoteWithOwnPower || canVoteWithDelegatedVotePower);

  const [selectedDelegators, setSelectedDelegators] = useState<Address[]>([]);

  const [currentMode, setCurrentMode] = useState<VoteMode>('yay');

  const nayButtonRef = useRef(null);
  const yayButtonRef = useRef(null);

  // Calculate value to show in popup for delegated vp filtered by current mode
  const availableDelegatedVotingPower = useMemo(() => {
    if (!eligibleDelegatedVotingPower) {
      return 0n;
    }
    const votedForCurrentModeSum = eligibleDelegators.reduce(
      (acc, { delegateVoteMode, votingPower }) => {
        if (delegateVoteMode === currentMode) {
          return acc + votingPower;
        }
        return acc;
      },
      0n,
    );

    const result = eligibleDelegatedVotingPower - votedForCurrentModeSum;
    if (result < 0n) {
      return 0n;
    }

    return result;
  }, [currentMode, eligibleDelegatedVotingPower, eligibleDelegators]);

  const formattedOwnVP = `${formatBalance(voterDaoTokenBalance || 0n)} ${KnownToken.LDO.symbol}`;

  const formattedDelegatedVP = `${formatBalance(availableDelegatedVotingPower)} ${KnownToken.LDO.symbol}`;

  const handleSelectionChange = (selectedAddresses: Address[]) => {
    setSelectedDelegators(selectedAddresses);
  };

  const handleMenuClose = () => setIsMenuOpen(false);

  const handleVoteActionClick = (mode: VoteMode) => {
    setCurrentMode(mode);
    if (canVoteWithOwnPower && canVoteWithDelegatedVotePower) {
      setIsMenuOpen(true);
    } else if (canVoteWithOwnPower) {
      void processVote({ mode });
    } else if (selectedDelegators.length > 0) {
      void processVote({ mode, delegatedVoters: selectedDelegators });
    }
  };

  return (
    <Actions>
      <FlexWrapper $flexDirection="column">
        {!canVoteWithOwnPower &&
          (canVoteWithDelegatedVotePower ||
            delegatorsVotedThemselves.length > 0) && (
            <DelegatorsSelector
              delegators={eligibleDelegators}
              currentMode={null}
              onSelectionChange={handleSelectionChange}
              delegatorsVotedThemselves={delegatorsVotedThemselves}
            />
          )}
        {canVote && (
          <ActionButtons
            onVote={handleVoteActionClick}
            votePhase={vote.phase}
            disabled={
              !isSupportedChain ||
              (!canVoteWithOwnPower && selectedDelegators.length === 0)
            }
            nayRef={nayButtonRef}
            yayRef={yayButtonRef}
            loading={isLoading}
          />
        )}
      </FlexWrapper>

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
          onClick={() => {
            handleMenuClose();
            void processVote({ mode: currentMode });
          }}
        >
          {`My own (${formattedOwnVP})`}
        </PopupMenuItem>
        <PopupMenuItem
          data-testid="delegatedVPBtn"
          disabled={availableDelegatedVotingPower === 0n}
          onClick={() => {
            handleMenuClose();
            void processVote({
              mode: currentMode,
              requestDelegateSelection: true,
            });
          }}
        >
          {`Delegated (${formattedDelegatedVP})`}
        </PopupMenuItem>
      </PopupMenu>
    </Actions>
  );
};

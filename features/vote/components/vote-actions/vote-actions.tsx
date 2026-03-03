import { PopupMenu, PopupMenuItem } from '@lidofinance/lido-ui';
import { Actions } from './style';
import { VoteMode } from '../../types';
import React, { useRef, useState } from 'react';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { VotePhase } from 'shared/votes/types';
import { ActionButtons } from './action-buttons';
import { useVoteContext } from 'features/vote/providers/vote-context';
import { formatBalance } from 'utils/format-balance';
import { DelegatorsSelector } from './components/delegators-selector';
import { FlexWrapper } from 'shared/styled-components';
import { Address } from 'viem';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useVoteAction } from 'features/vote/write-actions/vote/action';

export const VoteActions = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    vote,
    voterDaoTokenBalance,
    eligibleDelegators,
    isLoading,
    eligibleDelegatedVotingPower,
    totalDelegatedVotingPower,
    delegatorsVotedThemselves,
  } = useVoteContext();
  const isSupportedChain = useIsSupportedChain();

  const [selectedDelegators, setSelectedDelegators] = useState<Address[]>([]);

  const processVote = useVoteAction();

  const [currentMode, setCurrentMode] = useState<VoteMode>('yay');

  const nayButtonRef = useRef(null);
  const yayButtonRef = useRef(null);

  const { data: tokenData } = useGovernanceToken();

  const canVoteForDelegators = eligibleDelegators.length > 0;

  const canVoteWithOwnPower = !!voterDaoTokenBalance;

  const canVoteWithDelegatedVotePower =
    !isLoading && eligibleDelegatedVotingPower > 0n;

  const formattedOwnVP = `${formatBalance(voterDaoTokenBalance || 0n)} ${tokenData?.symbol}`;

  const formattedDelegatedVP = `${formatBalance(totalDelegatedVotingPower)} ${tokenData?.symbol}`;

  const handleSelectionChange = (selectedAddresses: Address[]) => {
    setSelectedDelegators(selectedAddresses);
  };

  const handleMenu = (mode: VoteMode) => {
    setCurrentMode(mode);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <Actions>
      {canVoteWithOwnPower &&
        (!canVoteWithDelegatedVotePower || !canVoteForDelegators) && (
          <ActionButtons
            disabled={!isSupportedChain}
            votePhase={vote.phase}
            onVote={(mode: VoteMode) => processVote({ mode })}
            loading={isLoading}
          />
        )}
      {canVoteWithDelegatedVotePower &&
        !canVoteWithOwnPower &&
        vote.phase !== VotePhase.Closed && (
          <FlexWrapper $flexDirection="column">
            {(canVoteForDelegators || delegatorsVotedThemselves.length > 0) && (
              <DelegatorsSelector
                delegators={eligibleDelegators}
                onSelectionChange={handleSelectionChange}
                delegatorsVotedThemselves={delegatorsVotedThemselves}
              />
            )}
            {canVoteForDelegators && (
              <ActionButtons
                votePhase={vote.phase}
                disabled={!isSupportedChain}
                onVote={(mode: VoteMode) =>
                  processVote({
                    mode,
                    delegatedVoters: selectedDelegators,
                  })
                }
                loading={isLoading}
              />
            )}
          </FlexWrapper>
        )}

      {canVoteWithOwnPower &&
        canVoteWithDelegatedVotePower &&
        canVoteForDelegators && (
          <ActionButtons
            onVote={handleMenu}
            votePhase={vote.phase}
            disabled={!isSupportedChain}
            nayRef={nayButtonRef}
            yayRef={yayButtonRef}
            loading={isLoading}
          />
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
          onClick={() => {
            handleMenuClose();
            void processVote({ mode: currentMode });
          }}
        >
          {`My own (${formattedOwnVP})`}
        </PopupMenuItem>
        <PopupMenuItem
          data-testid="delegatedVPBtn"
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

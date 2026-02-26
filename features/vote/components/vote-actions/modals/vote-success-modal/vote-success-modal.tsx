import { TxStageSuccess } from 'shared/blockchain/transaction-modal/tx-stages-basic';
import { SuccessText } from 'shared/blockchain/transaction-modal/tx-stages-parts/success-text';
import { VoteMode, voteModeDict } from 'features/vote/types';
import { Text } from 'shared/components/text';
import { Button } from '@lidofinance/lido-ui';
import { VoteEvent, VotePhase } from 'shared/votes/types';
import { useAccount } from 'wagmi';
import React, { useMemo, useState, useEffect } from 'react';
import { AddonSection } from './style';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { Address } from 'viem';
import { DelegatorsSelector } from '../../components/delegators-selector';
import { useDelegators } from 'features/vote/hooks/use-delegators';
import { Box } from 'shared/components/box';
import { formatBalance } from 'utils/format-balance';
import { useEligibleDelegators } from 'features/vote/hooks/use-eligible-delegators';

type Props = {
  mode: VoteMode;
  txHash: string | undefined;
  onVoteWithOwnTokens: (mode: VoteMode) => void;
  onVoteWithRemainingDelegated?: (
    selectedVoters: Address[],
    mode: VoteMode,
  ) => void;
  voteEvents?: VoteEvent[];
  votePhase?: VotePhase;
  votePower?: bigint;
  voteId: bigint;
  title: string;
  justVotedDelegators?: Address[];
};

export const VoteSuccessModal = ({
  mode,
  txHash,
  onVoteWithOwnTokens,
  onVoteWithRemainingDelegated,
  voteEvents,
  votePower,
  voteId,
  title,
  justVotedDelegators,
}: Props) => {
  const { address } = useAccount();
  const { data: tokenData } = useGovernanceToken();
  const { data: delegatorsData } = useDelegators();

  const {
    data: { eligibleDelegatedVoters: allEligibleDelegators },
    refetch: refetchEligibleDelegators,
  } = useEligibleDelegators(voteId);

  useEffect(() => {
    void refetchEligibleDelegators();
  }, [refetchEligibleDelegators]);

  const [selectedDelegators, setSelectedDelegators] = useState<Address[]>([]);

  const ownVoteEvent = useMemo(() => {
    if (!address || !voteEvents) return null;

    return voteEvents.find(
      (event) =>
        event.voter.toLowerCase() === address.toLowerCase() &&
        !event.delegatedVotes?.length,
    );
  }, [voteEvents, address]);

  const hasOwnVotingPower = votePower && votePower > 0;
  const hasAlreadyVotedWithOwnTokens = !!ownVoteEvent;
  const canVoteWithOwnTokens =
    hasOwnVotingPower && !hasAlreadyVotedWithOwnTokens;

  const hasRemainingDelegatedPower = useMemo(() => {
    if (!address || !delegatorsData) return false;

    const { nonZeroDelegators = [] } = delegatorsData;

    const delegatorAddresses = new Set(
      nonZeroDelegators.map((d) => d.address.toLowerCase()),
    );

    // Get delegators who voted themselves (by holder)
    const votedByHolderAddresses = new Set(
      voteEvents
        ? voteEvents
            .filter(
              (event) =>
                !event.delegatedVotes?.length &&
                delegatorAddresses.has(event.voter.toLowerCase()),
            )
            .map((event) => event.voter.toLowerCase())
        : [],
    );

    // Get delegators voted for by delegates
    const votedDelegatorAddresses = new Set(
      voteEvents
        ? voteEvents
            .filter((event) => event.delegatedVotes?.length)
            .flatMap((event) => event.delegatedVotes || [])
            .map((vote) => vote.voter.toLowerCase())
        : [],
    );

    if (justVotedDelegators) {
      justVotedDelegators.forEach((address) => {
        votedDelegatorAddresses.add(address.toLowerCase());
      });
    }

    const remainingDelegators = nonZeroDelegators.filter(
      (delegator) =>
        !votedByHolderAddresses.has(delegator.address.toLowerCase()) &&
        !votedDelegatorAddresses.has(delegator.address.toLowerCase()),
    );

    return remainingDelegators.length > 0;
  }, [address, delegatorsData, voteEvents, justVotedDelegators]);

  const eligibleDelegatedVoters = useMemo(() => {
    if (!justVotedDelegators || justVotedDelegators.length === 0) {
      return allEligibleDelegators;
    }
    const votedSet = new Set(justVotedDelegators.map((a) => a.toLowerCase()));

    return allEligibleDelegators.filter(
      (delegator) => !votedSet.has(delegator.address.toLowerCase()),
    );
  }, [allEligibleDelegators, justVotedDelegators]);

  const handleDelegatedVoteClick = () => {
    if (onVoteWithRemainingDelegated && selectedDelegators.length > 0) {
      onVoteWithRemainingDelegated(selectedDelegators, mode);
    }
  };

  const handleSelectionChange = (selectedAddresses: Address[]) => {
    setSelectedDelegators(selectedAddresses);
  };

  if (!canVoteWithOwnTokens && !hasRemainingDelegatedPower) {
    return (
      <TxStageSuccess
        txHash={txHash}
        title={title}
        description={<SuccessText txHash={txHash} />}
        showEtherscan={false}
      />
    );
  }

  return (
    <TxStageSuccess
      txHash={txHash}
      title={title}
      description={
        <>
          <SuccessText txHash={txHash} />

          {canVoteWithOwnTokens && hasRemainingDelegatedPower && (
            <AddonSection>
              <Text
                strong
                size={16}
              >{`Vote "${voteModeDict[mode]}" with`}</Text>

              <Box display="flex" gap={8} marginTop="12px">
                <Button
                  size="sm"
                  color="secondary"
                  onClick={() => onVoteWithOwnTokens(mode)}
                  style={{ flex: 1 }}
                >
                  My own ({formatBalance(votePower)} {tokenData?.symbol})
                </Button>

                <Button
                  size="sm"
                  color="secondary"
                  onClick={handleDelegatedVoteClick}
                  style={{ flex: 1 }}
                >
                  Delegated
                </Button>
              </Box>
              <DelegatorsSelector
                onSelectionChange={handleSelectionChange}
                delegators={eligibleDelegatedVoters}
                voteEvents={voteEvents || []}
              />
            </AddonSection>
          )}

          {canVoteWithOwnTokens && !hasRemainingDelegatedPower && (
            <AddonSection>
              <Text strong>
                Vote with your own {formatBalance(votePower)}{' '}
                {tokenData?.symbol}
              </Text>
              <Button onClick={() => onVoteWithOwnTokens(mode)} fullwidth>
                {voteModeDict[mode]}
              </Button>
            </AddonSection>
          )}

          {!canVoteWithOwnTokens && hasRemainingDelegatedPower && (
            <AddonSection>
              <Text strong>
                Vote {voteModeDict[mode]} with delegated tokens
              </Text>
              <DelegatorsSelector
                onSelectionChange={handleSelectionChange}
                delegators={eligibleDelegatedVoters}
                voteEvents={voteEvents || []}
              />
              <Button onClick={handleDelegatedVoteClick} fullwidth>
                {voteModeDict[mode]}
              </Button>
            </AddonSection>
          )}
        </>
      }
      showEtherscan={false}
    />
  );
};

import { TxStageSuccess } from 'shared/blockchain/transaction-modal/tx-stages-basic';
import { SuccessText } from 'shared/blockchain/transaction-modal/tx-stages-parts/success-text';
import { VoteMode, voteModeDict } from '../../../../types';
import { Text } from 'shared/components/text';
import { Button } from '@lidofinance/lido-ui';
import { VoteEvent, VotePhase } from 'shared/votes/types';
import { useAccount } from 'wagmi';
import React, { useMemo, useState } from 'react';
import { AddonSection } from './style';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { formatEther, Address } from 'viem';
import { DelegatorsSelector } from '../../components/delegators-selector';
import { useDelegators } from '../../../../hooks/use-delegators';
import { Box } from 'shared/components/box';

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
}: Props) => {
  const { address } = useAccount();
  const { data: tokenData } = useGovernanceToken();
  const { data: delegatorsData } = useDelegators();

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

    const votedDelegatorAddresses = new Set(
      voteEvents
        ? voteEvents
            .filter((event) => event.delegatedVotes?.length)
            .flatMap((event) => event.delegatedVotes || [])
            .map((vote) => vote.voter.toLowerCase())
        : [],
    );

    const remainingDelegators = nonZeroDelegators.filter(
      (delegator) =>
        !votedDelegatorAddresses.has(delegator.address.toLowerCase()),
    );

    return remainingDelegators.length > 0;
  }, [address, delegatorsData, voteEvents]);

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
                  My own ({formatEther(votePower)} {tokenData?.symbol})
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
                voteId={voteId}
                onSelectionChange={handleSelectionChange}
              />
            </AddonSection>
          )}

          {canVoteWithOwnTokens && !hasRemainingDelegatedPower && (
            <AddonSection>
              <Text strong>
                Vote with your own {formatEther(votePower)} {tokenData?.symbol}
              </Text>
              <DelegatorsSelector
                voteId={voteId}
                onSelectionChange={handleSelectionChange}
              />
              <Button onClick={handleDelegatedVoteClick} fullwidth>
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
                voteId={voteId}
                onSelectionChange={handleSelectionChange}
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

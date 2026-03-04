import { TxStageSuccess } from 'shared/blockchain/transaction-modal/tx-stages-basic';
import { SuccessText } from 'shared/blockchain/transaction-modal/tx-stages-parts/success-text';
import { EligibleDelegator, VoteMode } from 'features/vote/types';
import { Text } from 'shared/components/text';
import { Button } from '@lidofinance/lido-ui';
import { VoteEvent } from 'shared/votes/types';
import { useAccount } from 'wagmi';
import React, { useMemo, useState } from 'react';
import { AddonSection } from './style';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { Address } from 'viem';
import { DelegatorsSelector } from '../../components/delegators-selector';
import { Box } from 'shared/components/box';
import { formatBalance } from 'utils/format-balance';
import { VOTE_MODE_MAP } from 'features/vote/constants';

type Props = {
  mode: VoteMode;
  txHash: string | undefined;
  voteEvents: VoteEvent[];
  votePower: bigint;
  remainingDelegators: EligibleDelegator[];
  remainingDelegatedVotingPower: bigint;
  onVoteWithOwnTokens: (mode: VoteMode) => void;
  onVoteWithRemainingDelegated?: (
    selectedVoters: Address[],
    mode: VoteMode,
  ) => void;
};

export const VoteSuccessModal = ({
  mode,
  txHash,
  voteEvents,
  votePower,
  remainingDelegatedVotingPower,
  remainingDelegators,
  onVoteWithOwnTokens,
  onVoteWithRemainingDelegated,
}: Props) => {
  const { address } = useAccount();
  const { data: tokenData } = useGovernanceToken();

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

  const hasRemainingDelegatedPower = remainingDelegatedVotingPower > 0n;

  const handleDelegatedVoteClick = () => {
    if (onVoteWithRemainingDelegated && selectedDelegators.length > 0) {
      onVoteWithRemainingDelegated(selectedDelegators, mode);
    }
  };

  const handleSelectionChange = (selectedAddresses: Address[]) => {
    setSelectedDelegators(selectedAddresses);
  };

  const voteModeLabel = VOTE_MODE_MAP[mode];

  if (!canVoteWithOwnTokens && !hasRemainingDelegatedPower) {
    return (
      <TxStageSuccess
        txHash={txHash}
        title={`You voted '${voteModeLabel}'`}
        description={<SuccessText txHash={txHash} />}
        showEtherscan={false}
      />
    );
  }

  return (
    <TxStageSuccess
      txHash={txHash}
      title={`You voted '${voteModeLabel}'`}
      description={
        <>
          <SuccessText txHash={txHash} />

          {canVoteWithOwnTokens && hasRemainingDelegatedPower && (
            <AddonSection>
              <Text strong size={16}>{`Vote "${voteModeLabel}" with`}</Text>

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
                currentMode={mode}
                onSelectionChange={handleSelectionChange}
                delegators={remainingDelegators}
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
                {voteModeLabel}
              </Button>
            </AddonSection>
          )}

          {!canVoteWithOwnTokens && hasRemainingDelegatedPower && (
            <AddonSection>
              <Text strong>Vote {voteModeLabel} with delegated tokens</Text>
              <DelegatorsSelector
                currentMode={mode}
                onSelectionChange={handleSelectionChange}
                delegators={remainingDelegators}
              />
              <Button onClick={handleDelegatedVoteClick} fullwidth>
                {voteModeLabel}
              </Button>
            </AddonSection>
          )}
        </>
      }
      showEtherscan={false}
    />
  );
};

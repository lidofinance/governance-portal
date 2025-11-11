import { Checkbox, ToastInfo, trimAddress } from '@lidofinance/lido-ui';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { Address, formatEther } from 'viem';

import { AddressPop } from 'shared/components/address-pop';
import { Text } from 'shared/components/text';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { useDelegators } from 'features/vote/hooks/use-delegators';
import { useVote } from 'features/vote/hooks/use-vote';
import { VoteEvent } from 'shared/votes/types';

import {
  AccordionWrap,
  AddressBadgeWrap,
  AddressWrap,
  DelegatorsListItem,
  DelegatorsVotingPower,
  ListWrap,
  SummaryAmount,
  SummaryWrap,
  VotedByHolderWrap,
} from './style';
import { pluralize } from 'utils/pluralize';

const TRANSACTION_LIMIT = 100;

type Delegator = {
  address: Address;
  balance: bigint;
  votedByDelegate?: boolean;
  delegateVote?: boolean;
};

type CheckedItems = Record<string, boolean>;

const DelegatorsSummary = ({
  selectedBalance,
  totalVotingPower,
  delegatorCount,
  tokenSymbol,
}: {
  selectedBalance: bigint;
  totalVotingPower: bigint;
  delegatorCount: number;
  tokenSymbol?: string;
}) => (
  <SummaryWrap data-testid="delegatorsInfo">
    <Text size={12}>Selected</Text>
    <SummaryAmount data-testid="delegatorsVPAmount">
      <Text size={12} strong>
        {formatEther(selectedBalance)} {tokenSymbol}
      </Text>
      <Text size={12}>
        {` / ${formatEther(totalVotingPower)} ${tokenSymbol}`}
      </Text>
    </SummaryAmount>
    <Text size={12} data-testid="delegatorsNumber">
      from {pluralize(delegatorCount, 'delegator')}
    </Text>
  </SummaryWrap>
);

const VotableDelegatorItem = ({
  delegator,
  isChecked,
  onCheckedChange,
  tokenSymbol,
}: {
  delegator: Delegator & { votedByDelegate?: boolean; delegateVote?: boolean };
  isChecked: boolean;
  onCheckedChange: (address: Address, isChecked: boolean) => void;
  tokenSymbol?: string;
}) => (
  <DelegatorsListItem key={delegator.address} data-testid="delegatorsListRow">
    <AddressWrap>
      <Checkbox
        data-testid="delegatorCheckbox"
        checked={isChecked}
        onChange={(e) => onCheckedChange(delegator.address, e.target.checked)}
      />
      <AddressPop
        address={delegator.address}
        data-testid="delegatorAddressPopUp"
      >
        <AddressBadgeWrap data-testid="delegatorAddress">
          <Text as="span" size={12}>
            {trimAddress(delegator.address, 4)}
          </Text>
        </AddressBadgeWrap>
      </AddressPop>
    </AddressWrap>
    {delegator.votedByDelegate && (
      <Text as="span" size={12} color="secondary">
        {delegator.delegateVote ? 'Yes (You)' : 'No (You)'}
      </Text>
    )}
    <DelegatorsVotingPower data-testid="delegatorVP">
      {formatEther(BigInt(delegator.balance))} {tokenSymbol}
    </DelegatorsVotingPower>
  </DelegatorsListItem>
);

const VotedDelegatorItem = ({
  voteEvent,
  tokenSymbol,
}: {
  voteEvent: VoteEvent;
  tokenSymbol?: string;
}) => (
  <DelegatorsListItem key={voteEvent.voter}>
    <AddressPop address={voteEvent.voter}>
      <AddressBadgeWrap>
        <Text as="span" size={12}>
          {trimAddress(voteEvent.voter, 4)}
        </Text>
      </AddressBadgeWrap>
    </AddressPop>
    <span>{voteEvent.supports ? 'Yes' : 'No'}</span>
    <Text size={14}>
      {formatEther(voteEvent.stake)} {tokenSymbol}
    </Text>
  </DelegatorsListItem>
);

interface DelegatorsSelectorProps {
  voteId: bigint;
  onSelectionChange?: (
    selectedAddresses: Address[],
    selectedBalance: bigint,
  ) => void;
}

export const DelegatorsSelector = ({
  voteId,
  onSelectionChange,
}: DelegatorsSelectorProps) => {
  const voteData = useVote({ voteId: voteId });
  const { data: delegatorsData, isLoading: isDelegatorsLoading } =
    useDelegators();
  const { data: governanceTokenData } = useGovernanceToken();

  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

  const { nonZeroDelegators = [], totalVotingPower = 0n } =
    delegatorsData ?? {};
  const { voteEvents = [] } = voteData ?? {};
  const tokenSymbol = governanceTokenData?.symbol;

  const processedDelegators = useMemo(() => {
    if (nonZeroDelegators.length === 0) {
      return {
        votableDelegators: [] as Delegator[],
        votedByHolderEvents: [] as VoteEvent[],
      };
    }

    const delegatorAddresses = new Set(
      nonZeroDelegators.map((d) => d.address.toLowerCase()),
    );

    const votedByHolder = voteEvents.filter(
      (event) =>
        !event.delegatedVotes?.length &&
        delegatorAddresses.has(event.voter.toLowerCase()),
    );

    const votedByDelegate = voteEvents.filter(
      (event) =>
        event.delegatedVotes?.length &&
        event.delegatedVotes.some((vote) =>
          delegatorAddresses.has(vote.voter.toLowerCase()),
        ),
    );

    const votedByHolderSet = new Set(
      votedByHolder.map((event) => event.voter.toLowerCase()),
    );

    const delegateVoteMap = new Map<
      string,
      { votedByDelegate: boolean; delegateVote: boolean }
    >();
    votedByDelegate.forEach((event) => {
      event.delegatedVotes?.forEach((vote) => {
        if (delegatorAddresses.has(vote.voter.toLowerCase())) {
          delegateVoteMap.set(vote.voter.toLowerCase(), {
            votedByDelegate: true,
            delegateVote: vote.supports,
          });
        }
      });
    });

    const votable = nonZeroDelegators
      .filter(
        (delegator) => !votedByHolderSet.has(delegator.address.toLowerCase()),
      )
      .map((delegator) => ({
        ...delegator,
        ...delegateVoteMap.get(delegator.address.toLowerCase()),
      }));

    return {
      votableDelegators: votable,
      votedByHolderEvents: votedByHolder,
    };
  }, [nonZeroDelegators, voteEvents]);

  const { votableDelegators, votedByHolderEvents } = processedDelegators;

  useEffect(() => {
    if (votableDelegators.length === 0) return;

    const initialChecked = votableDelegators
      .slice(0, TRANSACTION_LIMIT)
      .filter((delegator) => !delegator.votedByDelegate)
      .reduce((acc, delegator) => {
        acc[delegator.address] = true;
        return acc;
      }, {} as CheckedItems);

    setCheckedItems(initialChecked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [votableDelegators.length]); // Only depend on length to prevent infinite loops

  const selectionData = useMemo(() => {
    const selectedAddresses = Object.keys(checkedItems).filter(
      (address) => checkedItems[address],
    ) as Address[];

    const selectedBalance = votableDelegators
      .filter((delegator) => checkedItems[delegator.address])
      .reduce((acc, delegator) => acc + BigInt(delegator.balance), 0n);

    return { selectedAddresses, selectedBalance };
  }, [checkedItems, votableDelegators]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(
        selectionData.selectedAddresses,
        selectionData.selectedBalance,
      );
    }
  }, [
    selectionData.selectedAddresses,
    selectionData.selectedBalance,
    onSelectionChange,
  ]);

  const handleCheckboxChange = useCallback(
    (address: Address, isChecked: boolean) => {
      if (
        isChecked &&
        selectionData.selectedAddresses.length >= TRANSACTION_LIMIT
      ) {
        ToastInfo('Transaction limit reached. Vote with the rest next.', {});
        return;
      }
      setCheckedItems((prev) => ({ ...prev, [address]: isChecked }));
    },
    [selectionData.selectedAddresses.length],
  );

  if (!voteData || isDelegatorsLoading) {
    return null;
  }

  return (
    <AccordionWrap
      defaultExpanded
      summary={
        <DelegatorsSummary
          selectedBalance={selectionData.selectedBalance}
          totalVotingPower={totalVotingPower}
          delegatorCount={nonZeroDelegators.length}
          tokenSymbol={tokenSymbol}
        />
      }
    >
      <ListWrap data-testid="delegatorsList">
        {votableDelegators.map((delegator) => (
          <VotableDelegatorItem
            key={delegator.address}
            delegator={delegator}
            isChecked={checkedItems[delegator.address] || false}
            onCheckedChange={handleCheckboxChange}
            tokenSymbol={tokenSymbol}
          />
        ))}
      </ListWrap>

      {votedByHolderEvents.length > 0 && (
        <>
          <VotedByHolderWrap>
            <Text size={12} color="secondary">
              Voted by holder
            </Text>
          </VotedByHolderWrap>
          <ListWrap>
            {votedByHolderEvents.map((event) => (
              <VotedDelegatorItem
                key={event.voter}
                voteEvent={event}
                tokenSymbol={tokenSymbol}
              />
            ))}
          </ListWrap>
        </>
      )}
    </AccordionWrap>
  );
};

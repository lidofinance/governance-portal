import { Checkbox, trimAddress } from '@lidofinance/lido-ui';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';

import { AddressPop } from 'shared/components/address-pop';
import { Text } from 'shared/components/text';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
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
import { formatBalance } from 'utils/format-balance';
import { EligibleDelegator } from 'features/vote/hooks/use-eligible-delegators';

const TRANSACTION_LIMIT = 100;

type Delegator = EligibleDelegator & {
  delegateVote?: boolean;
};

type CheckedItems = Record<string, boolean>;

const pluralize = (count: number, noun: string, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

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
        {formatBalance(selectedBalance)} {tokenSymbol}
      </Text>
      <Text size={12}>
        {` / ${formatBalance(totalVotingPower)} ${tokenSymbol}`}
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
        onChange={(e) =>
          onCheckedChange(delegator.address as Address, e.target.checked)
        }
      />
      <AddressPop
        address={delegator.address as Address}
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
      {formatBalance(BigInt(delegator.votingPower))} {tokenSymbol}
    </DelegatorsVotingPower>
  </DelegatorsListItem>
);

interface DelegatorsSelectorProps {
  delegators: EligibleDelegator[];
  voteEvents: VoteEvent[];
  delegatorsVotedThemselves?: VoteEvent[];
  onSelectionChange?: (
    selectedAddresses: Address[],
    selectedBalance: bigint,
  ) => void;
}

export const DelegatorsSelector = ({
  onSelectionChange,
  voteEvents,
  delegators,
  delegatorsVotedThemselves,
}: DelegatorsSelectorProps) => {
  const { data: governanceTokenData } = useGovernanceToken();

  const tokenSymbol = governanceTokenData?.symbol;

  const totalVotingPower = useMemo(
    () => delegators.reduce((acc, d) => acc + d.votingPower, 0n),
    [delegators],
  );

  const votableDelegators = useMemo(() => {
    if (delegators.length === 0) {
      return [] as Delegator[];
    }

    const delegatorAddresses = new Set(
      delegators.map((d) => d.address.toLowerCase()),
    );

    const votedByDelegate = voteEvents.filter(
      (event) =>
        event.delegatedVotes?.length &&
        event.delegatedVotes.some((vote) =>
          delegatorAddresses.has(vote.voter.toLowerCase()),
        ),
    );

    const delegateVoteMap = new Map<string, boolean>();
    votedByDelegate.forEach((event) => {
      event.delegatedVotes?.forEach((vote) => {
        if (delegatorAddresses.has(vote.voter.toLowerCase())) {
          delegateVoteMap.set(vote.voter.toLowerCase(), vote.supports);
        }
      });
    });

    return delegators.map((delegator) => ({
      ...delegator,
      delegateVote: delegateVoteMap.get(delegator.address.toLowerCase()),
    }));
  }, [delegators, voteEvents]);

  const checkedItems = useMemo(() => {
    if (votableDelegators.length === 0) return {};

    return Object.fromEntries(
      votableDelegators
        .filter((delegator) => !delegator.votedByDelegate)
        .map((delegator, index) => [
          delegator.address,
          index < TRANSACTION_LIMIT,
        ]),
    );
  }, [votableDelegators]);

  const [finalCheckedItems, setFinalCheckedItems] = useState<CheckedItems>(
    () => {
      if (votableDelegators.length === 0) return {};
      return Object.fromEntries(
        votableDelegators
          .filter((delegator) => !delegator.votedByDelegate)
          .map((delegator, index) => [
            delegator.address,
            index < TRANSACTION_LIMIT,
          ]),
      );
    },
  );

  useEffect(() => {
    setFinalCheckedItems(checkedItems);
  }, [checkedItems]);

  const handleCheckboxChange = useCallback(
    (address: Address, isChecked: boolean) => {
      setFinalCheckedItems((prev) => {
        const newCheckedItems = { ...prev };
        if (isChecked) {
          newCheckedItems[address] = true;
        } else {
          delete newCheckedItems[address];
        }
        return newCheckedItems;
      });
    },
    [],
  );

  const selectionData = useMemo(() => {
    const selectedAddresses = Object.keys(finalCheckedItems).filter(
      (key) => finalCheckedItems[key],
    ) as Address[];

    const selectedBalance = votableDelegators
      .filter((d) => finalCheckedItems[d.address])
      .reduce((acc, d) => acc + d.votingPower, 0n);

    return { selectedAddresses, selectedBalance };
  }, [finalCheckedItems, votableDelegators]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(
        selectionData.selectedAddresses,
        selectionData.selectedBalance,
      );
    }
  }, [selectionData, onSelectionChange]);

  // Don't render until we have complete data AND votableDelegators are processed
  if (votableDelegators.length === 0 && !delegatorsVotedThemselves?.length) {
    return null;
  }

  return (
    <AccordionWrap
      key={delegators.length}
      defaultExpanded={false}
      summary={
        <DelegatorsSummary
          selectedBalance={selectionData.selectedBalance}
          totalVotingPower={totalVotingPower}
          delegatorCount={delegators.length}
          tokenSymbol={tokenSymbol}
        />
      }
    >
      <ListWrap data-testid="delegatorsList">
        {votableDelegators.map((delegator) => (
          <VotableDelegatorItem
            key={delegator.address}
            delegator={delegator}
            isChecked={finalCheckedItems[delegator.address] || false}
            onCheckedChange={handleCheckboxChange}
            tokenSymbol={tokenSymbol}
          />
        ))}
      </ListWrap>
      {delegatorsVotedThemselves && delegatorsVotedThemselves.length > 0 && (
        <>
          <VotedByHolderWrap>
            <Text size={12} color="secondary">
              Voted by holder
            </Text>
          </VotedByHolderWrap>
          <ListWrap>
            {delegatorsVotedThemselves.map((voteEvent) => (
              <DelegatorsListItem key={voteEvent.voter}>
                <AddressPop address={voteEvent.voter as Address}>
                  <AddressBadgeWrap>
                    <Text as="span" size={12}>
                      {trimAddress(voteEvent.voter, 4)}
                    </Text>
                  </AddressBadgeWrap>
                </AddressPop>
                <Text as="span" size={12} color="secondary">
                  {voteEvent.supports ? 'Yes' : 'No'}
                </Text>
                <DelegatorsVotingPower>
                  {formatBalance(voteEvent.stake)} {tokenSymbol}
                </DelegatorsVotingPower>
              </DelegatorsListItem>
            ))}
          </ListWrap>
        </>
      )}
    </AccordionWrap>
  );
};

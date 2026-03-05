import { Checkbox, trimAddress } from '@lidofinance/lido-ui';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';

import { AddressPop } from 'shared/components/address-pop';
import { Text } from 'shared/components/text';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';

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
import { EligibleDelegator, VoteMode, VoterInfo } from 'features/vote/types';

const TRANSACTION_LIMIT = 100;

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
  delegator: EligibleDelegator;
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
    {delegator.delegateVoteMode !== 'absent' && (
      <Text as="span" size={12} color="secondary">
        {delegator.delegateVoteMode === 'yay' ? 'Yes (You)' : 'No (You)'}
      </Text>
    )}
    <DelegatorsVotingPower data-testid="delegatorVP">
      {formatBalance(BigInt(delegator.votingPower))} {tokenSymbol}
    </DelegatorsVotingPower>
  </DelegatorsListItem>
);

interface DelegatorsSelectorProps {
  delegators: EligibleDelegator[];
  currentMode: VoteMode | null;
  delegatorsVotedThemselves?: VoterInfo[];
  onSelectionChange?: (
    selectedAddresses: Address[],
    selectedBalance: bigint,
  ) => void;
}

export const DelegatorsSelector = ({
  onSelectionChange,
  delegators,
  currentMode,
  delegatorsVotedThemselves,
}: DelegatorsSelectorProps) => {
  const { data: governanceTokenData } = useGovernanceToken();

  const tokenSymbol = governanceTokenData?.symbol;

  const totalVotingPower = useMemo(
    () => delegators.reduce((acc, d) => acc + d.votingPower, 0n),
    [delegators],
  );

  const checkedItems = useMemo(() => {
    if (delegators.length === 0) return {};

    return Object.fromEntries(
      delegators
        .filter((delegator) =>
          // For inline view of the select, filter delegators voted for ANY mode
          currentMode === null
            ? delegator.delegateVoteMode === 'absent'
            : delegator.delegateVoteMode !== currentMode,
        )
        .map((delegator, index) => [
          delegator.address,
          index < TRANSACTION_LIMIT,
        ]),
    );
  }, [delegators, currentMode]);

  const [finalCheckedItems, setFinalCheckedItems] =
    useState<CheckedItems>(checkedItems);

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

    const selectedBalance = delegators
      .filter((d) => finalCheckedItems[d.address])
      .reduce((acc, d) => acc + d.votingPower, 0n);

    return { selectedAddresses, selectedBalance };
  }, [finalCheckedItems, delegators]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(
        selectionData.selectedAddresses,
        selectionData.selectedBalance,
      );
    }
  }, [selectionData, onSelectionChange]);

  const shouldShowSelection = delegators.length > 0;

  // Don't render until we have complete data AND delegators are processed
  if (!shouldShowSelection && !delegatorsVotedThemselves?.length) {
    return null;
  }

  return (
    <AccordionWrap
      key={delegators.length}
      defaultExpanded={!shouldShowSelection}
      summary={
        shouldShowSelection ? (
          <DelegatorsSummary
            selectedBalance={selectionData.selectedBalance}
            totalVotingPower={totalVotingPower}
            delegatorCount={selectionData.selectedAddresses.length}
            tokenSymbol={tokenSymbol}
          />
        ) : (
          'Voted by holder'
        )
      }
    >
      {shouldShowSelection && (
        <ListWrap data-testid="delegatorsList">
          {delegators.map((delegator) => (
            <VotableDelegatorItem
              key={delegator.address}
              delegator={delegator}
              isChecked={finalCheckedItems[delegator.address] || false}
              onCheckedChange={handleCheckboxChange}
              tokenSymbol={tokenSymbol}
            />
          ))}
        </ListWrap>
      )}
      {delegatorsVotedThemselves && delegatorsVotedThemselves.length > 0 && (
        <>
          {shouldShowSelection && (
            <VotedByHolderWrap>
              <Text size={12} color="secondary">
                Voted by holder
              </Text>
            </VotedByHolderWrap>
          )}
          <ListWrap>
            {delegatorsVotedThemselves.map((voter) => (
              <DelegatorsListItem key={voter.address}>
                <AddressPop address={voter.address}>
                  <AddressBadgeWrap>
                    <Text as="span" size={12}>
                      {trimAddress(voter.address, 4)}
                    </Text>
                  </AddressBadgeWrap>
                </AddressPop>
                <Text as="span" size={12} color="secondary">
                  {voter.supports ? 'Yes' : 'No'}
                </Text>
                <DelegatorsVotingPower>
                  {formatBalance(voter.stake)} {tokenSymbol}
                </DelegatorsVotingPower>
              </DelegatorsListItem>
            ))}
          </ListWrap>
        </>
      )}
    </AccordionWrap>
  );
};

import styled from 'styled-components';
import { Accordion } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';

export const AccordionWrap = styled(Accordion)`
  text-align: left;
  background-color: inherit;

  & > div {
    padding: 20px 0 0;
    margin: 0;
  }
`;

export const DelegatorsListItem = styled.div`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: white;

  &:not(:last-child) {
    border-bottom: 1px solid var(--lido-color-border);
  }
`;

export const DelegatorsVotingPower = styled(Text).attrs({ size: 14 })`
  min-width: 82px;
  text-align: right;
`;

export const AddressWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ListWrap = styled.div`
  border: 1px solid var(--lido-color-border);
  margin: 0 -32px;
  border-radius: 8px;
`;

export const VotedByHolderWrap = styled.div`
  margin: 24px -32px 12px;
`;

export const AddressBadgeWrap = styled.span`
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;

  & > div:nth-child(1) {
    margin-right: 8px;
  }
`;

export const SummaryWrap = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SummaryAmount = styled.div`
  padding: 4px 10px;
  border-radius: 14px;
  background: var(--lido-color-backgroundSecondary);
  display: flex;
  flex-shrink: 0;
  gap: 4px;
`;

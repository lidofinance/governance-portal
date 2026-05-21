import styled from 'styled-components';
import { Text } from 'shared/components/text';

export const QuorumRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
`;

export const QuorumLabel = styled(Text).attrs({
  size: 14,
  weight: 700,
})`
  color: var(--lido-color-text);
`;

export const QuorumValue = styled(Text).attrs({
  as: 'span',
  size: 14,
})`
  color: var(--lido-color-text);
  font-weight: 400;
`;

export const QuorumReachedWrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--lido-color-textSecondary);
  cursor: pointer;
`;

export const QuorumReached = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: var(--lido-color-textSecondary);
`;

export const QuorumTooltipBody = styled.span`
  display: block;
  font-size: 12px;
`;

export const QuorumTooltipRow = styled.span`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const VoteTotalsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
`;

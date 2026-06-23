import styled from 'styled-components';
import { Tooltip } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';

export const QuorumRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 26px;
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

export const QuorumStatusWrap = styled.span<{ $reached: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${({ $reached }) =>
    $reached ? 'var(--lido-color-textSecondary)' : 'var(--lido-color-warning)'};
  cursor: pointer;

  ${({ $reached }) =>
    !$reached &&
    `svg path {
      fill-opacity: 1;
    }`}
`;

export const QuorumStatus = styled.span<{ $reached: boolean }>`
  font-size: 12px;
  font-weight: 400;
  color: ${({ $reached }) =>
    $reached ? 'var(--lido-color-textSecondary)' : 'var(--lido-color-warning)'};
`;

export const QuorumTooltip = styled(Tooltip)`
  && {
    max-width: 320px;
  }
`;

export const QuorumTooltipBody = styled.span`
  display: block;
  font-size: 12px;
`;

export const QuorumTooltipRow = styled.span`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
  margin-top: ${({ theme }) => theme.spaceMap.xs}px;

  span:last-child {
    white-space: nowrap;
  }
`;

export const VoteTotalsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
`;

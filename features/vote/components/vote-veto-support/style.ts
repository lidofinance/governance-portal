import styled from 'styled-components';
import { Text } from 'shared/components/text';
import { ProgressBarOutline } from 'shared/components/progress-bar/styles';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled(Text).attrs({
  size: 14,
  weight: 700,
})`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--lido-color-text);
`;

export const Value = styled(Text).attrs({
  size: 14,
})`
  color: var(--lido-color-text);
  font-weight: 400;
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--lido-color-textSecondary);
`;

export const InfoIconWrap = styled.span`
  display: inline-flex;
  cursor: pointer;
  color: var(--lido-color-textSecondary);
`;

export const ProgressWrap = styled.div`
  width: 100%;

  & ${ProgressBarOutline} {
    height: 8px;
  }
`;

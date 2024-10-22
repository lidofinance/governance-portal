import styled from 'styled-components';
import { ThemeName } from '@lidofinance/lido-ui';

type ItemWrapProps = {
  $stickBottom: boolean | undefined;
};

export const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 40px;
  width: 40%;
  flex-shrink: 0;
  border-right: 1px solid #0000001a;
  color: #13121780;
`;

export const SummaryItemWrap = styled.div<ItemWrapProps>`
  &:not(:first-child) {
    margin-top: ${({ $stickBottom }) => ($stickBottom ? 'auto' : '18px')};
  }
  &:not(:last-child) {
    padding: 18px 0;
  }
  border-bottom: 1px solid
    ${({ theme }) => (theme.name === ThemeName.light ? '#0000001A' : '#fff')};

  &:last-child {
    border: none;
  }
`;
export const SummaryItemLabel = styled.div`
  font-size: 22px;
  color: #13121780;
  margin-bottom: 8px;
`;
export const SummaryItemContent = styled.div``;

import styled from 'styled-components';
import { Text } from 'shared/components/text';

export const VerticalTabsWrapper = styled.section<{ $hasGap?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ $hasGap }) => $hasGap && `gap: 16px;`}
`;

type TabProps = {
  $active: boolean;
  $hasBorder?: boolean;
  $borderSide?: 'left' | 'right';
};

export const VerticalTab = styled(Text)<TabProps>`
  padding: ${({ $hasBorder }) => ($hasBorder ? '17px 24px' : '17px 0')};
  cursor: pointer;
  color: var(--primary-color-black-72);
  font-weight: ${({ $active, $hasBorder }) =>
    $active && !$hasBorder ? 'bold' : 'normal'};
  ${({ $hasBorder, $borderSide, $active }) =>
    $hasBorder && $borderSide === 'left'
      ? `
          border-left: ${$active ? '2px solid black' : '2px solid var(--border-color-fog)'};
          border-right: none;
        `
      : $hasBorder && $borderSide === 'right'
        ? `
          border-right: ${$active ? '2px solid black' : '2px solid var(--border-color-fog)'};
          border-left: none;
        `
        : ''}
  transition:
    border-color 0.3s,
    font-weight 0.3s;
`;

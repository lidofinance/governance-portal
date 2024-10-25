import styled from 'styled-components';
import { PopupMenu, PopupMenuProps } from '@lidofinance/lido-ui';

type FlexWrapperProps = {
  $flexDirection?: 'column' | 'row';
  $alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline';
  $justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  $gap?: string;
};

export const FlexWrapper = styled.div<FlexWrapperProps>`
  display: flex;
  align-items: ${({ $alignItems }) => $alignItems || 'center'};
  flex-direction: ${({ $flexDirection }) => $flexDirection || 'row'};
  justify-content: ${({ $justifyContent }) => $justifyContent || 'flex-start'};
  gap: ${({ $gap }) => $gap || 0};
`;

export const StyledPopupMenu = styled(PopupMenu)<PopupMenuProps>`
  padding: 24px;
  border-radius: 32px;
`;

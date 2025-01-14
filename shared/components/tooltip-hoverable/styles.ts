import styled from 'styled-components';
import { Popover } from '@lidofinance/lido-ui';

export const TooltipPopoverStyle = styled(Popover)`
  && {
    padding: 24px;
    background-color: #555558;
    color: var(--lido-color-accentContrast);
    font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
    font-weight: 400;
    max-width: 256px;
    border-radius: 18px;
    box-shadow: ${({ theme }) => theme.boxShadows.sm}
      var(--lido-color-shadowLight);
    pointer-events: default !important;

    & a {
      text-decoration: none;
      color: var(--lido-color-primary);
    }
  }
`;

import { Popover } from '@lidofinance/lido-ui';
import { Button } from 'shared/components/button';
import styled from 'styled-components';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { getDualGovernanceBannerColor } from 'features/dual-governance/utils/get-banner-color';

export const DualGovernanceStatusButtonStyled = styled(Button).attrs({
  color: 'secondary',
  size: 'sm',
  variant: 'outlined',
})<{ $status: VisibleGovernanceState; $loading?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #000a3d1f;
  padding: 14px;

  &:hover {
    background-color: transparent !important;
  }

  &:hover,
  &:not(:disabled):hover {
    background-color: #0085ff1a;
    border-color: #0085ffb8;
    }
  }

  & svg {
    fill: ${({ $status }) => getDualGovernanceBannerColor($status)};
    width: 24px;
    height: 24px;
  }
`;

export const PopoverStyled = styled(Popover)`
  width: 280px;
  padding: 0 !important;
`;

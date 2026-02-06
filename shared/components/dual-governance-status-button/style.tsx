import { ButtonIcon, Popover } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { getDualGovernanceBannerColor } from 'features/dual-governance/utils/get-banner-color';

export const DualGovernanceStatusButtonStyled = styled(ButtonIcon).attrs({
  color: 'secondary',
  size: 'sm',
  variant: 'ghost',
})<{ $status: VisibleGovernanceState; $loading?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #000a3d1f;
  margin-right: 12px;
  padding: 14px;

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

import { Block, Theme } from '@lidofinance/lido-ui';
import { OrderStatus } from '@stonks/types';
import { Text } from 'shared/components/text';
import styled, { css } from 'styled-components';

export const OrderCardWrapper = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

type StatusValueProps = {
  value: OrderStatus;
};

export const StatusValue = styled(Text).attrs({
  size: 14,
  weight: 800,
})`
  text-transform: uppercase;
  letter-spacing: 0.4px;

  ${({ value, theme }: StatusValueProps & { theme: Theme }) => {
    switch (value) {
      case 'fulfilled':
        return css`
          color: #53ba95;
        `;
      case 'cancelled':
      case 'expired':
        return css`
          color: #de186b;
        `;
      // rgb(0, 163, 255) - link
      default:
        return css`
          color: ${theme.colors.primary};
        `;
    }
  }}
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ButtonsRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  & > * {
    flex: 1;
  }
`;

export const Label = styled(Text).attrs({
  color: 'secondary',
  size: 14,
})``;

export const Value = styled(Text).attrs({
  size: 14,
})``;

export const NumberValue = styled(Text).attrs({
  size: 12,
})``;

export const LinkValue = styled(Text).attrs({
  size: 14,
  color: 'accent',
})``;

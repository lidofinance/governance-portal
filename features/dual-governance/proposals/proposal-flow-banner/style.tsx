import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { Block } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';

export const FlowBannerWrapper = styled(Block)`
  margin-top: 20px;
`;

export const Arrow = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 40px;
  height: 20px;
  position: relative;
  margin-left: -6px;
  margin-top: 22px;

  &:before {
    content: '';
    width: calc(100% - 12px);
    height: 2px;
    background: #666666;
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-left: 12px solid #666666;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  span {
    width: 10px;
    height: 10px;
    background: #666666;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
`;

type BadgeVariant = 'default' | 'warning' | 'success';

const variantStyles: Record<BadgeVariant, FlattenSimpleInterpolation> = {
  default: css`
    background-color: #1312170f;
    color: var(--primary-color-black-72);
  `,
  warning: css`
    background-color: var(--accent-color-coral-light);
    color: var(--accent-color-coral);
  `,
  success: css`
    background-color: var(--accent-color-leaf-light);
    color: var(--accent-color-leaf);
  `,
};

type Props = {
  $variant: BadgeVariant;
};

// TODO: Move to shared components
export const Badge = styled.div<Props>`
  ${({ $variant }) => variantStyles[$variant]}
  padding: 20px;
  border-radius: 40px;
  flex-grow: 0;
  flex-shrink: 0;
  text-align: center;
  width: 260px;
`;

export const ProposalsWrapper = styled.section`
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const FlowItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
`;

export const FlowDescription = styled(Text)`
  text-align: center;
`;

import styled, { css } from 'styled-components';
import { GovernanceStateIndicator } from 'features/dual-governance/types';

export const BackgroundGradientSvgStyle = styled.svg`
  position: fixed;
  z-index: -1;
  width: 100vw;
  height: calc(100vh + 40%);
  pointer-events: none;
  top: -40%;
  left: -15%;
`;

type GradientProps = {
  $variant: GovernanceStateIndicator;
};

const GradientVariants = {
  start: {
    normal: css`
      stop-color: var(--layout-gradient-start-normal);
    `,
    attention: css`
      stop-color: var(--layout-gradient-start-attention);
    `,
    blocked: css`
      stop-color: var(--layout-gradient-start-blocked);
    `,
  },
  stop: {
    normal: css`
      stop-color: var(--layout-gradient-stop-normal);
    `,
    attention: css`
      stop-color: var(--layout-gradient-stop-attention);
    `,
    blocked: css`
      stop-color: var(--layout-gradient-stop-blocked);
    `,
  },
};

export const BackgroundGradientStartStyle = styled.stop<GradientProps>`
  ${({ $variant }) => GradientVariants.start[$variant]};
`;

export const BackgroundGradientStopStyle = styled.stop<GradientProps>`
  ${({ $variant }) => GradientVariants.stop[$variant]};
`;

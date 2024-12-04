import { VisibleGovernanceState } from 'features/dual-governance/types';
import styled, { css } from 'styled-components';

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
  $variant: VisibleGovernanceState;
};

const GradientVariants = {
  start: {
    [VisibleGovernanceState.Loading]: css`
      stop-color: #fff9f9;
    `,
    [VisibleGovernanceState.Normal]: css`
      stop-color: var(--layout-gradient-start-normal);
    `,
    [VisibleGovernanceState.Warning]: css`
      stop-color: var(--layout-gradient-start-attention);
    `,
    [VisibleGovernanceState.BlockedRageQuit]: css`
      stop-color: var(--layout-gradient-start-blocked);
    `,
    [VisibleGovernanceState.BlockedDeactivation]: css`
      stop-color: var(--layout-gradient-start-blocked);
    `,
    [VisibleGovernanceState.BlockedVetoSignalling]: css`
      stop-color: var(--layout-gradient-start-blocked);
    `,
    [VisibleGovernanceState.Cooldown]: css`
      stop-color: var(--layout-gradient-start-blocked);
    `,
  },
  stop: {
    [VisibleGovernanceState.Loading]: css`
      stop-color: #fff9f9;
    `,
    [VisibleGovernanceState.Normal]: css`
      stop-color: var(--layout-gradient-stop-normal);
    `,
    [VisibleGovernanceState.Warning]: css`
      stop-color: var(--layout-gradient-stop-attention);
    `,
    [VisibleGovernanceState.BlockedRageQuit]: css`
      stop-color: var(--layout-gradient-stop-blocked);
    `,
    [VisibleGovernanceState.BlockedDeactivation]: css`
      stop-color: var(--layout-gradient-stop-blocked);
    `,
    [VisibleGovernanceState.BlockedVetoSignalling]: css`
      stop-color: var(--layout-gradient-stop-blocked);
    `,
    [VisibleGovernanceState.Cooldown]: css`
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

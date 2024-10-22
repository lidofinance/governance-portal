import {
  BackgroundGradientSvgStyle,
  BackgroundGradientStartStyle,
  BackgroundGradientStopStyle,
} from './style';
import { Component } from 'types';
import { useDualGovernanceState } from 'providers/dual-governance-state';

export type BackgroundGradientComponent = Component<
  'svg',
  { width: number; height: number }
>;

// svg gradient looks better than css gradient in some browsers

export const BackgroundGradient: BackgroundGradientComponent = (props) => {
  const { width, height, ...rest } = props;

  const { currentGovernanceState } = useDualGovernanceState();

  if (!currentGovernanceState) return null;

  return (
    <BackgroundGradientSvgStyle>
      <radialGradient id="background-gradient" cx="50%" y="10%">
        <BackgroundGradientStartStyle
          offset="0%"
          $variant={currentGovernanceState}
        />
        <BackgroundGradientStopStyle
          offset="100%"
          $variant={currentGovernanceState}
        />
      </radialGradient>
      <rect
        width={width}
        height={height}
        transform="rotate(-28.8448 1189.71 1017.02)"
        opacity=".5"
        fill="url(#background-gradient)"
      />
    </BackgroundGradientSvgStyle>
  );
};

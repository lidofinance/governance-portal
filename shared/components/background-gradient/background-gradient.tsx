import { VisibleGovernanceState } from '@dg/types';
import {
  BackgroundGradientSvgStyle,
  BackgroundGradientStartStyle,
  BackgroundGradientStopStyle,
} from './style';
import { Component } from 'types';

export type BackgroundGradientComponent = Component<
  'svg',
  { width: number; height: number; state: VisibleGovernanceState }
>;

// svg gradient looks better than css gradient in some browsers

export const BackgroundGradient: BackgroundGradientComponent = (props) => {
  const { width, height, state } = props;

  return (
    <BackgroundGradientSvgStyle>
      <radialGradient id="background-gradient" cx="50%" y="10%">
        <BackgroundGradientStartStyle offset="0%" $variant={state} />
        <BackgroundGradientStopStyle offset="100%" $variant={state} />
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

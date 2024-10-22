import { GovernanceStateIndicator } from 'features/dual-governance/types';

import {
  CurrentStateWrapper,
  StateDescription,
  StateIndicator,
  StateName,
} from './style';

type Props = {
  state: GovernanceStateIndicator;
};

export const StateInfo = ({ state }: Props) => {
  return (
    <>
      <CurrentStateWrapper>
        <StateName>{state}</StateName>
        <StateIndicator $state={state} />
      </CurrentStateWrapper>
      {state === GovernanceStateIndicator.Blocked && (
        <StateDescription>by stETH holders</StateDescription>
      )}
    </>
  );
};

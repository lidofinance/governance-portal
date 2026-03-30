import { VisibleGovernanceState } from '@dg/types';
import {
  StateIndicator,
  StateInfoStyled,
  StateStatus,
} from '../state-info/style';
import { Text } from 'shared/components/text';
import { Link } from '@lidofinance/lido-ui';

export const StateInfo = () => {
  return (
    <StateInfoStyled>
      <Text size={22} weight={300} color="secondary">
        State
      </Text>

      <StateStatus>
        <Text size={34}>Emergency governance</Text>
        <StateIndicator $state={VisibleGovernanceState.Warning} />
      </StateStatus>
      <Text size={22} weight={300}>
        <Link href="#">Emergency Governance</Link> has been activated!
      </Text>
    </StateInfoStyled>
  );
};

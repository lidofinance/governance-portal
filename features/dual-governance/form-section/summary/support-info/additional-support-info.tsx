import { VisibleGovernanceState } from 'features/dual-governance/types';
import { Text } from 'shared/components/text';

type Props = {
  state: VisibleGovernanceState;
  amountTillNextPhasePercent: string;
};

export const AdditionalSupportInfo = (props: Props) => {
  const { state, amountTillNextPhasePercent } = props;

  if (
    state === VisibleGovernanceState.Normal ||
    state === VisibleGovernanceState.NormalWarning ||
    state === VisibleGovernanceState.Cooldown
  ) {
    return (
      <Text color="secondary">
        Veto Signalling starts if{' '}
        <Text as="b" color="primary">
          {amountTillNextPhasePercent}
        </Text>{' '}
        more stETH is added
      </Text>
    );
  }
  return null;
};

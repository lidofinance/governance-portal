import { Text } from 'shared/components/text';
import { AdditionalSupportInfo } from './additional-support-info';
import { DualGovernanceState } from 'features/dual-governance/types';

type Props = {
  dualGovernanceState: DualGovernanceState;
};

export const SupportInfo = ({ dualGovernanceState }: Props) => {
  const {
    visibleState,
    vetoSupportPercent,
    totalStEthInEscrow,
    amountTillNextPhasePercent,
  } = dualGovernanceState;

  return (
    <div>
      <Text size={22} weight={300} color="secondary">
        stETH veto support
      </Text>
      <Text size={34} weight={500}>
        {vetoSupportPercent}
      </Text>
      <Text weight={600}>{totalStEthInEscrow} stETH</Text>
      <AdditionalSupportInfo
        state={visibleState}
        amountTillNextPhasePercent={amountTillNextPhasePercent}
      />
    </div>
  );
};

import { Text } from 'shared/components/text';
import { AdditionalSupportInfo } from './additional-support-info';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { InlineLoader } from '@lidofinance/lido-ui';
import styled from 'styled-components';

const InlineLoaderStyled = styled(InlineLoader)`
  margin-top: 20px;
  height: 50px;
  width: 100%;
`;

export const SupportInfo = () => {
  const {
    vetoSupportPercent,
    totalStEthInEscrow,
    visibleState,
    amountTillNextPhasePercent,
  } = useDualGovernanceContext();

  return (
    <div>
      <Text size={22} weight={300} color="secondary">
        stETH veto support
      </Text>
      {visibleState === VisibleGovernanceState.Loading ? (
        <InlineLoaderStyled />
      ) : (
        <>
          <Text size={34} weight={500}>
            {vetoSupportPercent}
          </Text>
          <Text weight={600}>{totalStEthInEscrow} stETH</Text>
        </>
      )}
      <AdditionalSupportInfo
        state={visibleState}
        amountTillNextPhasePercent={amountTillNextPhasePercent}
      />
    </div>
  );
};

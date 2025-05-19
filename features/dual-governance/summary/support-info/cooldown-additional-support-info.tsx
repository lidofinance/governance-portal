import { format, fromUnixTime } from 'date-fns';
import { useDualGovernanceConfig } from 'features/dual-governance/hooks/use-dual-governance-config';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useMemo } from 'react';
import { Token } from 'shared/blockchain/types';
import { Text } from 'shared/components/text';
import { DGTooltip } from '../../tooltips';
import { formatEth } from '../../../../shared/blockchain/utils';

type Props = {
  amountTillVSPhaseWei: bigint;
};

export const CooldownAdditionalSupportInfo = ({
  amountTillVSPhaseWei,
}: Props) => {
  const { data: dgConfig, isLoading } = useDualGovernanceConfig();
  const {
    detailedState,
    amountTillNextPhasePercent,
    firstSealRageQuitSupport,
  } = useDualGovernanceContext();

  const cooldownEndDate = useMemo(() => {
    if (!dgConfig || !detailedState) return;

    const { vetoCooldownDuration } = dgConfig;
    const { persistedStateEnteredAt } = detailedState;
    const date = fromUnixTime(persistedStateEnteredAt + vetoCooldownDuration);

    return {
      date: format(date, 'MMM d, h:mm a'),
      timezone: format(date, 'zzz'),
    };
  }, [detailedState, dgConfig]);

  if (
    isLoading ||
    amountTillNextPhasePercent === undefined ||
    firstSealRageQuitSupport === undefined
  ) {
    return null;
  }

  if (amountTillVSPhaseWei < 0) {
    return (
      <Text color="secondary">
        VetoSignalling <DGTooltip topic="vetoSignalling" /> starts on{' '}
        <b>{cooldownEndDate?.date}</b> {cooldownEndDate?.timezone} unless stETH
        support decreases below <b>{firstSealRageQuitSupport}%</b>
      </Text>
    );
  }

  return (
    <Text color="secondary">
      VetoSignalling <DGTooltip topic="vetoSignalling" /> starts if{' '}
      <b>
        {formatEth(amountTillVSPhaseWei, 2)} {Token.stETH}
      </b>{' '}
      is added; Otherwise, Normal begins on <b>{cooldownEndDate?.date}</b>
    </Text>
  );
};

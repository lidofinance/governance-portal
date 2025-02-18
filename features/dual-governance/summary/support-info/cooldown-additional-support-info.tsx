import { format, fromUnixTime } from 'date-fns';
import { useDualGovernanceConfig } from 'features/dual-governance/hooks/use-dual-governance-config';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useMemo } from 'react';
import { Token } from 'shared/blockchain/types';
import { Text } from 'shared/components/text';
import { DGTooltip } from '../../tooltips';

export const CooldownAdditionalSupportInfo = () => {
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

  if (amountTillNextPhasePercent < 0) {
    return (
      <Text color="secondary">
        VetoSignalling <DGTooltip topic="vetoSignalling" /> starts on{' '}
        {cooldownEndDate?.date} {cooldownEndDate?.timezone} unless stETH support
        decreases below {firstSealRageQuitSupport}%
      </Text>
    );
  }

  return (
    <Text color="secondary">
      VetoSignalling <DGTooltip topic="vetoSignalling" /> starts if{' '}
      {amountTillNextPhasePercent}% more {Token.stETH} is added; Otherwise,
      Normal begins on {cooldownEndDate?.date}
    </Text>
  );
};

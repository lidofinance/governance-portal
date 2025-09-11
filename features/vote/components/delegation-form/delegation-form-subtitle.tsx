import { Text, useBreakpoint } from '@lidofinance/lido-ui';
import { DelegationSubtitleStyled } from './style';
import { useDelegationFormData } from 'features/vote/providers/delegation-form-context';
import { AragonSmallLogo, SnapshotLogo } from 'shared/components/icons';

export const DelegationFormSubtitle = () => {
  const { mode } = useDelegationFormData();
  const isMobile = useBreakpoint('md');

  if (mode === 'aragon') {
    return (
      <DelegationSubtitleStyled>
        <AragonSmallLogo />
        <Text size={isMobile ? 'sm' : 'md'} weight={700}>
          On Aragon
        </Text>
      </DelegationSubtitleStyled>
    );
  }

  if (mode === 'snapshot') {
    return (
      <DelegationSubtitleStyled>
        <SnapshotLogo />
        <Text size={isMobile ? 'sm' : 'md'} weight={700}>
          On Snapshot
        </Text>
      </DelegationSubtitleStyled>
    );
  }

  return null;
};

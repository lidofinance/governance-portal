import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import GlobalStyle from './global';
import { useRouter } from 'next/router';
import { VisibleGovernanceState } from '../features/dual-governance/types';

// We use the same gray background for voting and easy-track, DG is getting color based on the DG status
export const GlobalStyleOverwrite = () => {
  const { visibleState } = useDualGovernanceStateContext();
  let layoutVariant: VisibleGovernanceState | undefined;

  const { asPath } = useRouter();

  if (asPath.startsWith('/dg')) {
    layoutVariant = visibleState;
  }

  const GlobalStyleComponent = GlobalStyle as any;

  return <GlobalStyleComponent $layoutVariant={layoutVariant} />;
};

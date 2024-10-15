import GlobalStyle from './global';
import { useDualGovernanceState } from '../providers/dual-governance-state';

export const GlobalStyleOverwrite = () => {
  const { currentGovernanceState } = useDualGovernanceState();

  return <GlobalStyle $layoutVariant={currentGovernanceState || 'default'} />;
};

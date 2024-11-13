import GlobalStyle from './global';

export const GlobalStyleOverwrite = () => {
  const currentGovernanceState = 'Normal' as any;

  return <GlobalStyle $layoutVariant={currentGovernanceState || 'default'} />;
};

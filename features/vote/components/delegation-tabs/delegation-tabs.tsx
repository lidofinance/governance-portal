import { VOTE_DELEGATION_PATH, VOTE_DELEGATORS_PATH } from 'constants/urls';
import { useIsDelegate } from '@vote/hooks/use-is-delegate';
import { NoSsrWrapper } from 'shared/components/no-ssr-wrapper';
import { Switch } from '../switch';
import { DelegatorsList } from '../delegators-list';
import { DelegationSettings } from '../delegation-settings';

const NAV_ROUTES = [
  { name: 'Delegate', path: VOTE_DELEGATION_PATH },
  { name: 'Check my delegators', path: VOTE_DELEGATORS_PATH },
];

export type DelegationTabsLayoutProps = {
  mode: 'delegation' | 'customize' | 'delegators';
};

export const DelegationTabs = ({ mode }: DelegationTabsLayoutProps) => {
  const isDelegatorsMode = mode === 'delegators';

  const { data: isDelegate, isLoading } = useIsDelegate();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <NoSsrWrapper>
        {isDelegate && (
          <Switch checked={isDelegatorsMode} routes={NAV_ROUTES} />
        )}
        {isDelegatorsMode ? (
          <DelegatorsList />
        ) : (
          <DelegationSettings customizeMode={mode === 'customize'} />
        )}
      </NoSsrWrapper>
    </>
  );
};

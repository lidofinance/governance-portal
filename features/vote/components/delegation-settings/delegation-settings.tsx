import { Text, useBreakpoint } from '@lidofinance/lido-ui';

import { FormTitle, FormWrap, Wrap } from './style';
import { DelegateFromPublicListProvider } from '@vote/providers/delegate-form-public-list-context';
import { DelegationForm } from '../delegation-form';
import { PublicDelegateList } from '../public-delegate-list';

export const DelegationSettings = () => {
  const isMobile = useBreakpoint('md');

  return (
    <Wrap>
      <DelegateFromPublicListProvider>
        <FormWrap>
          <FormTitle>
            <Text size={isMobile ? 'lg' : 'xl'} weight={700}>
              Delegation
            </Text>
          </FormTitle>
          <DelegationForm />
        </FormWrap>
        <PublicDelegateList />
      </DelegateFromPublicListProvider>
    </Wrap>
  );
};

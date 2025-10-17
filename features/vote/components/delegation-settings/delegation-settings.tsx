import { useState } from 'react';
import { Button, Text, useBreakpoint } from '@lidofinance/lido-ui';

import { FormTitle, FormWrap, Wrap } from './style';
import { DelegateFromPublicListProvider } from 'features/vote/providers/delegate-form-public-list-context';
import { DelegationForm } from '../delegation-form';
import { PublicDelegateList } from '../public-delegate-list';

type Props = {
  customizeMode: boolean;
};

export const DelegationSettings = ({ customizeMode }: Props) => {
  const [isSimpleModeOn, setIsSimpleModeOn] = useState(!customizeMode);
  const isMobile = useBreakpoint('md');

  return (
    <Wrap>
      <DelegateFromPublicListProvider>
        <FormWrap $customizable={!isSimpleModeOn}>
          <FormTitle>
            <Text size={isMobile ? 'lg' : 'xl'} weight={700}>
              Delegation
            </Text>
            {!isSimpleModeOn && (
              <Button
                variant="outlined"
                size="xs"
                onClick={() => setIsSimpleModeOn(true)}
              >
                Back
              </Button>
            )}
          </FormTitle>
          {isSimpleModeOn ? (
            <DelegationForm
              mode="simple"
              onCustomizeClick={() => setIsSimpleModeOn(false)}
            />
          ) : (
            <>
              <DelegationForm mode="Aragon" />
              <DelegationForm mode="Snapshot" />
            </>
          )}
        </FormWrap>
        <PublicDelegateList />
      </DelegateFromPublicListProvider>
    </Wrap>
  );
};

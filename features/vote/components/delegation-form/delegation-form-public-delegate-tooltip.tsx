import { useEffect, useState } from 'react';
import { DelegationFormFootNoteStyled } from './style';
import { PublicDelegate } from 'features/vote/types';
import { useDelegationFormData } from 'features/vote/providers/delegation-form-context';
import { isAddress } from 'viem';
import { getPublicDelegate } from 'features/vote/utils/get-public-delegate';

export const DelegationFormPublicDelegateTooltip = () => {
  const { watch } = useDelegationFormData();
  const [selectedPublicDelegate, setSelectedPublicDelegate] =
    useState<PublicDelegate | null>(null);

  useEffect(() => {
    const { unsubscribe } = watch(({ delegateAddress }) => {
      if (delegateAddress && isAddress(delegateAddress)) {
        const publicDelegate = getPublicDelegate(delegateAddress);

        if (!publicDelegate && selectedPublicDelegate) {
          setSelectedPublicDelegate(null);
        } else if (
          publicDelegate &&
          publicDelegate.address !== selectedPublicDelegate?.address
        ) {
          setSelectedPublicDelegate(publicDelegate);
        }
      } else if (selectedPublicDelegate) {
        setSelectedPublicDelegate(null);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, selectedPublicDelegate]);

  if (!selectedPublicDelegate) return null;

  return (
    <DelegationFormFootNoteStyled>
      Public delegate: <b>{selectedPublicDelegate.name}</b>
    </DelegationFormFootNoteStyled>
  );
};

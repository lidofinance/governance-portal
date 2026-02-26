import { UseFormReturn } from 'react-hook-form';
import { DelegationFormInput } from '../types';
import { useEffect } from 'react';
import { useDelegateFromPublicList } from '../providers/delegate-form-public-list-context';
import { isAddress } from 'viem';

export const useDelegateFormPublicListUpdate = (
  formObject: UseFormReturn<DelegationFormInput>,
) => {
  const { selectedPublicDelegate, onPublicDelegateReset } =
    useDelegateFromPublicList();

  const { getValues, setValue, setFocus } = formObject;

  useEffect(() => {
    const currentValue = getValues('delegateAddress');
    if (
      selectedPublicDelegate &&
      isAddress(selectedPublicDelegate) &&
      currentValue?.toLowerCase() !== selectedPublicDelegate.toLowerCase()
    ) {
      setValue('delegateAddress', selectedPublicDelegate, {
        shouldValidate: true,
      });
      setFocus('delegateAddress');
      onPublicDelegateReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPublicDelegate]);
};

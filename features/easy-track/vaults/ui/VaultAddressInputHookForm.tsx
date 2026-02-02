import { useFormContext, useWatch } from 'react-hook-form';
import { Group } from '../types';
import { useEffect } from 'react';
import { validateAddress } from 'utils/validate-address';
import { useDebounce } from 'shared/hooks/use-debounce';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { DEFAULT_TIER_OPERATOR } from '../constants';

type Props = {
  groupFieldName: string;
  fieldIndex: number;
  allowDuplicateAddresses?: boolean;
  allowDefaultOperatorAddress?: boolean;
  getGroupData: (address: string) => Promise<any | null | undefined>;
  onValidOperatorAddressInput?: (groupData: Group) => void;
  extraValidateFn?: (groupData: Group) => string | undefined;
  onChange?: ((e: any) => void) | undefined;
  addressFieldName?: string;
};

type GroupInput = {
  nodeOperator: string;
};

export const VaultAddressInputHookForm = ({
  groupFieldName,
  fieldIndex,
  allowDuplicateAddresses,
  allowDefaultOperatorAddress = true,
  getGroupData,
  onValidOperatorAddressInput,
  extraValidateFn,
  onChange,
  addressFieldName = 'address',
}: Props) => {
  const { setError, clearErrors, getValues } = useFormContext();

  const fieldName = `${groupFieldName}.${fieldIndex}.${addressFieldName}`;
  const fieldValue = useWatch({ name: fieldName });

  const debouncedAddress = useDebounce(fieldValue, 500);

  const validateAddressSync = (value: string) => {
    if (!value) return;

    const addressErr = validateAddress(value);
    if (addressErr) {
      return addressErr;
    }

    const lowerAddress = value.toLowerCase();

    if (
      !allowDefaultOperatorAddress &&
      lowerAddress === DEFAULT_TIER_OPERATOR
    ) {
      return `Address can not be the default tier operator address`;
    }

    if (!allowDuplicateAddresses) {
      const groupsInputs: GroupInput[] = getValues(groupFieldName);

      const addressInGroupInputIndex = groupsInputs.findIndex(
        ({ nodeOperator }, index) =>
          nodeOperator.toLowerCase() === lowerAddress && fieldIndex !== index,
      );

      if (addressInGroupInputIndex !== -1) {
        return 'Address is already in use by another group within the motion';
      }
    }
  };

  useEffect(() => {
    if (!debouncedAddress) {
      clearErrors(fieldName);
      return;
    }

    const addressErr = validateAddressSync(debouncedAddress);
    if (addressErr) {
      setError(fieldName, { type: 'validate', message: addressErr });
      return;
    }

    let isCurrent = true; // Guard against race conditions

    const fetchAndValidate = async () => {
      const lowerAddress = debouncedAddress.toLowerCase();

      const groupData = await getGroupData(lowerAddress);

      // Check if this effect is still the latest one before setting state
      if (!isCurrent) return;

      if (!groupData) {
        setError(fieldName, {
          type: 'validate',
          message: 'Node operator is not registered in Operator Grid',
        });
        return;
      }

      const extraValidationResult = extraValidateFn?.(groupData);
      if (typeof extraValidationResult === 'string') {
        setError(fieldName, {
          type: 'validate',
          message: extraValidationResult,
        });
        return;
      }

      // Success handling
      onValidOperatorAddressInput?.(groupData as Group);
      clearErrors(fieldName);
    };

    void fetchAndValidate();

    // Cleanup
    return () => {
      isCurrent = false;
    };

    // Only run when the debounced value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAddress]);

  return (
    <InputHookForm
      fieldName={fieldName}
      label="Vault address"
      rules={{ required: 'Field is required' }}
      onChange={onChange}
    />
  );
};

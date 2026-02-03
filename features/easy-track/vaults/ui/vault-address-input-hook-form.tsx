import { useFormContext, useWatch } from 'react-hook-form';
import { VaultData } from '../types';
import { useEffect } from 'react';
import { validateAddress } from 'utils/validate-address';
import { useDebounce } from 'shared/hooks/use-debounce';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { DEFAULT_TIER_OPERATOR } from '../constants';

type Props = {
  vaultsFieldName: string;
  fieldIndex: number;
  allowDuplicateAddresses?: boolean;
  allowDefaultOperatorAddress?: boolean;
  getVaultData: (address: string) => Promise<VaultData | null | undefined>;
  onValidOperatorAddressInput?: (vaultData: VaultData) => void;
  extraValidateFn?: (vaultData: VaultData) => string | undefined;
  onChange?: ((e: any) => void) | undefined;
  addressFieldName?: string;
};

type VaultInput = {
  nodeOperator: string;
};

export const VaultAddressInputHookForm = ({
  vaultsFieldName,
  fieldIndex,
  allowDuplicateAddresses,
  allowDefaultOperatorAddress = true,
  getVaultData,
  onValidOperatorAddressInput,
  extraValidateFn,
  onChange,
  addressFieldName = 'address',
}: Props) => {
  const { setError, clearErrors, getValues } = useFormContext();

  const fieldName = `${vaultsFieldName}.${fieldIndex}.${addressFieldName}`;
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
      const groupsInputs: VaultInput[] = getValues(vaultsFieldName);

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

      const vaultData = await getVaultData(lowerAddress);

      // Check if this effect is still the latest one before setting state
      if (!isCurrent) return;

      if (!vaultData) {
        setError(fieldName, {
          type: 'validate',
          message: 'Node operator is not registered in Operator Grid',
        });
        return;
      }

      const extraValidationResult = extraValidateFn?.(vaultData);
      if (typeof extraValidationResult === 'string') {
        setError(fieldName, {
          type: 'validate',
          message: extraValidationResult,
        });
        return;
      }

      // Success handling
      onValidOperatorAddressInput?.(vaultData);
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

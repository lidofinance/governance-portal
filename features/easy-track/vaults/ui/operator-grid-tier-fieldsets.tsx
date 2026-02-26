import { useFormContext } from 'react-hook-form';
import { formatVaultParam } from '../utils/format-vault-param';
import { BpValueFormatted } from './bp-value-formatted';
import { Fieldset } from '../../start-motion/parts/style';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateUintValue } from '../../utils/validate-uint-value';
import { validateEtherValue } from 'utils/validate-ether-value';
import { MAX_FEE_BP, MAX_RESERVE_RATIO_BP } from '../../constants';
import { parseEther } from 'viem';

type Props = {
  tierArrayFieldName: string;
  fieldIndex: number;
  maxShareLimit: bigint;
};

export const OperatorGridTierFieldsets = ({
  tierArrayFieldName,
  fieldIndex,
  maxShareLimit,
}: Props) => {
  const { getValues } = useFormContext();

  return (
    <>
      <Fieldset>
        <InputHookForm
          type="number"
          fieldName={`${tierArrayFieldName}.${fieldIndex}.shareLimit`}
          label="Share limit"
          disabled={maxShareLimit === 0n}
          rules={{
            required: 'Field is required',
            validate: (value) => {
              const amountError = validateEtherValue(value);
              if (amountError) {
                return amountError;
              }

              const valueBn = parseEther(value);
              if (maxShareLimit < valueBn) {
                return `Value must be less than or equal to ${formatVaultParam(
                  maxShareLimit,
                )}`;
              }

              return true;
            },
          }}
        />
      </Fieldset>

      <Fieldset>
        <InputHookForm
          type="number"
          fieldName={`${tierArrayFieldName}.${fieldIndex}.reserveRatioBP`}
          label="Reserve ratio (BP)"
          rules={{
            required: 'Field is required',
            validate: (value) => {
              const uintError = validateUintValue(value);
              if (uintError) {
                return uintError;
              }

              const valueNum = Number(value);
              if (valueNum === 0) {
                return 'Value must be greater than 0';
              }

              if (valueNum > MAX_RESERVE_RATIO_BP) {
                return `Value must be less than or equal to ${MAX_RESERVE_RATIO_BP}`;
              }

              return true;
            },
          }}
        />
        <BpValueFormatted
          fieldName={`${tierArrayFieldName}.${fieldIndex}.reserveRatioBP`}
          label="Reserve ratio"
        />
      </Fieldset>

      <Fieldset>
        <InputHookForm
          type="number"
          fieldName={`${tierArrayFieldName}.${fieldIndex}.forcedRebalanceThresholdBP`}
          label="Forced rebalance threshold (BP)"
          rules={{
            required: 'Field is required',
            validate: (value) => {
              const uintError = validateUintValue(value);
              if (uintError) {
                return uintError;
              }

              const valueNum = Number(value);
              if (valueNum === 0) {
                return 'Value must be greater than 0';
              }

              const reserveRatioBP = getValues(
                `${tierArrayFieldName}.${fieldIndex}.reserveRatioBP`,
              );

              if (!reserveRatioBP) {
                return 'Please set Reserve ratio BP first';
              }

              if (valueNum + 10 >= Number(reserveRatioBP)) {
                return `Value must be at least 10 BP less than Reserve ratio BP (${reserveRatioBP})`;
              }

              return true;
            },
          }}
        />
        <BpValueFormatted
          fieldName={`${tierArrayFieldName}.${fieldIndex}.forcedRebalanceThresholdBP`}
          label="Forced rebalance threshold"
        />
      </Fieldset>

      <Fieldset>
        <InputHookForm
          fieldName={`${tierArrayFieldName}.${fieldIndex}.infraFeeBP`}
          type="number"
          label="Infra fee (BP)"
          rules={{
            required: 'Field is required',
            validate: (value) => {
              const uintError = validateUintValue(value);
              if (uintError) {
                return uintError;
              }

              if (Number(value) > MAX_FEE_BP) {
                return `Value must be less than or equal to ${MAX_FEE_BP}`;
              }

              return true;
            },
          }}
        />
        <BpValueFormatted
          fieldName={`${tierArrayFieldName}.${fieldIndex}.infraFeeBP`}
          label="Infra fee"
        />
      </Fieldset>

      <Fieldset>
        <InputHookForm
          fieldName={`${tierArrayFieldName}.${fieldIndex}.liquidityFeeBP`}
          type="number"
          label="Liquidity fee (BP)"
          rules={{
            required: 'Field is required',
            validate: (value) => {
              const uintError = validateUintValue(value);
              if (uintError) {
                return uintError;
              }

              if (Number(value) > MAX_FEE_BP) {
                return `Value must be less than or equal to ${MAX_FEE_BP}`;
              }

              return true;
            },
          }}
        />
        <BpValueFormatted
          fieldName={`${tierArrayFieldName}.${fieldIndex}.liquidityFeeBP`}
          label="Liquidity fee"
        />
      </Fieldset>

      <Fieldset>
        <InputHookForm
          fieldName={`${tierArrayFieldName}.${fieldIndex}.reservationFeeBP`}
          type="number"
          label="Reservation liquidity fee (BP)"
          rules={{
            required: 'Field is required',
            validate: (value) => {
              const uintError = validateUintValue(value);
              if (uintError) {
                return uintError;
              }

              if (Number(value) > MAX_FEE_BP) {
                return `Value must be less than or equal to ${MAX_FEE_BP}`;
              }

              return true;
            },
          }}
        />
        <BpValueFormatted
          fieldName={`${tierArrayFieldName}.${fieldIndex}.reservationFeeBP`}
          label="Reservation liquidity fee"
        />
      </Fieldset>
    </>
  );
};

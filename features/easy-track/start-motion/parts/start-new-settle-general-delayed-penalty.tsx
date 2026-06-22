import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { encodeAbiParameters } from 'viem';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { PageLoader } from 'shared/components/page-loader';
import { ValidatedInputHookForm } from 'shared/hook-form/validated-input-hook-form';
import {
  CuratedSettleGeneralDelayedPenalty,
  CSMSettleGeneralDelayedPenalty,
} from 'shared/blockchain/contracts';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { useLidoSDK } from 'providers/lido-sdk';

import { MotionType } from '../../motion-types';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { validateUintValue } from '../../utils/validate-uint-value';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import {
  Fieldset,
  FieldsHeader,
  FieldsHeaderDesc,
  FieldsWrapper,
  MessageBox,
  RemoveItemButton,
} from './style';
import { stakingModuleAbi, accountingAbi } from 'abi/generated';

type Settle = {
  id: string;
  // Auto-resolved from `Accounting.getBondLockNonce(id)`
  nonce: string;
};

type FormData = {
  settles: Settle[];
};

const SETTLE_GENERAL_DELAYED_PENALTY_MAP = {
  [MotionType.CSMSettleGeneralDelayedPenalty]: {
    motionType: MotionType.CSMSettleGeneralDelayedPenalty,
    factory: CSMSettleGeneralDelayedPenalty,
  },
  [MotionType.CuratedSettleGeneralDelayedPenalty]: {
    motionType: MotionType.CuratedSettleGeneralDelayedPenalty,
    factory: CuratedSettleGeneralDelayedPenalty,
  },
} as const;

export const formParts = ({
  motionType,
}: {
  motionType: keyof typeof SETTLE_GENERAL_DELAYED_PENALTY_MAP;
}) =>
  createMotionFormPart({
    motionType: SETTLE_GENERAL_DELAYED_PENALTY_MAP[motionType].motionType,
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<FormData>) => {
      const sortedSettles = [...formData.settles].sort(
        (a, b) => Number(a.id) - Number(b.id),
      );

      const lockInfoList = sortedSettles.map(
        ({ id, nonce }) => [BigInt(id), BigInt(nonce)] as const,
      );

      const encodedCallData = encodeAbiParameters(
        [
          {
            type: 'tuple[]',
            components: [{ type: 'uint256' }, { type: 'uint256' }],
          },
        ],
        [lockInfoList],
      );

      return await contract.write({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory, encodedCallData],
      });
    },
    getDefaultFormData: (): FormData => ({
      settles: [{ id: '', nonce: '' }],
    }),
    Component: ({ fieldNames, submitAction }) => {
      const { chainId } = useLidoSDK();
      const queryClient = useQueryClient();

      const { factory } = SETTLE_GENERAL_DELAYED_PENALTY_MAP[motionType];

      const factoryContract = useReadContract(factory);
      const readModuleContract = useReadContractGetter(stakingModuleAbi);
      const readAccountingContract = useReadContractGetter(accountingAbi);

      const { data: factoryData, isLoading: isFactoryDataLoading } = useQuery({
        queryKey: [`settle-general-delayed-penalty-data`, motionType, chainId],
        queryFn: async () => {
          const [stakingModuleAddress, accountingAddress] = await Promise.all([
            factoryContract.readContract('module'),
            factoryContract.readContract('accounting'),
          ]);

          const nodeOperatorsCount = await readModuleContract(
            stakingModuleAddress,
          )('getNodeOperatorsCount');

          return {
            stakingModuleAddress,
            nodeOperatorsCount: Number(nodeOperatorsCount),
            accountingAddress,
          };
        },
      });

      const { isTrustedCallerConnected, isTrustedCallerLoading } =
        useIsTrustedCaller(factory);

      const fieldsArr = useFieldArray({ name: fieldNames.settles });
      const { watch, setValue } = useFormContext();
      const selectedSettles: Settle[] = watch(fieldNames.settles);

      const handleAddSettle = () => fieldsArr.append({ id: '', nonce: '' });

      const buildLockInfoQuery = (nodeOperatorId: string) => ({
        queryKey: [
          'settle-lock-info',
          chainId,
          factoryData?.accountingAddress,
          nodeOperatorId,
        ],
        queryFn: async () => {
          invariant(
            factoryData?.accountingAddress,
            'accounting address is required to fetch lock info',
          );

          const read = readAccountingContract(factoryData.accountingAddress);
          const [locked, nonce] = await Promise.all([
            read('getLockedBond', [BigInt(nodeOperatorId)]),
            read('getBondLockNonce', [BigInt(nodeOperatorId)]),
          ]);

          return { locked, nonce };
        },
      });

      const fetchLockInfo = (nodeOperatorId: string) => {
        invariant(factoryData, 'factory data is required to fetch lock info');
        return queryClient.fetchQuery(buildLockInfoQuery(nodeOperatorId));
      };

      const validateIdSync = (fieldIndex: number) => (value: string) => {
        const uintError = validateUintValue(value);
        if (uintError) {
          return uintError;
        }

        if (
          factoryData?.nodeOperatorsCount === undefined ||
          Number(value) >= factoryData.nodeOperatorsCount
        ) {
          return 'Invalid node operator ID';
        }

        const isAlreadyInInput = selectedSettles.some(
          ({ id }, index) => id === value && index !== fieldIndex,
        );
        if (isAlreadyInInput) {
          return 'ID is already in use by another settle';
        }

        return undefined;
      };

      // Validates the lock and mirrors the bond-lock nonce into form state.
      // Runs on submit, so the nonce is guaranteed present before populateTx encodes it.
      // The factory requires it to match the current onchain nonce.
      const validateIdAsync = (fieldIndex: number) => async (value: string) => {
        const info = await fetchLockInfo(value);
        if (info?.locked == null || info?.nonce == null) {
          return 'Cannot validate value; failed to fetch bond lock info';
        }

        setValue(
          `${fieldNames.settles}.${fieldIndex}.nonce`,
          info.nonce.toString(),
          { shouldDirty: false },
        );

        if (info.locked === 0n) {
          return 'No delayed penalty to settle for this node operator';
        }

        return undefined;
      };

      if (isTrustedCallerLoading || isFactoryDataLoading) {
        return <PageLoader />;
      }

      if (!isTrustedCallerConnected) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        );
      }

      if (!factoryData?.nodeOperatorsCount) {
        return <MessageBox>There are no node operators</MessageBox>;
      }

      return (
        <>
          {fieldsArr.fields.map((item, fieldIndex) => {
            return (
              <Fragment key={item.id}>
                <FieldsWrapper>
                  <FieldsHeader>
                    {fieldsArr.fields.length > 1 && (
                      <FieldsHeaderDesc>
                        Settle #{fieldIndex + 1}
                      </FieldsHeaderDesc>
                    )}
                    {fieldsArr.fields.length > 1 && (
                      <RemoveItemButton
                        onClick={() => fieldsArr.remove(fieldIndex)}
                      >
                        Remove settle {fieldIndex + 1}
                      </RemoveItemButton>
                    )}
                  </FieldsHeader>

                  <Fieldset>
                    <ValidatedInputHookForm
                      fieldName={`${fieldNames.settles}.${fieldIndex}.id`}
                      label="Node operator ID"
                      validateSync={validateIdSync(fieldIndex)}
                      validateAsync={validateIdAsync(fieldIndex)}
                      rules={{ required: 'Field is required' }}
                    />
                  </Fieldset>
                </FieldsWrapper>
              </Fragment>
            );
          })}

          {selectedSettles.length < factoryData.nodeOperatorsCount && (
            <Fieldset>
              <ButtonIcon
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddSettle}
                icon={<Plus />}
                color="secondary"
              >
                One more settle
              </ButtonIcon>
            </Fieldset>
          )}

          {submitAction}
        </>
      );
    },
  });

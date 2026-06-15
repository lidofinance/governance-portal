import { Fragment, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon, Option } from '@lidofinance/lido-ui';
import { useQuery } from '@tanstack/react-query';
import { encodeAbiParameters } from 'viem';
import { PageLoader } from 'shared/components/page-loader';
import { useLidoSDK } from 'providers/lido-sdk';
import { ValidatedInputHookForm } from 'shared/hook-form/validated-input-hook-form';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { useDebounce } from 'shared/hooks/use-debounce';
import { nodeOperatorsRegistryAbi } from 'abi/generated';
import {
  CreateOrUpdateOperatorGroup as CreateOrUpdateOperatorGroupContract,
  MetaRegistry,
  StakingRouter,
} from 'shared/blockchain/contracts';

import {
  Fieldset,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  ErrorBox,
  MotionInfoBox,
  MessageBox,
} from './style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { MotionType } from '../../motion-types';
import { validateUintValue } from '../../utils/validate-uint-value';
import {
  encodeExternalOperatorData,
  decodeExternalOperatorData,
} from '../../utils/nor-ext-operator-data';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { MAX_BP } from '@easy-track/constants';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import invariant from 'tiny-invariant';

const MAX_NAME_LENGTH = 256;
const ZERO_GROUP_ID = '0';
const FORM_ACTIONS = [
  { value: 'create', label: 'Create new group' },
  { value: 'update', label: 'Update existing group' },
  { value: 'clear', label: 'Clear existing group' },
] as const;

const ABI_PARAMS = [
  { type: 'uint256' },
  {
    type: 'tuple',
    components: [
      { type: 'string' },
      {
        type: 'tuple[]',
        components: [{ type: 'uint64' }, { type: 'uint16' }],
      },
      {
        type: 'tuple[]',
        components: [{ type: 'bytes' }],
      },
    ],
  },
] as const;

type Action = (typeof FORM_ACTIONS)[number]['value'];

type SubOperatorField = {
  nodeOperatorId: string;
  share: string;
};

type ExternalOperatorField = {
  nodeOperatorId: string;
};

type FormData = {
  groupId: string;
  name: string;
  subNodeOperators: SubOperatorField[];
  externalOperators: ExternalOperatorField[];
  // Resolved from `factory.allowedExternalModuleId()` at component mount and
  // mirrored into form state so populateTx (module scope) can read it without
  // its own contract round-trip.
  allowedExternalModuleId: string;
  action: Action;
};

const sortByNodeOperatorId = <T extends { nodeOperatorId: bigint }>(
  items: T[],
) =>
  [...items].sort((a, b) =>
    a.nodeOperatorId < b.nodeOperatorId
      ? -1
      : a.nodeOperatorId > b.nodeOperatorId
        ? 1
        : 0,
  );

const validateNameSync = (value: string) => {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return 'Name is required';
  }

  if (trimmedValue.length > MAX_NAME_LENGTH) {
    return `Name must be at most ${MAX_NAME_LENGTH} characters (current: ${trimmedValue.length})`;
  }

  return undefined;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.CreateOrUpdateOperatorGroup,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<FormData>) => {
    const allowedExternalModuleId = Number(formData.allowedExternalModuleId);

    const isClear = formData.action === 'clear';
    const groupId =
      formData.action === 'create' ? ZERO_GROUP_ID : formData.groupId;
    const groupName = isClear ? '' : formData.name.trim();

    const sortedSubs = isClear
      ? []
      : sortByNodeOperatorId(
          formData.subNodeOperators.map(({ nodeOperatorId, share }) => ({
            nodeOperatorId: BigInt(nodeOperatorId),
            share: Number(share),
          })),
        );

    const sortedExts = isClear
      ? []
      : sortByNodeOperatorId(
          formData.externalOperators.map(({ nodeOperatorId }) => ({
            nodeOperatorId: BigInt(nodeOperatorId),
          })),
        );

    const encodedCallData = encodeAbiParameters(ABI_PARAMS, [
      BigInt(groupId),
      [
        groupName,
        sortedSubs.map((s) => [s.nodeOperatorId, s.share] as const),
        sortedExts.map(
          (e) =>
            [
              encodeExternalOperatorData(
                allowedExternalModuleId,
                e.nodeOperatorId,
              ),
            ] as const,
        ),
      ],
    ]);

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: (): FormData => ({
    groupId: '',
    name: '',
    subNodeOperators: [{ nodeOperatorId: '', share: '' }],
    externalOperators: [],
    allowedExternalModuleId: '',
    action: 'create',
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { chainId } = useLidoSDK();
    const { watch, setValue } = useFormContext();

    const factoryContract = useReadContract(
      CreateOrUpdateOperatorGroupContract,
    );
    const stakingRouter = useReadContract(StakingRouter);
    const metaRegistry = useReadContract(MetaRegistry);

    const readNodeOperatorsRegistry = useReadContractGetter(
      nodeOperatorsRegistryAbi,
    );

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(CreateOrUpdateOperatorGroupContract);

    const subFields = useFieldArray({ name: fieldNames.subNodeOperators });
    const extFields = useFieldArray({ name: fieldNames.externalOperators });

    const selectedAction: Action = watch(fieldNames.action);
    const groupIdValue: string = watch(fieldNames.groupId);
    const subOpsValue: SubOperatorField[] = watch(fieldNames.subNodeOperators);
    const extOpsValue: ExternalOperatorField[] = watch(
      fieldNames.externalOperators,
    );

    const sharesSum = subOpsValue.reduce((acc, { share }) => {
      if (!share) return acc;
      const parsed = Number(share);
      return Number.isFinite(parsed) ? acc + parsed : acc;
    }, 0);
    const isSharesSumInvalid = sharesSum !== 0 && sharesSum !== MAX_BP;

    const {
      data: factoryData,
      isLoading: isFactoryDataLoading,
      error: factoryDataError,
    } = useQuery({
      queryKey: ['create-or-update-operator-group-factory-data', chainId],
      enabled: !!factoryContract.address,
      staleTime: Infinity,
      queryFn: async () => {
        const [curatedModuleAddress, allowedExternalModuleId, groupsCount] =
          await Promise.all([
            factoryContract.readContract('module'),
            factoryContract.readContract('allowedExternalModuleId'),
            metaRegistry.readContract('getOperatorGroupsCount'),
          ]);

        const externalStakingModule = await stakingRouter.readContract(
          'getStakingModule',
          [allowedExternalModuleId],
        );

        if (externalStakingModule === null) {
          throw new Error('External staking module not found');
        }

        const [curatedNodeOperatorsCount, externalNodeOperatorsCount] =
          await Promise.all([
            readNodeOperatorsRegistry(curatedModuleAddress)(
              'getNodeOperatorsCount',
            ),
            readNodeOperatorsRegistry(
              externalStakingModule.stakingModuleAddress,
            )('getNodeOperatorsCount'),
          ]);

        if (curatedNodeOperatorsCount === null) {
          throw new Error('Failed to read curated node operators count');
        }

        const externalModuleName = externalStakingModule.name
          ? `${externalStakingModule.name} (ID: ${allowedExternalModuleId})`
          : `#${allowedExternalModuleId}`;

        return {
          groupsCount: groupsCount ?? 0n,
          curatedModuleAddress,
          allowedExternalModuleId,
          curatedNodeOperatorsCount: Number(curatedNodeOperatorsCount),
          externalNodeOperatorsCount: Number(externalNodeOperatorsCount ?? 0n),
          externalModuleName,
        };
      },
    });

    // Mirror the factory-derived module id into form state so populateTx can
    // read it from `formData` at submit time.
    useEffect(() => {
      if (factoryData) {
        setValue(
          fieldNames.allowedExternalModuleId,
          factoryData.allowedExternalModuleId.toString(),
          { shouldDirty: false },
        );
      }
      // Mirror once factoryData resolves; it never changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [factoryData]);

    const validateGroupIdSync = (value: string) => {
      invariant(factoryData, 'Factory data must be loaded for validation');

      const uintErr = validateUintValue(value);
      if (uintErr) {
        return uintErr;
      }

      if (value === ZERO_GROUP_ID && selectedAction !== 'create') {
        return 'Value must be more than 0';
      }

      if (BigInt(value) > factoryData.groupsCount) {
        return `Value must be less than or equal to ${factoryData.groupsCount.toString()}`;
      }

      return undefined;
    };

    const debouncedGroupIdValue = useDebounce(groupIdValue, 500);
    const { data: existingGroup } = useQuery({
      queryKey: [
        'meta-registry-operator-group',
        chainId,
        debouncedGroupIdValue,
      ],
      enabled:
        !!factoryData &&
        /^\d+$/.test(debouncedGroupIdValue) && // Check is valid digits value
        debouncedGroupIdValue !== ZERO_GROUP_ID,
      staleTime: Infinity,
      queryFn: () => {
        const syncErr = validateGroupIdSync(debouncedGroupIdValue);
        if (syncErr) {
          return null;
        }

        return metaRegistry.readContract('getOperatorGroup', [
          BigInt(debouncedGroupIdValue),
        ]);
      },
    });

    // Apply a group to the definition fields for update/clear
    // Update fills the operators from the group, clear empties them
    const applyGroupDataToFields = (
      action: Exclude<Action, 'create'>,
      group: typeof existingGroup,
    ) => {
      setValue(fieldNames.name, group?.name ?? '');

      if (action === 'update' && group) {
        subFields.replace(
          group.subNodeOperators.map((op) => ({
            nodeOperatorId: op.nodeOperatorId.toString(),
            share: op.share.toString(),
          })),
        );
        extFields.replace(
          group.externalOperators.map((op) => ({
            nodeOperatorId: decodeExternalOperatorData(
              op.data,
            ).nodeOperatorId.toString(),
          })),
        );
        return;
      }

      subFields.replace([]);
      extFields.replace([]);
    };

    const handleActionChange = (action: Action) => {
      if (action === 'create') {
        setValue(fieldNames.groupId, '');
        setValue(fieldNames.name, '');
        subFields.replace([{ nodeOperatorId: '', share: '' }]);
        extFields.replace([]);
      } else {
        applyGroupDataToFields(action, existingGroup);
      }
    };

    // Hydrate the form once group data arrives for the selected update/clear action.
    useEffect(() => {
      if (selectedAction === 'create' || !existingGroup) {
        return;
      }
      applyGroupDataToFields(selectedAction, existingGroup);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingGroup]);

    const validateSubNodeOperatorIdSync = (fieldIndex: number) => {
      return (value: string) => {
        invariant(factoryData, 'Factory data must be loaded for validation');
        const uintErr = validateUintValue(value);
        if (uintErr) {
          return uintErr;
        }

        const dupIndex = subOpsValue.findIndex(
          (op, idx) => op.nodeOperatorId === value && idx !== fieldIndex,
        );
        if (dupIndex !== -1) {
          return 'Value is already used in another sub-operator';
        }

        if (Number(value) >= factoryData.curatedNodeOperatorsCount) {
          return `Value must be less than ${factoryData.curatedNodeOperatorsCount}`;
        }

        return undefined;
      };
    };

    const validateShareSync = (value: string) => {
      const uintErr = validateUintValue(value);
      if (uintErr) return uintErr;

      const share = Number(value);
      if (share > MAX_BP) {
        return `Share must not exceed ${MAX_BP}`;
      }
      return undefined;
    };

    const validateExternalNodeOperatorIdSync = (fieldIndex: number) => {
      return (value: string) => {
        invariant(factoryData, 'Factory data must be loaded for validation');

        const uintErr = validateUintValue(value);
        if (uintErr) {
          return uintErr;
        }

        const dupIndex = extOpsValue.findIndex(
          (op, idx) => op.nodeOperatorId === value && idx !== fieldIndex,
        );

        if (dupIndex !== -1) {
          return 'Node operator ID is already used in another external operator';
        }

        if (Number(value) >= factoryData.externalNodeOperatorsCount) {
          return `Value must be less than ${factoryData.externalNodeOperatorsCount}`;
        }

        return undefined;
      };
    };

    if (isFactoryDataLoading || isTrustedCallerLoading) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    if (factoryDataError || !factoryData) {
      return (
        <ErrorBox>
          {factoryDataError instanceof Error
            ? factoryDataError.message
            : 'Failed to load CreateOrUpdateOperatorGroup factory data'}
        </ErrorBox>
      );
    }

    const isClearAction = selectedAction === 'clear';
    const isRegistryEmpty = factoryData.groupsCount === 0n;

    return (
      <>
        {isRegistryEmpty && (
          <MotionInfoBox>
            Note: group count is 0, so only <b>Create new group</b> action is
            available.
          </MotionInfoBox>
        )}

        <Fieldset>
          <SelectHookForm
            label="Action"
            fieldName={fieldNames.action}
            onChange={(value) => handleActionChange(value as Action)}
            rules={{ required: 'Field is required' }}
          >
            {FORM_ACTIONS.map(({ value, label }) => {
              // Limit to create only when groupCount is 0
              if (isRegistryEmpty && value !== 'create') {
                return null;
              }

              return (
                <Option key={value} value={value}>
                  {label}
                </Option>
              );
            })}
          </SelectHookForm>
        </Fieldset>

        {selectedAction !== 'create' && (
          <Fieldset>
            <ValidatedInputHookForm
              valueType="number"
              fieldName={fieldNames.groupId}
              label={`Group ID (1..${factoryData.groupsCount})`}
              validateSync={validateGroupIdSync}
              rules={{ required: 'Field is required' }}
            />
          </Fieldset>
        )}

        {!isClearAction && (
          <Fieldset>
            <ValidatedInputHookForm
              fieldName={fieldNames.name}
              label="Group name"
              validateSync={validateNameSync}
              rules={{ required: 'Field is required' }}
            />
          </Fieldset>
        )}

        {isClearAction && existingGroup && (
          <MotionInfoBox>
            Clearing group{' '}
            <b>
              {existingGroup.name
                ? `${existingGroup.name} (ID: #${debouncedGroupIdValue})`
                : `#${debouncedGroupIdValue}`}
            </b>
            . Its name and all operators will be removed.
          </MotionInfoBox>
        )}

        {!isClearAction && (
          <>
            {subFields.fields.map((item, fieldIndex) => (
              <Fragment key={item.id}>
                <FieldsWrapper>
                  <FieldsHeader>
                    <FieldsHeaderDesc>
                      Sub-operator #{fieldIndex + 1}
                    </FieldsHeaderDesc>
                    {subFields.fields.length > 1 && (
                      <RemoveItemButton
                        onClick={() => subFields.remove(fieldIndex)}
                      >
                        Remove sub-operator {fieldIndex + 1}
                      </RemoveItemButton>
                    )}
                  </FieldsHeader>

                  <Fieldset>
                    <ValidatedInputHookForm
                      valueType="number"
                      fieldName={`${fieldNames.subNodeOperators}.${fieldIndex}.nodeOperatorId`}
                      label={`ID (0..${factoryData.curatedNodeOperatorsCount - 1})`}
                      validateSync={validateSubNodeOperatorIdSync(fieldIndex)}
                      rules={{ required: 'Field is required' }}
                    />
                  </Fieldset>

                  <Fieldset>
                    <ValidatedInputHookForm
                      valueType="number"
                      fieldName={`${fieldNames.subNodeOperators}.${fieldIndex}.share`}
                      label={`Share (BP, 0..${MAX_BP})`}
                      validateSync={validateShareSync}
                      rules={{ required: 'Field is required' }}
                    />
                  </Fieldset>
                </FieldsWrapper>
              </Fragment>
            ))}

            <Fieldset>
              <ButtonIcon
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  subFields.append({ nodeOperatorId: '', share: '' })
                }
                icon={<Plus />}
                color="secondary"
              >
                One more sub-operator
              </ButtonIcon>
            </Fieldset>

            {extFields.fields.length > 0 && (
              <MotionInfoBox>
                External module: <b>{factoryData.externalModuleName}</b>
              </MotionInfoBox>
            )}

            {extFields.fields.map((item, fieldIndex) => (
              <Fragment key={item.id}>
                <FieldsWrapper>
                  <FieldsHeader>
                    <FieldsHeaderDesc>
                      External operator #{fieldIndex + 1}
                    </FieldsHeaderDesc>
                    <RemoveItemButton
                      onClick={() => extFields.remove(fieldIndex)}
                    >
                      Remove operator {fieldIndex + 1}
                    </RemoveItemButton>
                  </FieldsHeader>

                  <Fieldset>
                    <ValidatedInputHookForm
                      valueType="number"
                      fieldName={`${fieldNames.externalOperators}.${fieldIndex}.nodeOperatorId`}
                      label={`ID (0..${factoryData.externalNodeOperatorsCount - 1})`}
                      validateSync={validateExternalNodeOperatorIdSync(
                        fieldIndex,
                      )}
                      rules={{ required: 'Field is required' }}
                    />
                  </Fieldset>
                </FieldsWrapper>
              </Fragment>
            ))}

            <Fieldset>
              <ButtonIcon
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => extFields.append({ nodeOperatorId: '' })}
                icon={<Plus />}
                color="secondary"
              >
                Add external operator
              </ButtonIcon>
            </Fieldset>
          </>
        )}

        {selectedAction !== 'clear' && (
          <MotionInfoBox $variant={isSharesSumInvalid ? 'error' : undefined}>
            Sub-operator shares sum: <b>{sharesSum}</b> / {MAX_BP}
            {isSharesSumInvalid && (
              <>
                <br />
                Sum must equal {MAX_BP} before submission.
              </>
            )}
          </MotionInfoBox>
        )}

        {submitAction}
      </>
    );
  },
});

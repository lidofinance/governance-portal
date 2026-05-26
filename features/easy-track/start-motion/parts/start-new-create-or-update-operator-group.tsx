import { Fragment, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { encodeAbiParameters } from 'viem';
import { PageLoader } from 'shared/components/page-loader';
import { useLidoSDK } from 'providers/lido-sdk';
import { ValidatedInputHookForm } from 'shared/hook-form/validated-input-hook-form';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { useDebounce } from 'shared/hooks/use-debounce';
import { metaRegistryAbi, nodeOperatorsRegistryAbi } from 'abi/generated';
import {
  CreateOrUpdateOperatorGroup as CreateOrUpdateOperatorGroupContract,
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
  encodeNORExtOperatorData,
  decodeNORExtOperatorData,
} from '../../utils/nor-ext-operator-data';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';

const MAX_BP = 10000;
const MAX_NAME_LENGTH = 256;
const NO_GROUP_ID = '0';

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

export const formParts = createMotionFormPart({
  motionType: MotionType.CreateOrUpdateOperatorGroup,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<FormData>) => {
    const allowedExternalModuleId = Number(formData.allowedExternalModuleId);

    const sortedSubs = sortByNodeOperatorId(
      formData.subNodeOperators.map(({ nodeOperatorId, share }) => ({
        nodeOperatorId: BigInt(nodeOperatorId),
        share: Number(share),
      })),
    );

    const sortedExts = sortByNodeOperatorId(
      formData.externalOperators.map(({ nodeOperatorId }) => ({
        nodeOperatorId: BigInt(nodeOperatorId),
      })),
    );

    const encodedCallData = encodeAbiParameters(
      [
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
      ] as const,
      [
        BigInt(formData.groupId),
        [
          formData.name,
          sortedSubs.map((s) => [s.nodeOperatorId, s.share] as const),
          sortedExts.map(
            (e) =>
              [
                encodeNORExtOperatorData(
                  allowedExternalModuleId,
                  e.nodeOperatorId,
                ),
              ] as const,
          ),
        ],
      ],
    );

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
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { chainId } = useLidoSDK();
    const { watch, setValue } = useFormContext();
    const queryClient = useQueryClient();

    const factoryContract = useReadContract(
      CreateOrUpdateOperatorGroupContract,
    );
    const stakingRouter = useReadContract(StakingRouter);
    const readNodeOperatorsRegistry = useReadContractGetter(
      nodeOperatorsRegistryAbi,
    );
    const readMetaRegistry = useReadContractGetter(metaRegistryAbi);

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(CreateOrUpdateOperatorGroupContract);

    const subFields = useFieldArray({ name: fieldNames.subNodeOperators });
    const extFields = useFieldArray({ name: fieldNames.externalOperators });

    const groupIdValue: string = watch(fieldNames.groupId);
    const subOpsValue: SubOperatorField[] = watch(fieldNames.subNodeOperators);
    const extOpsValue: ExternalOperatorField[] = watch(
      fieldNames.externalOperators,
    );

    const isCreateMode = groupIdValue === NO_GROUP_ID || groupIdValue === '';
    const isClearMode =
      !isCreateMode && subOpsValue.length === 0 && extOpsValue.length === 0;

    const sharesSum = subOpsValue.reduce((acc, { share }) => {
      if (!share) return acc;
      const parsed = Number(share);
      return Number.isFinite(parsed) ? acc + parsed : acc;
    }, 0);

    const {
      data: factoryData,
      isLoading: isFactoryDataLoading,
      error: factoryDataError,
    } = useQuery({
      queryKey: ['create-or-update-operator-group-factory-data', chainId],
      enabled: !!factoryContract.address,
      staleTime: Infinity,
      queryFn: async () => {
        const [
          factoryName,
          metaRegistryAddress,
          curatedModuleAddress,
          allowedExtModuleIdRaw,
        ] = await Promise.all([
          factoryContract.readContract('name'),
          factoryContract.readContract('metaRegistry'),
          factoryContract.readContract('module'),
          factoryContract.readContract('allowedExternalModuleId'),
        ]);

        const allowedExternalModuleId = Number(allowedExtModuleIdRaw);

        const externalStakingModule = await stakingRouter.readContract(
          'getStakingModule',
          [BigInt(allowedExternalModuleId)],
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

        return {
          factoryName,
          metaRegistryAddress,
          curatedModuleAddress,
          allowedExternalModuleId,
          externalModuleAddress: externalStakingModule.stakingModuleAddress,
          curatedNodeOperatorsCount: Number(curatedNodeOperatorsCount),
          externalNodeOperatorsCount: Number(externalNodeOperatorsCount ?? 0n),
        };
      },
    });

    // Mirror the factory-derived module id into form state so populateTx can
    // read it from `formData` at submit time (it has no React context).
    useEffect(() => {
      if (factoryData) {
        setValue(
          fieldNames.allowedExternalModuleId,
          String(factoryData.allowedExternalModuleId),
        );
      }
    }, [factoryData, setValue, fieldNames.allowedExternalModuleId]);

    const debouncedGroupIdValue = useDebounce(groupIdValue, 500);
    const { data: existingGroup } = useQuery({
      queryKey: [
        'meta-registry-operator-group',
        chainId,
        factoryData?.metaRegistryAddress,
        debouncedGroupIdValue,
      ],
      enabled:
        !!factoryData?.metaRegistryAddress &&
        /^\d+$/.test(debouncedGroupIdValue) && // Check is valid digits value
        debouncedGroupIdValue !== NO_GROUP_ID,
      staleTime: Infinity,
      queryFn: () => {
        if (!factoryData) {
          return null;
        }

        return readMetaRegistry(factoryData.metaRegistryAddress)(
          'getOperatorGroup',
          [BigInt(debouncedGroupIdValue)],
        );
      },
    });

    useEffect(() => {
      if (existingGroup) {
        setValue(fieldNames.name, existingGroup.name);
        subFields.replace(
          existingGroup.subNodeOperators.map((op) => ({
            nodeOperatorId: op.nodeOperatorId.toString(),
            share: op.share.toString(),
          })),
        );
        extFields.replace(
          existingGroup.externalOperators.map((op) => ({
            nodeOperatorId: decodeNORExtOperatorData(
              op.data,
            ).nodeOperatorId.toString(),
          })),
        );
        return;
      }

      // Clean sub fields if needed
      if (
        debouncedGroupIdValue === '' ||
        debouncedGroupIdValue === NO_GROUP_ID
      ) {
        setValue(fieldNames.name, '');
        subFields.replace([{ nodeOperatorId: '', share: '' }]);
        extFields.replace([]);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingGroup, debouncedGroupIdValue, setValue, fieldNames.name]);

    const fetchOperatorGroupsCount = () => {
      if (!factoryData) {
        throw new Error('Factory data is required');
      }
      return queryClient.fetchQuery({
        queryKey: [
          'meta-registry-operator-groups-count',
          chainId,
          factoryData.metaRegistryAddress,
        ],
        // Mutable on-chain state — re-read on each validation pass.
        queryFn: () =>
          readMetaRegistry(factoryData.metaRegistryAddress)(
            'getOperatorGroupsCount',
          ),
      });
    };

    const validateGroupIdAsync = async (value: string) => {
      if (!factoryData) return undefined;
      const groupId = BigInt(value);

      const count = await fetchOperatorGroupsCount();
      if (count === null) {
        return 'Failed to read operator groups count';
      }
      if (groupId >= count) {
        return `Group ID must be less than ${count.toString()} (use 0 to create a new group)`;
      }
      return undefined;
    };

    const validateSubNodeOperatorIdSync = (fieldIndex: number) => {
      return (value: string) => {
        const uintErr = validateUintValue(value);
        if (uintErr) return uintErr;

        const dupIndex = subOpsValue.findIndex(
          (op, idx) => op.nodeOperatorId === value && idx !== fieldIndex,
        );
        if (dupIndex !== -1) {
          return 'Node operator ID is already used in another sub-operator';
        }
        return undefined;
      };
    };

    const validateSubNodeOperatorIdAsync = async (value: string) => {
      if (!factoryData) return undefined;
      const id = BigInt(value);
      if (id >= BigInt(factoryData.curatedNodeOperatorsCount)) {
        return `ID must be less than ${factoryData.curatedNodeOperatorsCount}`;
      }
      return undefined;
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

    const validateNameSync = (value: string) => {
      const trimmedValue = value.trim();
      if (isClearMode) {
        if (trimmedValue.length > 0) {
          return 'Name must be empty when clearing a group';
        }
        return undefined;
      }

      if (trimmedValue.length === 0) {
        return 'Name is required';
      }

      if (trimmedValue.length > MAX_NAME_LENGTH) {
        return `Name must be at most ${MAX_NAME_LENGTH} characters (current: ${trimmedValue.length})`;
      }
      return undefined;
    };

    const validateExternalNodeOperatorIdSync = (fieldIndex: number) => {
      return (value: string) => {
        const uintErr = validateUintValue(value);
        if (uintErr) return uintErr;

        const dupIndex = extOpsValue.findIndex(
          (op, idx) => op.nodeOperatorId === value && idx !== fieldIndex,
        );
        if (dupIndex !== -1) {
          return 'Node operator ID is already used in another external operator';
        }
        return undefined;
      };
    };

    const validateExternalNodeOperatorIdAsync = async (value: string) => {
      if (!factoryData) return undefined;
      const id = BigInt(value);
      if (id >= BigInt(factoryData.externalNodeOperatorsCount)) {
        return `ID must be less than ${factoryData.externalNodeOperatorsCount}`;
      }
      return undefined;
    };

    if (isFactoryDataLoading || isTrustedCallerLoading) {
      return <PageLoader />;
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

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    const modeLabel = isCreateMode
      ? 'Create new group'
      : isClearMode
        ? 'Clear existing group'
        : `Update group #${groupIdValue}`;

    return (
      <>
        <MessageBox>
          Factory: <b>{factoryData.factoryName}</b>. Use group ID <b>0</b> to
          create a new group, an existing ID to update or clear one. For create
          and update, sub-operator shares must sum to {MAX_BP}. To clear a
          group, set its ID and remove all sub- and external operators.
          <br />
          Mode: <b>{modeLabel}</b>
        </MessageBox>

        <Fieldset>
          <ValidatedInputHookForm
            valueType="number"
            fieldName={fieldNames.groupId}
            label="Group ID (0 to create new)"
            validateSync={validateUintValue}
            validateAsync={validateGroupIdAsync}
            rules={{ required: 'Field is required' }}
          />
        </Fieldset>

        <Fieldset>
          <ValidatedInputHookForm
            fieldName={fieldNames.name}
            label="Group name"
            validateSync={validateNameSync}
            rules={isClearMode ? undefined : { required: 'Field is required' }}
          />
        </Fieldset>

        {subFields.fields.map((item, fieldIndex) => (
          <Fragment key={item.id}>
            <FieldsWrapper>
              <FieldsHeader>
                <FieldsHeaderDesc>
                  Sub-operator #{fieldIndex + 1}
                </FieldsHeaderDesc>
                {(subFields.fields.length > 1 || !isCreateMode) && (
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
                  label="Node operator ID"
                  validateSync={validateSubNodeOperatorIdSync(fieldIndex)}
                  validateAsync={validateSubNodeOperatorIdAsync}
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
            onClick={() => subFields.append({ nodeOperatorId: '', share: '' })}
            icon={<Plus />}
            color="secondary"
          >
            One more sub-operator
          </ButtonIcon>
        </Fieldset>

        {subOpsValue.length > 0 && (
          <MotionInfoBox $variant={sharesSum === MAX_BP ? undefined : 'error'}>
            Sub-operator shares sum: <b>{sharesSum}</b> / {MAX_BP}
            {sharesSum !== MAX_BP && (
              <>
                <br />
                Sum must equal {MAX_BP} before submission.
              </>
            )}
          </MotionInfoBox>
        )}

        {extFields.fields.map((item, fieldIndex) => (
          <Fragment key={item.id}>
            <FieldsWrapper>
              <FieldsHeader>
                <FieldsHeaderDesc>
                  External operator #{fieldIndex + 1} (NOR module{' '}
                  {factoryData.allowedExternalModuleId})
                </FieldsHeaderDesc>
                <RemoveItemButton onClick={() => extFields.remove(fieldIndex)}>
                  Remove external operator {fieldIndex + 1}
                </RemoveItemButton>
              </FieldsHeader>

              <Fieldset>
                <ValidatedInputHookForm
                  valueType="number"
                  fieldName={`${fieldNames.externalOperators}.${fieldIndex}.nodeOperatorId`}
                  label="External node operator ID"
                  validateSync={validateExternalNodeOperatorIdSync(fieldIndex)}
                  validateAsync={validateExternalNodeOperatorIdAsync}
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

        {submitAction}
      </>
    );
  },
});

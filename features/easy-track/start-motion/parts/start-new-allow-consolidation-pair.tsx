import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { useAccount } from 'wagmi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  encodeAbiParameters,
  encodePacked,
  getAddress,
  parseAbiParameters,
} from 'viem';
import { PageLoader } from 'shared/components/page-loader';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { useLidoSDK } from 'providers/lido-sdk';

import {
  Fieldset,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  ErrorBox,
} from './style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { MotionType } from '../../motion-types';
import { validateUintValue } from '../../utils/validate-uint-value';
import { ValidatedInputHookForm } from 'shared/hook-form/validated-input-hook-form';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { nodeOperatorsRegistryAbi } from 'abi/generated';
import {
  AllowConsolidationPair,
  MetaRegistry,
  StakingRouter,
} from 'shared/blockchain/contracts';
import invariant from 'tiny-invariant';
import { SIGNING_KEYS_ROLE } from '@easy-track/constants';

const NO_GROUP_ID = 0n;

type TargetOperator = {
  id: string;
};

type FormData = {
  submitter: string;
  sourceOperatorId: string;
  targetOperatorIds: TargetOperator[];
};

export const formParts = createMotionFormPart({
  motionType: MotionType.AllowConsolidationPair,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<FormData>) => {
    const sortedTargetIds = formData.targetOperatorIds
      .map(({ id }) => BigInt(id))
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

    const encodedCallData = encodeAbiParameters(
      parseAbiParameters('address, uint256, uint256[]'),
      [
        getAddress(formData.submitter),
        BigInt(formData.sourceOperatorId),
        sortedTargetIds,
      ],
    );

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: (): FormData => ({
    submitter: '',
    sourceOperatorId: '',
    targetOperatorIds: [{ id: '' }],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { chainId } = useLidoSDK();
    const { address: walletAddress } = useAccount();

    const { watch } = useFormContext();
    const queryClient = useQueryClient();
    const targetFields = useFieldArray({ name: fieldNames.targetOperatorIds });
    const selectedTargets: TargetOperator[] = watch(
      fieldNames.targetOperatorIds,
    );

    const stakingRouter = useReadContract(StakingRouter);
    const metaRegistry = useReadContract(MetaRegistry);
    const readNodeOperatorsRegistry = useReadContractGetter(
      nodeOperatorsRegistryAbi,
    );
    const factoryContract = useReadContract(AllowConsolidationPair);

    const {
      data: factoryData,
      isLoading: isFactoryDataLoading,
      error: factoryDataError,
    } = useQuery({
      queryKey: ['allow-consolidation-pair-factory-data', chainId],
      enabled: !!walletAddress && !!factoryContract.address,
      staleTime: Infinity,
      queryFn: async () => {
        const sourceModuleId =
          await factoryContract.readContract('sourceModuleId');
        const sourceStakingModule = await stakingRouter.readContract(
          'getStakingModule',
          [sourceModuleId],
        );

        if (sourceStakingModule === null) {
          throw new Error('Source staking module not found');
        }

        const sourceNodeOperatorsCount = Number(
          await readNodeOperatorsRegistry(
            sourceStakingModule.stakingModuleAddress,
          )('getNodeOperatorsCount'),
        );

        if (sourceNodeOperatorsCount === 0) {
          throw new Error(
            'No node operators found in the source staking module',
          );
        }

        const targetModuleId =
          await factoryContract.readContract('targetModuleId');
        const targetStakingModule = await stakingRouter.readContract(
          'getStakingModule',
          [targetModuleId],
        );

        if (targetStakingModule === null) {
          throw new Error('Target staking module not found');
        }

        const targetNodeOperatorsCount = Number(
          await readNodeOperatorsRegistry(
            targetStakingModule.stakingModuleAddress,
          )('getNodeOperatorsCount'),
        );

        if (targetNodeOperatorsCount === 0) {
          throw new Error(
            'No node operators found in the target staking module',
          );
        }

        return {
          sourceModuleId,
          sourceNodeOperatorsRegistryAddress:
            sourceStakingModule.stakingModuleAddress,
          sourceNodeOperatorsCount,
          targetNodeOperatorsRegistryAddress:
            targetStakingModule.stakingModuleAddress,
          targetNodeOperatorsCount,
        };
      },
    });

    const fetchSourceGroupId = (sourceId: bigint) => {
      invariant(factoryData, 'Factory data is required');
      return queryClient.fetchQuery({
        queryKey: [
          'allow-consolidation-source-group-id',
          chainId,
          factoryData.sourceModuleId.toString(),
          sourceId.toString(),
        ],
        staleTime: Infinity,
        queryFn: () =>
          metaRegistry.readContract('getExternalOperatorGroupId', [
            {
              data: encodePacked(
                ['bytes1', 'uint8', 'uint64'],
                ['0x00', Number(factoryData.sourceModuleId), sourceId],
              ),
            },
          ]),
      });
    };

    const validateSourceIdAsync = async (value: string) => {
      invariant(
        walletAddress,
        'Wallet address is required for source ID validation',
      );
      invariant(
        factoryData,
        'Factory data is required for source ID validation',
      );

      const sourceId = BigInt(value);

      if (sourceId >= factoryData.sourceNodeOperatorsCount) {
        return `ID must be less than ${factoryData.sourceNodeOperatorsCount}`;
      }

      const nodeOperator = await readNodeOperatorsRegistry(
        factoryData.sourceNodeOperatorsRegistryAddress,
      )('getNodeOperator', [sourceId, false]);

      if (nodeOperator === null) {
        return 'Node operator not found';
      }

      const [isActive, , rewardAddress] = nodeOperator;

      if (!isActive) {
        return 'Node operator is not active';
      }

      if (rewardAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        // Check MANAGE_SIGNING_KEYS role
        const canPerform = await readNodeOperatorsRegistry(
          factoryData.sourceNodeOperatorsRegistryAddress,
        )('canPerform', [walletAddress, SIGNING_KEYS_ROLE, [sourceId]]);

        if (!canPerform) {
          return 'To create a motion, you must be the reward address of the source node operator or have MANAGE_SIGNING_KEYS permission for it';
        }
      }

      const sourceGroupId = await fetchSourceGroupId(sourceId);

      if (sourceGroupId === NO_GROUP_ID) {
        return 'Source operator is not linked in MetaRegistry';
      }
    };

    const validateTargetIdSync = (fieldIndex: number) => {
      return (value: string) => {
        const uintErr = validateUintValue(value);
        if (uintErr) {
          return uintErr;
        }

        const idIndexInSelectedTargets = selectedTargets.findIndex(
          ({ id }, index) => id && id === value && fieldIndex !== index,
        );

        if (idIndexInSelectedTargets !== -1) {
          return 'ID is already in use by another update';
        }
      };
    };

    const fetchTargetGroupId = (targetId: bigint) => {
      invariant(factoryData, 'Factory data is required');
      return queryClient.fetchQuery({
        queryKey: [
          'allow-consolidation-target-group-id',
          chainId,
          factoryData.targetNodeOperatorsRegistryAddress,
          targetId.toString(),
        ],
        staleTime: Infinity,
        queryFn: () =>
          metaRegistry.readContract('getNodeOperatorGroupId', [targetId]),
      });
    };

    const validateTargetIdAsync = async (value: string) => {
      invariant(
        walletAddress,
        'Wallet address is required for target ID validation',
      );
      invariant(
        factoryData,
        'Factory data is required for target ID validation',
      );

      const targetId = BigInt(value);

      if (targetId >= factoryData.targetNodeOperatorsCount) {
        return `ID must be less than ${factoryData.targetNodeOperatorsCount}`;
      }

      const isActive = await readNodeOperatorsRegistry(
        factoryData.targetNodeOperatorsRegistryAddress,
      )('getNodeOperatorIsActive', [targetId]);

      if (!isActive) {
        return 'Node operator is not active';
      }

      const sourceIdValue = watch(fieldNames.sourceOperatorId);
      if (!sourceIdValue) {
        return 'Source operator ID must be set first';
      }

      const sourceGroupId = await fetchSourceGroupId(BigInt(sourceIdValue));
      if (sourceGroupId === NO_GROUP_ID) {
        return 'Source operator is not linked in MetaRegistry';
      }

      const targetGroupId = await fetchTargetGroupId(targetId);

      if (targetGroupId !== sourceGroupId) {
        return 'Target operator is not in the same MetaRegistry group as the source';
      }
    };

    if (isFactoryDataLoading) {
      return <PageLoader />;
    }

    if (factoryDataError || !factoryData) {
      return (
        <ErrorBox>
          {factoryDataError instanceof Error
            ? factoryDataError.message
            : 'Failed to load AllowConsolidationPair factory data'}
        </ErrorBox>
      );
    }

    return (
      <>
        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.submitter}
            label="Consolidation manager address"
            rules={{
              required: 'Field is required',
              validate: (value) => validateAddress(value) ?? true,
            }}
          />
        </Fieldset>

        <Fieldset>
          <ValidatedInputHookForm
            valueType="number"
            fieldName={fieldNames.sourceOperatorId}
            label="Source node operator ID"
            validateSync={validateUintValue}
            validateAsync={validateSourceIdAsync}
            rules={{ required: 'Field is required' }}
          />
        </Fieldset>

        {targetFields.fields.map((item, fieldIndex) => (
          <Fragment key={item.id}>
            <FieldsWrapper>
              <FieldsHeader>
                <FieldsHeaderDesc>
                  Target sub-operator #{fieldIndex + 1}
                </FieldsHeaderDesc>
                {targetFields.fields.length > 1 && (
                  <RemoveItemButton
                    onClick={() => targetFields.remove(fieldIndex)}
                  >
                    Remove target {fieldIndex + 1}
                  </RemoveItemButton>
                )}
              </FieldsHeader>

              <Fieldset>
                <ValidatedInputHookForm
                  valueType="number"
                  fieldName={`${fieldNames.targetOperatorIds}.${fieldIndex}.id`}
                  label="Target sub-operator ID"
                  validateSync={validateTargetIdSync(fieldIndex)}
                  validateAsync={validateTargetIdAsync}
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
            onClick={() => targetFields.append({ id: '' })}
            icon={<Plus />}
            color="secondary"
          >
            One more target sub-operator
          </ButtonIcon>
        </Fieldset>

        {submitAction}
      </>
    );
  },
});

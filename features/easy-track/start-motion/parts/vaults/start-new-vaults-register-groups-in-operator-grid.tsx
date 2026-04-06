import { encodeAbiParameters, getAddress, parseEther } from 'viem';

import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { PageLoader } from 'shared/components/page-loader';

import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  MotionInfoBox,
} from '../style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from '../create-motion-form-part';
import { MotionType } from '@easy-track/motion-types';
import { GridGroup } from '@easy-track/vaults/types';
import {
  DEFAULT_TIER_OPERATOR,
  EMPTY_GROUP,
  PREDEFINED_CONSTANT_TIER_PARAMS,
  TIER_ABI_COMPONENTS,
} from '@easy-track/vaults/constants';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { RegisterGroupsInOperatorGrid } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { useOperatorGridInfo } from '@easy-track/vaults/hooks/use-operator-grid-info';
import { useOperatorGridGroupMap } from '@easy-track/vaults/hooks/use-operator-grid-group-map';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { PredefinedGroupParamsPicker } from '@easy-track/vaults/ui/predefined-group-params-picker';
import { validateEtherValue } from 'utils/validate-ether-value';
import { formatVaultParam } from '@easy-track/vaults/utils/format-vault-param';
import { OperatorGridAddTiersFieldsWrapper } from '@easy-track/vaults/ui/operator-grid-add-tiers-fields-wrapper';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';

export const formParts = createMotionFormPart({
  motionType: MotionType.RegisterGroupsInOperatorGrid,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    groups: GridGroup[];
  }>) => {
    const sortedGroups = formData.groups.sort((a, b) =>
      a.nodeOperator.toLowerCase().localeCompare(b.nodeOperator.toLowerCase()),
    );

    const encodedCallData = encodeAbiParameters(
      [
        { type: 'address[]' },
        { type: 'uint256[]' },
        { type: 'tuple[][]', components: TIER_ABI_COMPONENTS },
      ] as const,
      [
        sortedGroups.map((group) => getAddress(group.nodeOperator)),
        sortedGroups.map((group) => parseEther(group.shareLimit)),
        sortedGroups.map((group) =>
          group.tiers.map(
            (tier) =>
              [
                parseEther(tier.shareLimit),
                BigInt(tier.reserveRatioBP),
                BigInt(tier.forcedRebalanceThresholdBP),
                BigInt(tier.infraFeeBP),
                BigInt(tier.liquidityFeeBP),
                BigInt(tier.reservationFeeBP),
              ] as const,
          ),
        ),
      ],
    );

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: () => ({
    groups: [{ ...EMPTY_GROUP }] as GridGroup[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { chainId } = useLidoSDK();

    const registerGroupsInOperatorGrid = useReadContract(
      RegisterGroupsInOperatorGrid,
    );

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(RegisterGroupsInOperatorGrid);

    const { data: maxShareLimit, isLoading: isFactoryDataLoading } = useQuery({
      queryKey: ['register-groups-factory', chainId],
      queryFn: async () => {
        return await registerGroupsInOperatorGrid.readContract('maxShareLimit');
      },
    });

    const { data: operatorGridInfo, isLoading: isOperatorGridInfoLoading } =
      useOperatorGridInfo();

    const { getOperatorGridGroup } = useOperatorGridGroupMap();

    const groupsFieldArray = useFieldArray({ name: fieldNames.groups });

    const { watch, getValues } = useFormContext();
    const groupsInput: GridGroup[] = watch(fieldNames.groups);

    const groupsShareLimitsSum = groupsInput.map((group) => {
      return group.tiers.reduce((acc, tier) => {
        if (!tier.shareLimit) {
          return acc;
        }
        return acc + parseEther(tier.shareLimit);
      }, 0n);
    });

    const handleAddGroup = () => groupsFieldArray.append({ ...EMPTY_GROUP });

    if (
      isFactoryDataLoading ||
      isOperatorGridInfoLoading ||
      isTrustedCallerLoading
    ) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    const groupCount = operatorGridInfo?.nodeOperatorCount ?? 0;

    return (
      <>
        {groupsFieldArray.fields.map((item, groupIndex) => {
          const groupNumber = groupCount + groupIndex + 1;
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  <FieldsHeaderDesc>Group #{groupNumber}</FieldsHeaderDesc>
                  {groupsFieldArray.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => groupsFieldArray.remove(groupIndex)}
                    >
                      Remove group {groupNumber}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <InputHookForm
                    fieldName={`${fieldNames.groups}.${groupIndex}.nodeOperator`}
                    label="Node operator address"
                    rules={{
                      required: 'Field is required',
                      validate: async (value) => {
                        const addressErr = validateAddress(value);
                        if (addressErr) {
                          return addressErr;
                        }

                        const lowerAddress = value.toLowerCase();

                        if (lowerAddress === DEFAULT_TIER_OPERATOR) {
                          return `Address can not be the default tier operator address`;
                        }

                        const addressInGroupInputIndex = groupsInput.findIndex(
                          ({ nodeOperator }, index) =>
                            nodeOperator.toLowerCase() === lowerAddress &&
                            groupIndex !== index,
                        );

                        if (addressInGroupInputIndex !== -1) {
                          return 'Address is already in use by another group within the motion';
                        }

                        const groupData =
                          await getOperatorGridGroup(lowerAddress);

                        if (groupData) {
                          return 'Address is already registered in Operator Grid';
                        }

                        return true;
                      },
                    }}
                  />
                </Fieldset>

                <PredefinedGroupParamsPicker
                  onSelect={(groupOption) => {
                    groupsFieldArray.update(groupIndex, {
                      nodeOperator: getValues(
                        `${fieldNames.groups}.${groupIndex}.nodeOperator`,
                      ),
                      shareLimit: groupOption.shareLimit.toString(),
                      tiers: groupOption.tiers.map((tier) => ({
                        shareLimit: tier.shareLimit.toString(),
                        reserveRatioBP: tier.reserveRatioBP.toString(),
                        forcedRebalanceThresholdBP:
                          tier.forcedRebalanceThresholdBP.toString(),
                        infraFeeBP:
                          PREDEFINED_CONSTANT_TIER_PARAMS.infraFeeBP.toString(),
                        liquidityFeeBP:
                          PREDEFINED_CONSTANT_TIER_PARAMS.liquidityFeeBP.toString(),
                        reservationFeeBP:
                          PREDEFINED_CONSTANT_TIER_PARAMS.reservationFeeBP.toString(),
                      })),
                    });
                  }}
                />

                <Fieldset>
                  <InputNumberHookForm
                    fieldName={`${fieldNames.groups}.${groupIndex}.shareLimit`}
                    label="Share limit"
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const amountError = validateEtherValue(value);
                        if (amountError) {
                          return amountError;
                        }

                        if (
                          maxShareLimit &&
                          maxShareLimit < parseEther(value)
                        ) {
                          return `Value must be less than or equal to ${formatVaultParam(
                            maxShareLimit,
                          )}`;
                        }

                        return true;
                      },
                    }}
                  />
                </Fieldset>
                <OperatorGridAddTiersFieldsWrapper
                  tierArrayFieldName={`${fieldNames.groups}.${groupIndex}.tiers`}
                  groupTiersCount={0}
                />
                {groupsShareLimitsSum[groupIndex] > 0 && (
                  <MotionInfoBox>
                    Sum of tier share limits:
                    {formatVaultParam(groupsShareLimitsSum[groupIndex])}
                    {groupsInput[groupIndex].shareLimit && (
                      <>
                        <br />
                        Group share limit:{' '}
                        {formatVaultParam(
                          parseEther(groupsInput[groupIndex].shareLimit),
                        )}
                      </>
                    )}
                  </MotionInfoBox>
                )}
              </FieldsWrapper>
            </Fragment>
          );
        })}

        <Fieldset>
          <ButtonIcon
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddGroup}
            icon={<Plus />}
            color="secondary"
          >
            One more group
          </ButtonIcon>
        </Fieldset>

        {submitAction}
      </>
    );
  },
});

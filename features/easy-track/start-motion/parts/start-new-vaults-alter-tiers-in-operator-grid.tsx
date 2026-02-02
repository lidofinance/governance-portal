import { utils } from 'ethers';

import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon, Option, Loader } from '@lidofinance/lido-ui';
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  MotionInfoBox,
} from './style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { MotionType } from '../../motion-types';
import { TierParams } from '../../vaults/types';
import {
  DEFAULT_TIER_OPERATOR,
  EMPTY_TIER,
} from 'features/easy-track/vaults/constants';
import { Address, Hex } from 'viem';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { AlterTiersInOperatorGrid } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useOperatorGridInfo } from '../../vaults/hooks/use-operator-grid-info';
import { useOperatorGridGroupMap } from '../../vaults/hooks/use-operator-grid-group-map';
import { useOperatorGridTierMap } from '../../vaults/hooks/use-operator-grid-tier-map';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { VaultAddressInputHookForm } from '../../vaults/ui/VaultAddressInputHookForm';
import { convertShareLimitToInputValue } from '../../vaults/utils/convert-share-limit-to-input-value';
import { OperatorGridTierFieldsets } from '../../vaults/ui/operator-grid-tier-fieldsets';

type TierInput = {
  nodeOperator: string;
  tierId: string;
} & TierParams;

export const formParts = createMotionFormPart({
  motionType: MotionType.AlterTiersInOperatorGrid,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    tiers: TierInput[];
  }>) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['uint256[]', 'tuple(uint256,uint256,uint256,uint256,uint256,uint256)[]'],
      [
        formData.tiers.map((tier) => Number(tier.tierId)),
        formData.tiers.map((tier) => {
          return [
            utils.parseEther(tier.shareLimit),
            Number(tier.reserveRatioBP),
            Number(tier.forcedRebalanceThresholdBP),
            Number(tier.infraFeeBP),
            Number(tier.liquidityFeeBP),
            Number(tier.reservationFeeBP),
          ];
        }),
      ],
    );

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory as Address, encodedCallData as Hex],
    });
  },
  getDefaultFormData: () => ({
    tiers: [{ nodeOperator: '', tierId: '', ...EMPTY_TIER }] as TierInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { chainId } = useLidoSDK();
    const factoryContract = useReadContract(AlterTiersInOperatorGrid);

    const { data: factoryData, isLoading: isFactoryDataLoading } = useQuery({
      queryKey: ['alter-tiers-factory-data', chainId],
      queryFn: async () => {
        return await factoryContract.readContract('defaultTierMaxShareLimit');
      },
      staleTime: Infinity,
    });

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(AlterTiersInOperatorGrid);

    const { data: operatorGridInfo, isLoading: isOperatorGridLoading } =
      useOperatorGridInfo();

    const { groupMap, getOperatorGridGroup } = useOperatorGridGroupMap();

    const { getOperatorGridTier } = useOperatorGridTierMap(
      operatorGridInfo?.tiersCount,
    );

    const tiersFieldArray = useFieldArray({ name: fieldNames.tiers });
    const { watch, setValue, resetField } = useFormContext();
    const tiersInput: TierInput[] = watch(fieldNames.tiers);

    const handleAddTier = () =>
      tiersFieldArray.append({ nodeOperator: '', tierId: '', ...EMPTY_TIER });

    const setTierParam = (key: string, value: string) => {
      setValue(key, value, { shouldValidate: true, shouldDirty: true });
    };

    const getFilteredTierIdOptions = (fieldIdx: number) => {
      const tierIds =
        groupMap[tiersInput[fieldIdx]?.nodeOperator.toLowerCase()]?.tierIds;
      if (!Array.isArray(tierIds)) {
        return [];
      }
      const selectedIds = tiersInput.map(({ tierId }) => parseInt(tierId));
      const thisId = parseInt(tiersInput[fieldIdx]?.tierId);
      return tierIds.filter((tierId) => {
        const tierIdNum = Number(tierId.toString());
        return tierIdNum === thisId || !selectedIds.includes(tierIdNum);
      });
    };

    if (
      isFactoryDataLoading ||
      isOperatorGridLoading ||
      isTrustedCallerLoading
    ) {
      return <Loader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    if (!operatorGridInfo || !operatorGridInfo.tiersCount) {
      return <MessageBox>No tiers in the operator grid to alter</MessageBox>;
    }

    return (
      <>
        <MotionInfoBox>
          Note: to alter default tier with global tierId 0, use default tier
          operator address address — {DEFAULT_TIER_OPERATOR}
        </MotionInfoBox>
        {tiersFieldArray.fields.map((item, tierIndex) => {
          const groupData =
            groupMap[tiersInput[tierIndex]?.nodeOperator.toLowerCase()];

          const groupShareLimit =
            groupData?.operator.toLowerCase() === DEFAULT_TIER_OPERATOR
              ? factoryData
              : groupData?.shareLimit;

          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {tiersFieldArray.fields.length > 1 && (
                    <FieldsHeaderDesc>Update #{tierIndex + 1}</FieldsHeaderDesc>
                  )}
                  {tiersFieldArray.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => tiersFieldArray.remove(tierIndex)}
                    >
                      Remove update {tierIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <VaultAddressInputHookForm
                    groupFieldName={fieldNames.tiers}
                    fieldIndex={tierIndex}
                    getGroupData={getOperatorGridGroup}
                    allowDuplicateAddresses
                    onChange={() =>
                      resetField(`${fieldNames.tiers}.${tierIndex}.tierId`)
                    }
                  />
                </Fieldset>

                <Fieldset>
                  <SelectHookForm
                    label="Tier to alter"
                    fieldName={`${fieldNames.tiers}.${tierIndex}.tierId`}
                    rules={{ required: 'Field is required' }}
                    disabled={!groupData}
                    onChange={(value) => {
                      void getOperatorGridTier(String(value)).then((tier) => {
                        if (tier) {
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.shareLimit`,
                            convertShareLimitToInputValue(tier.shareLimit),
                          );
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.reserveRatioBP`,
                            tier.reserveRatioBP.toString(),
                          );
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.forcedRebalanceThresholdBP`,
                            tier.forcedRebalanceThresholdBP.toString(),
                          );
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.infraFeeBP`,
                            tier.infraFeeBP.toString(),
                          );
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.liquidityFeeBP`,
                            tier.liquidityFeeBP.toString(),
                          );
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.reservationFeeBP`,
                            tier.reservationFeeBP.toString(),
                          );
                        }
                      });
                    }}
                  >
                    {getFilteredTierIdOptions(tierIndex).map((tierId, i) => (
                      <Option key={i} value={Number(tierId.toString())}>
                        {`#${i + 1} (global tierId = ${tierId})`}
                      </Option>
                    ))}
                  </SelectHookForm>
                </Fieldset>
                <>
                  {groupShareLimit && (
                    <OperatorGridTierFieldsets
                      tierArrayFieldName={fieldNames.tiers}
                      fieldIndex={tierIndex}
                      maxShareLimit={groupShareLimit}
                    />
                  )}
                </>
              </FieldsWrapper>
            </Fragment>
          );
        })}

        <Fieldset>
          <ButtonIcon
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddTier}
            icon={<Plus />}
            color="secondary"
          >
            One more update
          </ButtonIcon>
        </Fieldset>

        {submitAction}
      </>
    );
  },
});

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
import { TierParams } from '@easy-track/vaults/types';
import {
  DEFAULT_TIER_OPERATOR,
  EMPTY_TIER,
  PREDEFINED_CONSTANT_TIER_PARAMS,
} from '@easy-track/vaults/constants';
import { encodeAbiParameters, parseAbiParameters, parseEther } from 'viem';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { AlterTiersInOperatorGrid } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useOperatorGridInfo } from '@easy-track/vaults/hooks/use-operator-grid-info';
import { useOperatorGridGroupMap } from '@easy-track/vaults/hooks/use-operator-grid-group-map';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { OperatorGridAddressInputHookForm } from '@easy-track/vaults/ui/operator-grid-address-input-hook-form';
import { OperatorGridEditTiersFieldsWrapper } from '@easy-track/vaults/ui/operator-grid-edit-tiers-fields-wrapper';
import { PredefinedGroupParamsPicker } from '@easy-track/vaults/ui/predefined-group-params-picker';
import { useOperatorGridTierMap } from '@easy-track/vaults/hooks/use-operator-grid-tier-map';
import { MAX_SHARE_LIMIT } from '@easy-track/constants';

type TierInput = {
  nodeOperator: string;
  tiers: ({
    tierId: string;
  } & TierParams)[];
};

export const formParts = createMotionFormPart({
  motionType: MotionType.AlterTiersInOperatorGrid,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    groups: TierInput[];
  }>) => {
    const flatTiers = formData.groups.flatMap(({ tiers }) => tiers);

    const encodedCallData = encodeAbiParameters(
      parseAbiParameters(
        'uint256[], (uint256,uint256,uint256,uint256,uint256,uint256)[]',
      ),
      [
        flatTiers.map((tier) => BigInt(tier.tierId)),
        flatTiers.map(
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
      ],
    );

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: () => ({
    groups: [
      { nodeOperator: '', tiers: [{ tierId: '', ...EMPTY_TIER }] },
    ] as TierInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { chainId } = useLidoSDK();
    const factoryContract = useReadContract(AlterTiersInOperatorGrid);

    const { data: defaultTierMaxShareLimit, isLoading: isFactoryDataLoading } =
      useQuery({
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

    const groupsFieldArray = useFieldArray({ name: fieldNames.groups });
    const { watch, resetField, setValue } = useFormContext();
    const groupsInput: TierInput[] = watch(fieldNames.groups);

    const handleAddTier = () =>
      groupsFieldArray.append({
        nodeOperator: '',
        tiers: [{ tierId: '', ...EMPTY_TIER }],
      } as TierInput);

    if (
      isFactoryDataLoading ||
      isOperatorGridLoading ||
      isTrustedCallerLoading
    ) {
      return <PageLoader />;
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
          operator address — {DEFAULT_TIER_OPERATOR}
        </MotionInfoBox>
        {groupsFieldArray.fields.map((item, groupIndex) => {
          const groupData =
            groupMap[groupsInput[groupIndex]?.nodeOperator.toLowerCase()];

          const groupShareLimit =
            groupData?.operator.toLowerCase() === DEFAULT_TIER_OPERATOR
              ? defaultTierMaxShareLimit
              : MAX_SHARE_LIMIT;

          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {groupsFieldArray.fields.length > 1 && (
                    <FieldsHeaderDesc>
                      Update #{groupIndex + 1}
                    </FieldsHeaderDesc>
                  )}
                  {groupsFieldArray.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => groupsFieldArray.remove(groupIndex)}
                    >
                      Remove update {groupIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <OperatorGridAddressInputHookForm
                    groupFieldName={fieldNames.groups}
                    fieldIndex={groupIndex}
                    getGroupData={getOperatorGridGroup}
                    onChange={() =>
                      resetField(`${fieldNames.groups}.${groupIndex}.tiers`)
                    }
                  />
                </Fieldset>

                {!!groupData?.tierIds && (
                  <>
                    <PredefinedGroupParamsPicker
                      title={'Predefined tier setups (for up to 5 tiers)'}
                      upgradeMode
                      onSelect={(groupOption) => {
                        const tiersToUpdate = groupOption.tiers.slice(
                          0,
                          groupData.tierIds.length,
                        );
                        setValue(
                          `${fieldNames.groups}.${groupIndex}.tiers`,
                          tiersToUpdate.map((tier, index) => ({
                            tierId: groupData.tierIds[index].toString(),
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
                          { shouldValidate: true, shouldDirty: true },
                        );
                      }}
                    />
                    <OperatorGridEditTiersFieldsWrapper
                      tierArrayFieldName={`${fieldNames.groups}.${groupIndex}.tiers`}
                      maxShareLimit={groupShareLimit}
                      currentTierIds={groupData.tierIds}
                      getOperatorGridTier={getOperatorGridTier}
                    />
                  </>
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

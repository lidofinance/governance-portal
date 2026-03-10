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
} from '../style';
import { MotionType } from '@easy-track/motion-types';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from '@easy-track/start-motion/parts/create-motion-form-part';
import { GridGroup } from '@easy-track/vaults/types';
import { encodeAbiParameters, getAddress, parseEther } from 'viem';
import {
  EMPTY_TIER,
  PREDEFINED_CONSTANT_TIER_PARAMS,
  TIER_ABI_COMPONENTS,
} from '@easy-track/vaults/constants';
import { useOperatorGridGroupMap } from '@easy-track/vaults/hooks/use-operator-grid-group-map';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { RegisterTiersInOperatorGrid } from 'shared/blockchain/contracts';
import { OperatorGridAddressInputHookForm } from '@easy-track/vaults/ui/operator-grid-address-input-hook-form';
import { OperatorGridAddTiersFieldsWrapper } from '@easy-track/vaults/ui/operator-grid-add-tiers-fields-wrapper';
import { PredefinedGroupParamsPicker } from '@easy-track/vaults/ui/predefined-group-params-picker';

type GroupInput = Omit<GridGroup, 'shareLimit'>;

export const formParts = createMotionFormPart({
  motionType: MotionType.RegisterTiersInOperatorGrid,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    groups: GroupInput[];
  }>) => {
    const encodedCallData = encodeAbiParameters(
      [
        { type: 'address[]' },
        { type: 'tuple[][]', components: TIER_ABI_COMPONENTS },
      ] as const,
      [
        formData.groups.map((group) => getAddress(group.nodeOperator)),
        formData.groups.map((group) =>
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
    groups: [{ nodeOperator: '', tiers: [{ ...EMPTY_TIER }] }] as GroupInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { groupMap, getOperatorGridGroup } = useOperatorGridGroupMap();

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(RegisterTiersInOperatorGrid);

    const groupsFieldArray = useFieldArray({ name: fieldNames.groups });
    const { watch, getValues } = useFormContext();
    const groupsInput: GroupInput[] = watch(fieldNames.groups);

    const handleAddGroup = () =>
      groupsFieldArray.append({ nodeOperator: '', tiers: [{ ...EMPTY_TIER }] });

    if (isTrustedCallerLoading) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    return (
      <>
        {groupsFieldArray.fields.map((item, groupIndex) => {
          const entityInMap =
            groupMap[groupsInput[groupIndex].nodeOperator.toLowerCase()];
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {groupsFieldArray.fields.length > 1 && (
                    <FieldsHeaderDesc>Group #{groupIndex + 1}</FieldsHeaderDesc>
                  )}
                  {groupsFieldArray.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => groupsFieldArray.remove(groupIndex)}
                    >
                      Remove group {groupIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <OperatorGridAddressInputHookForm
                    groupFieldName={fieldNames.groups}
                    fieldIndex={groupIndex}
                    getGroupData={getOperatorGridGroup}
                    allowDefaultOperatorAddress={false}
                  />
                </Fieldset>

                <PredefinedGroupParamsPicker
                  onSelect={(groupOption) => {
                    // For phase III we need to add all tiers except first one, which was added in Phase I
                    const tiersToAdd = groupOption.tiers.slice(1);

                    groupsFieldArray.update(groupIndex, {
                      nodeOperator: getValues(
                        `${fieldNames.groups}.${groupIndex}.nodeOperator`,
                      ),
                      tiers: tiersToAdd.map((tier) => ({
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

                <OperatorGridAddTiersFieldsWrapper
                  tierArrayFieldName={`${fieldNames.groups}.${groupIndex}.tiers`}
                  maxShareLimit={entityInMap?.shareLimit}
                  groupTiersCount={entityInMap?.tierIds.length}
                />
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

import { utils } from 'ethers';

import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon, Loader } from '@lidofinance/lido-ui';

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
import { Address, Hex } from 'viem';
import { EMPTY_TIER } from '@easy-track/vaults/constants';
import { useOperatorGridGroupMap } from '@easy-track/vaults/hooks/use-operator-grid-group-map';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { RegisterTiersInOperatorGrid } from 'shared/blockchain/contracts';
import { OperatorGridAddressInputHookForm } from '@easy-track/vaults/ui/operator-grid-address-input-hook-form';
import { OperatorGridAddTiersFieldsWrapper } from '@easy-track/vaults/ui/operator-grid-add-tiers-fields-wrapper';

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
    const encodedCallData = new utils.AbiCoder().encode(
      [
        'address[]',
        'tuple(uint256,uint256,uint256,uint256,uint256,uint256)[][]',
      ],
      [
        formData.groups.map((group) => utils.getAddress(group.nodeOperator)),
        formData.groups.map((group) =>
          group.tiers.map((tier) => [
            utils.parseEther(tier.shareLimit),
            Number(tier.reserveRatioBP),
            Number(tier.forcedRebalanceThresholdBP),
            Number(tier.infraFeeBP),
            Number(tier.liquidityFeeBP),
            Number(tier.reservationFeeBP),
          ]),
        ),
      ],
    );

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory as Address, encodedCallData as Hex],
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
    const { watch } = useFormContext();
    const groupsInput: GroupInput[] = watch(fieldNames.groups);

    const handleAddGroup = () =>
      groupsFieldArray.append({ nodeOperator: '', tiers: [{ ...EMPTY_TIER }] });

    if (isTrustedCallerLoading) {
      return <Loader />;
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

import { utils } from 'ethers';

import { Fragment, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Option, Button, Loader } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';

import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  ErrorBox,
  MotionInfoBox,
} from './style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { MEVBoostRelay, MotionType } from '../../motion-types';
import { Address, Hex } from 'viem';
import { useMEVBoostRelays } from '../../hooks/use-mev-boost-relays';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { MEVBoostRelaysEdit } from 'shared/blockchain/contracts';
import {
  MAX_MEV_BOOST_RELAY_STRING_LENGTH,
  MAX_MEV_BOOST_UPDATE_COUNT,
} from '../../constants';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { CheckboxHookForm } from 'shared/hook-form/checkbox-hook-form';

export const formParts = createMotionFormPart({
  motionType: MotionType.MEVBoostRelaysEdit,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    relays: MEVBoostRelay[];
  }>) => {
    const encodedCallData = new utils.AbiCoder().encode(
      [
        'tuple(string uri, string operator, bool is_mandatory, string description)[]',
      ],
      [
        formData.relays.map((relay) => ({
          uri: relay.uri,
          operator: relay.name,
          is_mandatory: relay.isMandatory,
          description: relay.description,
        })),
      ],
    );
    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory as Address, encodedCallData as Hex],
    });
  },
  getDefaultFormData: () => ({
    relays: [
      {
        uri: '',
        name: '',
        isMandatory: false,
        description: '',
      },
    ] as MEVBoostRelay[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { watch, setValue } = useFormContext();

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(MEVBoostRelaysEdit);

    const { relaysList, relaysCount, relaysMap, isRelaysDataLoading } =
      useMEVBoostRelays();

    const fieldsArr = useFieldArray({ name: fieldNames.relays });
    const selectedRelays: MEVBoostRelay[] = watch(fieldNames.relays);

    const getFilteredOptions = useCallback(
      (fieldIdx: number) => {
        if (!relaysList?.length) return [];

        const selectedUrisSet = new Set(
          selectedRelays.map((relay) => relay.uri),
        );
        selectedUrisSet.delete(selectedRelays[fieldIdx].uri);

        const options: { label: string; value: string }[] = [];

        for (const relay of relaysList) {
          if (!selectedUrisSet.has(relay.uri)) {
            options.push({
              label: `${relay.name} (${relay.uriHost})`,
              value: relay.uri,
            });
          }
        }

        return options;
      },
      [relaysList, selectedRelays],
    );

    const handleAddRelay = () =>
      fieldsArr.append({
        uri: '',
        name: '',
        isMandatory: false,
        description: '',
      } as MEVBoostRelay);

    const handleRemoveRelay = (fieldIndex: number) =>
      fieldsArr.remove(fieldIndex);

    if (isTrustedCallerLoading || isRelaysDataLoading) {
      return <Loader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    if (!Array.isArray(relaysList) || !relaysMap) {
      return <ErrorBox>Cannot load MEV-Boost relays list</ErrorBox>;
    }

    return (
      <>
        <MotionInfoBox>
          <Text as="span" size={12} weight={500}>
            Due to the smart contract&quot;s limitations, the maximum number of
            updates per motion is {MAX_MEV_BOOST_UPDATE_COUNT}.
          </Text>
        </MotionInfoBox>
        {fieldsArr.fields.map((item, fieldIndex) => {
          const relayInfo = relaysMap.get(selectedRelays[fieldIndex].uri);
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <>
                      <FieldsHeaderDesc>
                        Update #{fieldIndex + 1}
                      </FieldsHeaderDesc>
                      <RemoveItemButton
                        onClick={() => handleRemoveRelay(fieldIndex)}
                      >
                        Remove update {fieldIndex + 1}
                      </RemoveItemButton>
                    </>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <SelectHookForm
                    label="MEV Boost Relay"
                    fieldName={`${fieldNames.relays}.${fieldIndex}.uri`}
                    rules={{ required: 'Field is required' }}
                    onChange={(value: string | number) => {
                      const relay = relaysMap.get(value as string);

                      if (relay) {
                        setValue(`${fieldNames.relays}.${fieldIndex}`, {
                          uri: relay.uri,
                          name: relay.name,
                          isMandatory: relay.isMandatory,
                          description: relay.description,
                        });
                      }
                    }}
                  >
                    {getFilteredOptions(fieldIndex).map((option, i) => (
                      <Option key={i} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </SelectHookForm>
                </Fieldset>

                {!!relayInfo && (
                  <>
                    <Fieldset>
                      <InputHookForm
                        label="Uri"
                        fieldName={`${fieldNames.relays}.${fieldIndex}.uri`}
                        readOnly
                        disabled
                      />
                    </Fieldset>

                    <Fieldset>
                      <InputHookForm
                        label="Name"
                        fieldName={`${fieldNames.relays}.${fieldIndex}.name`}
                        rules={{
                          required: 'Name is required',
                          validate: (value) => {
                            const valueLower = value.toLowerCase();

                            if (valueLower.trim().length === 0) {
                              return 'Name must not be empty';
                            }

                            if (relayInfo.name.toLowerCase() === valueLower) {
                              return true;
                            }

                            if (
                              value.length > MAX_MEV_BOOST_RELAY_STRING_LENGTH
                            ) {
                              return `Name must be less than ${MAX_MEV_BOOST_RELAY_STRING_LENGTH} characters`;
                            }

                            return true;
                          },
                        }}
                      />
                    </Fieldset>
                    <Fieldset>
                      <InputHookForm
                        label="Description"
                        fieldName={`${fieldNames.relays}.${fieldIndex}.description`}
                        rules={{
                          required: 'Description is required',
                          validate: (value) => {
                            if (value.trim().length === 0) {
                              return 'Description must not be empty';
                            }

                            if (
                              value.length > MAX_MEV_BOOST_RELAY_STRING_LENGTH
                            ) {
                              return `Description must be less than ${MAX_MEV_BOOST_RELAY_STRING_LENGTH} characters`;
                            }

                            return true;
                          },
                        }}
                      />
                    </Fieldset>
                    <Fieldset>
                      <CheckboxHookForm
                        label="Mandatory"
                        fieldName={`${fieldNames.relays}.${fieldIndex}.isMandatory`}
                      />
                    </Fieldset>
                  </>
                )}
              </FieldsWrapper>
            </Fragment>
          );
        })}
        {fieldsArr.fields.length < relaysCount &&
          fieldsArr.fields.length < MAX_MEV_BOOST_UPDATE_COUNT && (
            <Fieldset>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddRelay}
                color="secondary"
              >
                Update one more relay
              </Button>
            </Fieldset>
          )}

        {submitAction}
      </>
    );
  },
});

import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { PageLoader } from 'shared/components/page-loader';
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
import { MotionType } from '../../motion-types';
import { MEVBoostRelay } from '../../types';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { useMEVBoostRelays } from '../../hooks/use-mev-boost-relays';
import { MEVBoostRelaysAdd } from 'shared/blockchain/contracts';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateRelayUrl } from '../../utils/validate-relay-url';
import {
  MAX_MEV_BOOST_RELAY_STRING_LENGTH,
  MAX_MEV_BOOST_RELAYS_COUNT,
} from '../../constants';
import { CheckboxHookForm } from 'shared/hook-form/checkbox-hook-form';

export const formParts = createMotionFormPart({
  motionType: MotionType.MEVBoostRelaysAdd,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    relays: MEVBoostRelay[];
  }>) => {
    const encodedCallData = encodeAbiParameters(
      parseAbiParameters('(string, string, bool, string)[]'),
      [
        formData.relays.map(
          (relay) =>
            [
              relay.uri,
              relay.name,
              relay.isMandatory,
              relay.description,
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
    relays: [
      { uri: '', name: '', isMandatory: false, description: '' },
    ] as MEVBoostRelay[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { watch } = useFormContext();
    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(MEVBoostRelaysAdd);

    const { relaysMap, relaysCount, isRelaysDataLoading } = useMEVBoostRelays();

    const fieldsArr = useFieldArray({ name: fieldNames.relays });
    const selectedRelays: MEVBoostRelay[] = watch(fieldNames.relays);

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
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    if (!relaysMap) {
      return <ErrorBox>Cannot load MEV-Boost relays list</ErrorBox>;
    }

    if (relaysCount >= MAX_MEV_BOOST_RELAYS_COUNT) {
      return <MessageBox>Relays limit reached</MessageBox>;
    }

    return (
      <>
        <MotionInfoBox>
          <Text as="span" size={12} weight={500}>
            Max relays count: {MAX_MEV_BOOST_RELAYS_COUNT}.
          </Text>
        </MotionInfoBox>
        {fieldsArr.fields.map((item, fieldIndex) => (
          <Fragment key={item.id}>
            <FieldsWrapper>
              <FieldsHeader>
                <FieldsHeaderDesc>
                  Relay #{relaysCount + fieldIndex + 1}
                </FieldsHeaderDesc>
                {fieldsArr.fields.length > 1 && (
                  <RemoveItemButton
                    onClick={() => handleRemoveRelay(fieldIndex)}
                  >
                    Remove relay {relaysCount + fieldIndex + 1}
                  </RemoveItemButton>
                )}
              </FieldsHeader>

              <Fieldset>
                <InputHookForm
                  label="Uri"
                  fieldName={`${fieldNames.relays}.${fieldIndex}.uri`}
                  rules={{
                    required: 'Field is required',
                    validate: (value) => {
                      const urlErr = validateRelayUrl(value);
                      if (urlErr) {
                        return urlErr;
                      }

                      if (value.length > MAX_MEV_BOOST_RELAY_STRING_LENGTH) {
                        return `Uri must be less than ${MAX_MEV_BOOST_RELAY_STRING_LENGTH} characters`;
                      }

                      if (relaysMap.has(value)) {
                        return 'Uri must not be in use by another relay';
                      }

                      const uriInSelectedRelaysIndex = selectedRelays.findIndex(
                        ({ uri }, index) =>
                          uri.toLowerCase() === value.toLowerCase() &&
                          fieldIndex !== index,
                      );

                      if (uriInSelectedRelaysIndex !== -1) {
                        return 'Uri is already in use by another update';
                      }

                      return true;
                    },
                  }}
                />
              </Fieldset>

              <Fieldset>
                <InputHookForm
                  label="Name"
                  fieldName={`${fieldNames.relays}.${fieldIndex}.name`}
                  rules={{
                    required: 'Name is required',
                    validate: (value) => {
                      if (value.trim().length === 0) {
                        return 'Name must not be empty';
                      }

                      if (value.length > MAX_MEV_BOOST_RELAY_STRING_LENGTH) {
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

                      if (value.length > MAX_MEV_BOOST_RELAY_STRING_LENGTH) {
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
            </FieldsWrapper>
          </Fragment>
        ))}
        {relaysCount + fieldsArr.fields.length < MAX_MEV_BOOST_RELAYS_COUNT && (
          <Fieldset>
            <ButtonIcon
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddRelay}
              icon={<Plus />}
              color="secondary"
            >
              One more relay
            </ButtonIcon>
          </Fieldset>
        )}

        {submitAction}
      </>
    );
  },
});

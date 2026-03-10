import { Fragment, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Option, Button, Input, Checkbox } from '@lidofinance/lido-ui';
import { PageLoader } from 'shared/components/page-loader';

import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  ErrorBox,
} from './style';
import {
  PopulateTxArgs,
  createMotionFormPart,
} from './create-motion-form-part';
import { MotionType } from '../../motion-types';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { useMEVBoostRelays } from '../../hooks/use-mev-boost-relays';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { MEVBoostRelaysRemove } from 'shared/blockchain/contracts';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';

type RelayUri = {
  uri: string;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.MEVBoostRelaysRemove,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    relayUris: RelayUri[];
  }>) => {
    const encodedCallData = encodeAbiParameters(
      parseAbiParameters('string[]'),
      [formData.relayUris.map((relay) => relay.uri)],
    );
    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: () => ({
    relayUris: [{ uri: '' }] as RelayUri[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { watch } = useFormContext();

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(MEVBoostRelaysRemove);

    const { relaysMap, relaysList, relaysCount, isRelaysDataLoading } =
      useMEVBoostRelays();

    const fieldsArr = useFieldArray({ name: fieldNames.relayUris });
    const selectedUris: RelayUri[] = watch(fieldNames.relayUris);

    const getFilteredOptions = useCallback(
      (fieldIdx: number) => {
        if (!relaysList?.length) return [];

        const selectedUrisSet = new Set(selectedUris.map((relay) => relay.uri));
        selectedUrisSet.delete(selectedUris[fieldIdx].uri);

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
      [relaysList, selectedUris],
    );

    const handleAddRelay = () =>
      fieldsArr.append({
        uri: '',
      } as RelayUri);

    const handleRemoveRelay = (fieldIndex: number) =>
      fieldsArr.remove(fieldIndex);

    if (isTrustedCallerLoading || isRelaysDataLoading) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    if (!Array.isArray(relaysList) || !relaysMap) {
      return <ErrorBox>Cannot load MEV-Boost relays list</ErrorBox>;
    }

    return (
      <>
        {fieldsArr.fields.map((item, fieldIndex) => {
          const selectedRelayInfo = relaysMap.get(selectedUris[fieldIndex].uri);

          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <>
                      <FieldsHeaderDesc>
                        Deletion #{fieldIndex + 1}
                      </FieldsHeaderDesc>
                      <RemoveItemButton
                        onClick={() => handleRemoveRelay(fieldIndex)}
                      >
                        Remove deletion {fieldIndex + 1}
                      </RemoveItemButton>
                    </>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <SelectHookForm
                    label="MEV Boost Relay"
                    fieldName={`${fieldNames.relayUris}.${fieldIndex}.uri`}
                    rules={{ required: 'Field is required' }}
                  >
                    {getFilteredOptions(fieldIndex).map((option, i) => (
                      <Option key={i} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </SelectHookForm>
                </Fieldset>

                {selectedRelayInfo && (
                  <>
                    <Fieldset>
                      <Input
                        disabled
                        readOnly
                        value={selectedRelayInfo.uri}
                        label="Uri"
                      />
                    </Fieldset>
                    <Fieldset>
                      <Input
                        readOnly
                        disabled
                        value={selectedRelayInfo.description}
                        label="Description"
                      />
                    </Fieldset>
                    <Fieldset>
                      <Checkbox
                        disabled
                        readOnly
                        checked={selectedRelayInfo.isMandatory}
                        label="Mandatory"
                      />
                    </Fieldset>
                  </>
                )}
              </FieldsWrapper>
            </Fragment>
          );
        })}
        {fieldsArr.fields.length < relaysCount && (
          <Fieldset>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddRelay}
              color="secondary"
            >
              Remove one more relay
            </Button>
          </Fieldset>
        )}

        {submitAction}
      </>
    );
  },
});

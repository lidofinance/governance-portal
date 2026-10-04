import { encodeAbiParameters, getAbiItem, type Hex } from 'viem';
import { lidoLendApplyIrmConfigAbi as abi } from 'abi/generated';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { MarketIdField } from '@easy-track/lido-lend/market-id-field';
import { DEFAULT_ADDRESS_RULES } from '@easy-track/lido-lend/validation';
import { MotionType } from '@easy-track/motion-types';
import { PageLoader } from 'shared/components/page-loader';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { Fieldset, MessageBox } from './style';

export type FormData = {
  marketId: string;
  irmConfig: string;
};

export const encodeApplyIrmConfigCallData = ({
  marketId,
  irmConfig,
}: FormData) =>
  encodeAbiParameters(
    getAbiItem({ abi, name: 'decodeEVMScriptCallData' }).outputs,
    [marketId as Hex, irmConfig as Hex],
  );

export const formParts = createMotionFormPart({
  motionType: MotionType.LidoLendApplyIrmConfig,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<FormData>) => {
    const encodedCallData = encodeApplyIrmConfigCallData(formData);

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: (): FormData => ({
    marketId: '',
    irmConfig: '',
  }),
  Component: ({ fieldNames, submitAction, factory }) => {
    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(factory);

    if (isTrustedCallerLoading) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    return (
      <>
        <MarketIdField fieldName={fieldNames.marketId} />

        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.irmConfig}
            label="IRM config"
            rules={DEFAULT_ADDRESS_RULES}
          />
        </Fieldset>

        {submitAction}
      </>
    );
  },
});

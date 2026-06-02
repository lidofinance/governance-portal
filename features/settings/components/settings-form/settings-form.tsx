import { useCallback, useRef } from 'react';
import { DaoToken } from 'shared/blockchain/contract-addresses';
import { createPublicClient, http } from 'viem';
import {
  Block,
  Container,
  Button,
  ToastSuccess,
  Link,
} from '@lidofinance/lido-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { CheckboxHookForm } from 'shared/hook-form/checkbox-hook-form';
import { fetcherEtherscan } from 'utils/fetcher-etherscan';
import { useLidoSDK } from 'providers/lido-sdk';
import { useConfig } from 'config';
import { isUrl } from 'utils/is-url';
import { isTestnet as getIsTestnet } from 'shared/blockchain/utils/is-testnet';
import { SettingsFormData, SettingsFormValues } from '../../types';
import {
  CheckboxWrapper,
  DescriptionText,
  DescriptionTitle,
  StyledActions,
  TooltipStyled,
} from './style';
import { useTestContractsInfo } from './use-test-contracts-info';
import { Text } from 'shared/components/text';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

const Actions = ({ children }: { children: React.ReactNode }) => (
  <StyledActions>{children}</StyledActions>
);

export const SettingsForm = () => {
  const { chainId } = useLidoSDK();
  const { userConfig } = useConfig();
  const testContractsInfo = useTestContractsInfo();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const formMethods = useForm<SettingsFormData>({
    mode: 'onChange',
    defaultValues: {
      rpcUrl: userConfig.savedUserConfig.rpcUrls[chainId],
      etherscanApiKey: userConfig.savedUserConfig.etherscanApiKey,
      useBundledAbi: userConfig.savedUserConfig.useBundledAbi,
      useTestContracts: userConfig.savedUserConfig.useTestContracts,
      useLocalCache: userConfig.savedUserConfig.useLocalCache,
    },
  });

  const {
    handleSubmit: hookFormHandleSubmit,
    setValue,
    formState,
    getValues,
    watch,
  } = formMethods;

  const watchedValues = watch(['useTestContracts']);
  const [useTestContracts] = watchedValues;

  const isTestnet = getIsTestnet(chainId);

  const validateRpcUrl = useCallback(
    async (rpcUrl: string) => {
      if (!rpcUrl) return true;
      if (!isUrl(rpcUrl)) return 'Given string is not valid url';

      try {
        const testClient = createPublicClient({
          transport: http(rpcUrl),
        });

        const networkChainId = await testClient.getChainId();
        if (networkChainId !== chainId) {
          return `URL is working, but network does not match to ${CHAINS[chainId]}`;
        }

        await testClient.getBlockNumber();

        return true;
      } catch (err) {
        return 'Given URL is not working';
      }
    },
    [chainId],
  );

  const validateEtherscanKey = useCallback(
    async (etherscanApiKey: string) => {
      if (!etherscanApiKey) {
        return true;
      }

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      return new Promise<string | boolean>((resolve) => {
        debounceTimeoutRef.current = setTimeout(async () => {
          const errMsg = 'Etherscan API key is invalid or cannot be accessed';
          try {
            let daoTokenAddress = DaoToken[chainId];

            if (
              typeof daoTokenAddress === 'object' &&
              daoTokenAddress !== null
            ) {
              daoTokenAddress =
                daoTokenAddress[useTestContracts ? 'test' : 'actual'];
            }

            const addressToUse =
              daoTokenAddress || '0x0000000000000000000000000000000000000000';

            await fetcherEtherscan<any>({
              chainId,
              address: addressToUse,
              module: 'contract',
              action: 'getabi',
              apiKey: etherscanApiKey,
              useCache: false,
            });

            resolve(true);
          } catch (err) {
            resolve(errMsg);
          }
        }, 500);
      });
    },
    [chainId, useTestContracts],
  );

  const saveSettings = useCallback(
    (formValues: SettingsFormValues) => {
      userConfig.setSavedUserConfig({
        rpcUrls: {
          ...userConfig.savedUserConfig.rpcUrls,
          [chainId]: formValues.rpcUrl,
        },
        etherscanApiKey: formValues.etherscanApiKey,
        useBundledAbi: formValues.useBundledAbi,
        useTestContracts: formValues.useTestContracts,
        useLocalCache: formValues.useLocalCache,
      });
    },
    [chainId, userConfig],
  );

  const handleSubmit = useCallback(
    async (formValues: SettingsFormValues) => {
      saveSettings(formValues);
      ToastSuccess('Settings have been saved');
    },
    [saveSettings],
  );

  const handleReset = useCallback(() => {
    setValue('rpcUrl', '');
    setValue('etherscanApiKey', '');
    setValue('useBundledAbi', true);
    setValue('useLocalCache', true);
    saveSettings(getValues());
    ToastSuccess('Settings have been reset');
  }, [setValue, saveSettings, getValues]);

  const disableButton = formState.isSubmitting || !formState.isValid;

  return (
    <Container as="main" size="tight">
      <Block data-testid="settingsSection">
        <FormProvider {...formMethods}>
          <form onSubmit={hookFormHandleSubmit(handleSubmit)}>
            <InputHookForm
              label="RPC Url (infura / alchemy / custom)"
              fieldName="rpcUrl"
              placeholder="https://mainnet.infura.io/v3/YOUR-PROJECT-ID"
              rules={{ validate: validateRpcUrl }}
            />
            <InputHookForm
              label="Etherscan api key"
              fieldName="etherscanApiKey"
              placeholder="YTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              showErrorMessage={true}
              rules={{ validate: validateEtherscanKey }}
              style={{ marginTop: '16px' }}
            />
            <CheckboxWrapper>
              <CheckboxHookForm
                fieldName="useBundledAbi"
                label="Use built-in ABIs"
              />
            </CheckboxWrapper>

            <CheckboxWrapper>
              <CheckboxHookForm
                fieldName="useLocalCache"
                label="Use local cache for historical data"
              />
              <TooltipStyled
                title={
                  <Text size={12}>
                    This app uses locally stored cache for historical data (e.g.
                    ended onchain votes). Disable this param to use realtime RPC
                    data instead
                  </Text>
                }
              ></TooltipStyled>
            </CheckboxWrapper>

            {isTestnet && (
              <CheckboxWrapper>
                <CheckboxHookForm
                  fieldName="useTestContracts"
                  label="Use test contracts"
                />
              </CheckboxWrapper>
            )}
            <Actions>
              <Button
                fullwidth
                variant="translucent"
                onClick={handleReset}
                data-testid="resetBtn"
                type="button"
              >
                Reset to defaults
              </Button>
              <Button
                type="submit"
                fullwidth
                color="primary"
                loading={formState.isSubmitting}
                disabled={disableButton}
                data-testid="saveBtn"
              >
                Save
              </Button>
            </Actions>
          </form>
        </FormProvider>
      </Block>

      <br />

      <Block>
        <DescriptionText data-testid="faqSection">
          <DescriptionTitle>What are these settings for?</DescriptionTitle>
          <p>
            This website relies on a JSON RPC connection and an Etherscan API
            token. For more reliable operation, consider specifying your own.
            You can get yours by visiting the links below.
          </p>
          <p>
            Ethereum nodes:{' '}
            <a
              target="_blank"
              href="https://ethereumnodes.com/"
              rel="noreferrer"
            >
              ethereumnodes.com
            </a>
            <br />
            Etherscan api key:{' '}
            <a
              target="_blank"
              href="https://etherscan.io/myapikey"
              rel="noreferrer"
            >
              etherscan.io/myapikey
            </a>
          </p>
          <DescriptionTitle>
            What does &ldquo;Use built-in ABIs&rdquo; parameter?
          </DescriptionTitle>
          <p>
            This website includes pre-loaded ABIs for script parsing. If you are
            having trouble viewing the action items, uncheck this box to load
            ABIs from Etherscan.
          </p>
          <DescriptionTitle>
            What does &ldquo;Use local cache for historical data&rdquo;
            parameter?
          </DescriptionTitle>
          <p>
            This app uses locally stored cache for historical data (e.g. ended
            onchain votes). Disable this param to use realtime RPC data instead.
          </p>
          {isTestnet && (
            <>
              <DescriptionTitle>
                What is the purpose of the &rdquo;Use test contracts&rdquo;
                parameter?
              </DescriptionTitle>
              <p>
                There may be more than one contract instance on the testnet.
                This parameter allows you to choose between the test and main
                contract.
              </p>
            </>
          )}
        </DescriptionText>
      </Block>

      {/* Render test contracts section normally since we're client-side only now */}
      {isTestnet && useTestContracts && testContractsInfo.length > 0 && (
        <>
          <br />
          <Block>
            <DescriptionTitle>Contracts with test addresses</DescriptionTitle>
            {testContractsInfo.map((contract) => (
              <div key={contract.address}>
                <Text size={16}>{contract.name}</Text>
                <Link href={getEtherscanAddressLink(chainId, contract.address)}>
                  {contract.address}
                </Link>
              </div>
            ))}
          </Block>
        </>
      )}
    </Container>
  );
};

import { useDecodedScript } from 'shared/hooks';
import {
  CallTitle,
  CallWrapper,
  NestedPadding,
} from 'features/dual-governance/proposals/shared-components/evm-script-parsed/compact/style';
import { Text } from '@lidofinance/lido-ui';
import { getContractName } from 'utils/getContractName';
import { Dispatch, Fragment, SetStateAction, useEffect } from 'react';
import { useLidoSDK } from 'providers/lido-sdk';
import { TurnArrow } from 'shared/components/icons';
import { EVMScriptCall } from '@lidofinance/evm-script-decoder/lib/types';

type ScriptProps = {
  script: string;
  onUnknownContractCalled: Dispatch<SetStateAction<boolean>>;
};

type BodyProps = {
  decodedCalls: EVMScriptCall[];
  onUnknownContractCalled: Dispatch<SetStateAction<boolean>>;
};

const ScriptBody = ({ decodedCalls, onUnknownContractCalled }: BodyProps) => {
  const { chainId } = useLidoSDK();

  const callsMap = decodedCalls.map((call, i) => {
    const id = i + 1;
    const { address, abi, encodedCallData, decodedCallData } = call;

    const nestedScriptsIdxs = abi?.inputs?.reduce(
      (r, c, j) => (c.name === '_evmScript' ? [...r, j] : r),
      [] as number[],
    );
    const showNestedScripts = nestedScriptsIdxs && nestedScriptsIdxs.length > 0;
    const contractNameListed = getContractName(chainId, address);

    return {
      id,
      abi,
      address,
      nestedScriptsIdxs,
      showNestedScripts,
      contractNameListed,
      encodedCallData,
      decodedCallData,
    };
  });

  // Move state updates to useEffect
  useEffect(() => {
    const hasUnknownContract = callsMap.some(({ abi }) => !abi?.name);
    if (hasUnknownContract) {
      onUnknownContractCalled(true);
    }
  }, [callsMap, onUnknownContractCalled]);

  return (
    <>
      {callsMap.map(
        ({
          id,
          abi,
          contractNameListed,
          showNestedScripts,
          nestedScriptsIdxs,
          decodedCallData,
        }) => (
          <Fragment key={id}>
            <CallWrapper>
              <Text size="sm" color="secondary">
                Call{' '}
                <CallTitle $warning={!abi?.name}>
                  {abi ? abi.name : 'Unknown contract'}
                </CallTitle>
                {contractNameListed && (
                  <>
                    <span>{' on '}</span>
                    <CallTitle>{contractNameListed}</CallTitle>
                  </>
                )}
              </Text>
              {showNestedScripts && (
                <>
                  {nestedScriptsIdxs &&
                    nestedScriptsIdxs.map((idx) => (
                      <NestedPadding key={idx}>
                        <TurnArrow />
                        <ScriptBody
                          onUnknownContractCalled={onUnknownContractCalled}
                          decodedCalls={decodedCallData?.[idx].calls}
                        />
                      </NestedPadding>
                    ))}
                </>
              )}
            </CallWrapper>
          </Fragment>
        ),
      )}
    </>
  );
};

export const AragonScript = ({
  script,
  onUnknownContractCalled,
}: ScriptProps) => {
  const data = useDecodedScript(script);

  if (!data || !data.decoded) {
    return null;
  }

  return (
    <ScriptBody
      onUnknownContractCalled={onUnknownContractCalled}
      decodedCalls={data.decoded.calls}
    />
  );
};

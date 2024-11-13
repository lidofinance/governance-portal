import React from 'react';
import { EVMScriptDecoded } from '@lidofinance/evm-script-decoder/lib/types';
import { getContractName } from 'utils/getContractName';
import { useLidoSDK } from 'providers/lido-sdk';
import { Text } from '@lidofinance/lido-ui';
import { CallTitle, CallWrapper, NestedPadding } from './style';
import { TurnArrow } from 'shared/components/icons';

type Props = {
  binary: string;
  decoded?: EVMScriptDecoded;
  parentId?: string | number;
  metadata?: string | undefined;
};

export const ScriptBody = ({ decoded }: Props) => {
  const {
    core: { chainId },
  } = useLidoSDK();

  if (!decoded) return null;

  const callsMap = decoded.calls.map((call, i) => {
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

  return (
    <>
      {callsMap.map(
        ({
          id,
          abi,
          contractNameListed,
          showNestedScripts,
          nestedScriptsIdxs,
          encodedCallData,
          decodedCallData,
        }) => {
          return (
            <React.Fragment key={`call-${id}`}>
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
                            binary={encodedCallData}
                            decoded={decodedCallData?.[idx]}
                            parentId={id}
                          />
                        </NestedPadding>
                      ))}
                  </>
                )}
              </CallWrapper>
            </React.Fragment>
          );
        },
      )}
    </>
  );
};

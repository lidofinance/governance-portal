import React from 'react';
import { EVMScriptDecoded } from '@lidofinance/evm-script-decoder/lib/types';
import { getContractName } from 'utils/getContractName';
import { useLidoSDK } from 'providers/lido-sdk';
import { Text } from '@lidofinance/lido-ui';
import { CallTitle, CallWrapper } from './styles';

type Props = {
  binary: string;
  decoded?: EVMScriptDecoded;
  parentId?: string | number;
};

export const ProposalScriptParsed = ({ decoded }: Props) => {
  const { chainId } = useLidoSDK();

  if (!decoded) return null;

  const callsMap = decoded.calls.map((call, i) => {
    const id = i + 1;
    const { address, abi, methodId } = call;

    // const callString = formatCallString(id, abi, decodedCallData);
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
      methodId,
    };
  });

  return (
    <>
      {callsMap.map(({ id, abi, contractNameListed }) => {
        return (
          <React.Fragment key={`call-${id}`}>
            <CallWrapper>
              <Text size="sm" color="secondary">
                Call{' '}
                <CallTitle>{abi ? abi.name : 'Unknown contract'}</CallTitle>
                {contractNameListed}
                {contractNameListed && (
                  <>
                    <span>{' on '}</span>
                    <CallTitle>{contractNameListed}</CallTitle>
                  </>
                )}
              </Text>
            </CallWrapper>
          </React.Fragment>
        );
      })}
    </>
  );
};

import { DecodedCall } from 'features/dual-governance/evm-script-parsed/utils/decode-calls';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useLidoSDK } from 'providers/lido-sdk';
import React, { useMemo } from 'react';
import { getContractName } from 'utils/get-contract-name';
import { LIDO_ROLES } from 'constants/roles';
import { Link } from '@lidofinance/lido-ui';
import { getEtherscanAddressLink } from 'utils/etherscan';
import {
  CallWrapper,
  CallTitle,
  CallFunction,
  CallData,
  CallDataItem,
  NestedCallWrapper,
} from 'features/dual-governance/evm-script-parsed/style';

interface FormatOptions {
  chainId: CHAINS;
  parentId?: string | number;
  index?: number;
  depth?: number;
}

const formatArg = (arg: unknown, chainId: CHAINS): string => {
  if (typeof arg === 'string') {
    if (arg.startsWith('0x') && arg.length === 42) {
      const contractName = getContractName(chainId, arg) || 'Unknown';
      return `[${contractName}] ${arg}`;
    }
    if (arg.startsWith('0x') && arg.length === 66 && LIDO_ROLES[arg]) {
      return `[${LIDO_ROLES[arg]}] ${arg}`;
    }
  }
  return String(arg);
};

const FormatSingleCall: React.FC<{
  decodedCall: DecodedCall;
  options: FormatOptions;
}> = ({ decodedCall, options }) => {
  const { chainId, parentId, index, depth = 0 } = options;
  const { decoded, contractAddress } = decodedCall;
  const id =
    parentId !== undefined ? `${parentId}.${(index ?? 0) + 1}` : decodedCall.id;

  if (!decoded) {
    return (
      <CallWrapper style={{ paddingLeft: `${depth * 20}px` }}>
        <CallTitle>
          {id}. On [{decodedCall.contractName || 'Unknown'}]
          <br />
          <Link href={getEtherscanAddressLink(chainId, contractAddress)}>
            {contractAddress}
          </Link>
        </CallTitle>
        <CallFunction>Unknown function</CallFunction>
      </CallWrapper>
    );
  }

  const { functionName, args, nestedCalls } = decoded;

  const paramNames = args
    ? Object.keys(args).filter((key) => isNaN(Number(key)))
    : [];

  const formattedArgs =
    paramNames.length > 0 ? paramNames : args?.map((_, i) => `arg${i}`);

  const callData = args?.length ? (
    args
      .map((arg, i) => {
        const formatted = formatArg(arg, chainId);
        return formatted ? (
          <CallDataItem key={`${id}-arg-${i}`}>
            [{i + 1}] {formatted}
          </CallDataItem>
        ) : null;
      })
      .filter((item) => item)
  ) : (
    <CallDataItem key={`${id}-empty`}>[empty]</CallDataItem>
  );

  return (
    <CallWrapper style={{ paddingLeft: `${depth * 20}px` }}>
      <CallTitle>
        {id}. On [{decodedCall.contractName || 'Unknown'}]
        <br />
        <Link href={getEtherscanAddressLink(chainId, contractAddress)}>
          {contractAddress}
        </Link>
      </CallTitle>
      <CallFunction>
        function{' '}
        <b>
          {functionName}
          {formattedArgs?.length ? (
            <>
              (
              {formattedArgs.map((param, i) => (
                <React.Fragment key={`${id}-param-${i}`}>
                  <br />
                  <span>{` ${param}`}</span>
                  {i < formattedArgs.length - 1 && ','}
                  {i === formattedArgs.length - 1 && <br />}
                </React.Fragment>
              ))}
              )
            </>
          ) : (
            '()'
          )}
        </b>
      </CallFunction>
      <CallData>
        Call data:
        {callData}
      </CallData>
      {nestedCalls && nestedCalls.length > 0 && (
        <NestedCallWrapper>
          {nestedCalls.map((nestedCall, i) => (
            <FormatSingleCall
              key={`${id}.${i + 1}`}
              decodedCall={nestedCall}
              options={{ chainId, parentId: id, index: i, depth: depth + 1 }}
            />
          ))}
        </NestedCallWrapper>
      )}
    </CallWrapper>
  );
};

export const formatDecodedCallString = (
  decodedCall: DecodedCall,
  chainId: CHAINS,
): React.JSX.Element => {
  return (
    <FormatSingleCall
      decodedCall={decodedCall}
      options={{ chainId, depth: 0 }}
    />
  );
};

export const useFormatDecodedCallString = () => {
  const { chainId } = useLidoSDK();
  return useMemo(
    () => (decodedCall: DecodedCall) =>
      formatDecodedCallString(decodedCall, chainId),
    [chainId],
  );
};

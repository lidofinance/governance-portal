import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useLidoSDK } from 'providers/lido-sdk';
import React, { useMemo } from 'react';
import { AbiFunction } from 'viem';
import { getContractName } from 'utils/get-contract-name';
import { getLocalContractAbi } from 'shared/blockchain/utils/abi';
import { DEFAULT_ADMIN_ROLE, LIDO_ROLES } from 'constants/roles';
import { Link, Text } from '@lidofinance/lido-ui';
import { getEtherscanAddressLink } from 'utils/etherscan';
import {
  CallWrapper,
  CallTitle,
  CallFunction,
  CallData,
  CallDataItem,
  NestedCallWrapper,
  DGBadge,
} from '@dg/evm-script-parsed/style';
import { DecodedCall } from 'utils/decode-evm-script-calls';
import { DualGovernancePlainIcon } from 'shared/components/icons';
import { DualGovernance } from 'shared/blockchain/contract-addresses';
import { HISTORICAL_ADDRESSES } from 'constants/historical-addresses';
import { EVM_SCRIPT_SPEC_ID } from 'shared/blockchain/utils/decode-evm-script';

interface FormatOptions {
  chainId: CHAINS;
  parentId?: string | number;
  index?: number;
  depth?: number;
}

const formatArg = (
  arg: unknown,
  chainId: CHAINS,
  parentId?: string | number,
  isNestedCallsArg?: boolean,
): string => {
  if (typeof arg === 'string') {
    if (arg.startsWith('0x') && arg.length === 42) {
      const contractName = getContractName(chainId, arg);
      return contractName ? `[${contractName}] ${arg}` : arg;
    }
    if (arg === DEFAULT_ADMIN_ROLE) {
      return 'DEFAULT ADMIN ROLE';
    }
    if (arg.startsWith('0x') && arg.length === 66 && LIDO_ROLES[arg]) {
      return `[${LIDO_ROLES[arg]}] ${arg}`;
    }

    if (arg.startsWith(`0x${EVM_SCRIPT_SPEC_ID}`)) {
      const itemLocation = parentId ? `at ${parentId}.1` : 'below';
      return `See parsed evm script ${itemLocation}`;
    }
  }
  if (typeof arg === 'bigint') {
    return arg.toString();
  }
  if (Array.isArray(arg)) {
    // Caller marks the arg whose bytes were recursively decoded into `nestedCalls`;
    // point the user at the decoded list instead of dumping the raw tuple array.
    if (isNestedCallsArg) {
      const firstIndex = `${parentId}.1`;
      const lastIndex = `${parentId}.${arg.length}`;
      return `See ${arg.length} parsed calls at ${firstIndex} — ${lastIndex}`;
    }
    return `[${arg.map((item) => formatArg(item, chainId, parentId)).join(', ')}]`;
  }
  if (typeof arg === 'object' && arg !== null) {
    const entries = Object.entries(arg).map(
      ([k, v]) => `${k}: ${formatArg(v, chainId, parentId)}`,
    );
    return `{ ${entries.join(', ')} }`;
  }
  return String(arg);
};

const getFunctionInputs = (
  functionName: string,
  contractAddress: string,
  chainId: CHAINS,
) => {
  const abi = getLocalContractAbi(contractAddress, chainId);
  if (!abi) return null;

  const functionAbi = abi.find(
    (item): item is AbiFunction =>
      item.type === 'function' && item.name === functionName,
  );

  return functionAbi?.inputs || null;
};

const FormatSingleCall: React.FC<{
  decodedCall: DecodedCall;
  options: FormatOptions;
}> = ({ decodedCall, options }) => {
  const { chainId, parentId, index, depth = 0 } = options;
  const id =
    parentId !== undefined
      ? `${parentId}.${(index ?? 0) + 1}`
      : decodedCall?.id;

  // Check if this is a Dual Governance call
  const dualGovernanceAddress = DualGovernance[chainId];
  const historicalGovernanceAddresses =
    (HISTORICAL_ADDRESSES[chainId as keyof typeof HISTORICAL_ADDRESSES]
      ?.governanceAddresses as string[] | undefined) || [];

  const isDualGovernanceCall =
    decodedCall?.functionName === 'submitProposal' &&
    decodedCall?.contractAddress &&
    (decodedCall.contractAddress.toLowerCase() ===
      (typeof dualGovernanceAddress === 'object' &&
      'actual' in dualGovernanceAddress
        ? dualGovernanceAddress.actual?.toLowerCase()
        : dualGovernanceAddress?.toLowerCase()) ||
      decodedCall.contractAddress.toLowerCase() ===
        (typeof dualGovernanceAddress === 'object' &&
        'test' in dualGovernanceAddress
          ? dualGovernanceAddress.test?.toLowerCase()
          : undefined) ||
      historicalGovernanceAddresses.some(
        (addr) =>
          addr.toLowerCase() === decodedCall.contractAddress.toLowerCase(),
      ));

  const cardTitle = decodedCall ? (
    <CallTitle>
      {id}. On{' '}
      {decodedCall.contractName ? (
        <>
          <b>[{decodedCall.contractName}]</b>
          <br />
        </>
      ) : null}
      <Link
        href={getEtherscanAddressLink(chainId, decodedCall.contractAddress)}
      >
        {decodedCall.contractAddress}
      </Link>
    </CallTitle>
  ) : null;

  if (!decodedCall || !decodedCall.functionName) {
    return (
      <CallWrapper style={{ paddingLeft: `${depth * 20}px` }}>
        {cardTitle}
        <CallFunction>Unknown function</CallFunction>
      </CallWrapper>
    );
  }

  const { functionName, args, nestedCalls } = decodedCall;

  const functionInputs = getFunctionInputs(
    functionName,
    decodedCall.contractAddress,
    chainId,
  );

  const formattedArgs = functionInputs
    ? functionInputs.map((input: any) => `${input.type} ${input.name}`)
    : args?.map((_, i) => `arg${i}`);

  const hasNestedCalls = !!nestedCalls?.length;
  const callData = args?.length ? (
    args
      .map((arg, i) => {
        const formatted = formatArg(
          arg,
          chainId,
          id,
          hasNestedCalls && i === 0,
        );
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
    <CallWrapper $withDg={isDualGovernanceCall}>
      {isDualGovernanceCall && (
        <DGBadge>
          <DualGovernancePlainIcon />{' '}
          <Text weight={700} size="xxs" color="primary">
            Under Dual Governance
          </Text>
        </DGBadge>
      )}
      {cardTitle}
      <CallFunction>
        function <b>{functionName}</b>
        {formattedArgs?.length ? (
          <>
            (
            {formattedArgs.map((param, i) => (
              <React.Fragment key={`${id}-param-${i}`}>
                <br />
                <span style={{ paddingLeft: '20px' }}>{param}</span>
                {i < formattedArgs.length - 1 && ','}
                {i === formattedArgs.length - 1 && <br />}
              </React.Fragment>
            ))}
            )
          </>
        ) : (
          '()'
        )}
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

import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useLidoSDK } from 'providers/lido-sdk';
import React, { useMemo } from 'react';
import { getContractName } from 'utils/get-contract-name';
import { getContractAbi } from 'utils/decode-evm-script-calls';
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
} from 'features/dual-governance/evm-script-parsed/style';
import { DecodedCall } from 'utils/decode-evm-script-calls';
import { DualGovernancePlainIcon } from 'shared/components/icons';
import { DualGovernance } from 'shared/blockchain/contract-addresses';
import { HISTORICAL_ADDRESSES } from '../../../../constants/historical-addresses.mjs';

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
  }
  if (Array.isArray(arg)) {
    // Check if it's an array of call objects (nested calls)
    if (arg.length > 0 && typeof arg[0] === 'object' && arg[0] !== null) {
      const firstIndex = `${parentId}.1`;
      const lastIndex = `${parentId}.${arg.length}`;
      return `See ${arg.length} parsed calls at ${firstIndex} — ${lastIndex}`;
    }
    return `[${arg.join(', ')}]`;
  }
  if (typeof arg === 'object' && arg !== null) {
    return '[object Object]';
  }
  return String(arg);
};

const getFunctionInputs = (
  functionName: string,
  contractAddress: string,
  chainId: CHAINS,
) => {
  const abi = getContractAbi(contractAddress as any, chainId);
  if (!abi) return null;

  const functionAbi = abi.find(
    (item: any) => item.type === 'function' && item.name === functionName,
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

  if (!decodedCall || !decodedCall.functionName) {
    return (
      <CallWrapper style={{ paddingLeft: `${depth * 20}px` }}>
        <CallTitle>
          {id}. On <b>[{decodedCall?.contractName || 'Unknown'}]</b>
          <br />
          {decodedCall?.contractAddress && (
            <Link
              href={getEtherscanAddressLink(
                chainId,
                decodedCall.contractAddress,
              )}
            >
              {decodedCall?.contractAddress}
            </Link>
          )}
        </CallTitle>
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

  const callData = args?.length ? (
    args
      .map((arg, i) => {
        const formatted = formatArg(arg, chainId, id);
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
    <CallWrapper
      style={{
        paddingLeft: `${depth * 20}px`,
        marginBottom: '40px',
      }}
    >
      {isDualGovernanceCall && (
        <DGBadge>
          <DualGovernancePlainIcon />{' '}
          <Text weight={700} size="xxs" color="primary">
            Under Dual Governance
          </Text>
        </DGBadge>
      )}
      <CallTitle>
        {id}. On <b>[{decodedCall.contractName || 'Unknown'}]</b>
        <br />
        <Link
          href={getEtherscanAddressLink(chainId, decodedCall.contractAddress)}
        >
          {decodedCall.contractAddress}
        </Link>
      </CallTitle>
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

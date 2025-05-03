import { ReactNode } from 'react';
import { Link } from '@lidofinance/lido-ui';
import {
  CallTitle,
  CallWrapper,
  ScriptBox,
} from 'features/dual-governance/evm-script-parsed/full/style';

import { getEtherscanAddressLink } from 'utils/etherscan';
import { useLidoSDK } from 'providers/lido-sdk';
import { formatDecodedCallString } from 'features/dual-governance/evm-script-parsed/utils';
import { DecodedCall } from 'features/dual-governance/evm-script-parsed/utils/decode-calls';

type Props = {
  binary?: string;
  parentId?: string | number;
  calls?: DecodedCall[];
  children?: ReactNode;
};

// TODO: add nesting when the nested calls will be available from the contract

export const ScriptBody = ({ calls, binary, parentId, children }: Props) => {
  const { chainId } = useLidoSDK();

  if (children) {
    return (
      <CallWrapper>
        <ScriptBox>{children}</ScriptBox>
      </CallWrapper>
    );
  }

  if (!calls || calls.length === 0) {
    if (binary) {
      return (
        <CallWrapper>
          <ScriptBox>{binary}</ScriptBox>
        </CallWrapper>
      );
    }

    return null;
  }

  return (
    <>
      {calls.map((call, i) => {
        const id = i + 1;
        const { contractName, contractAddress } = call;

        return (
          <CallWrapper key={i}>
            <CallTitle size="xxs">
              {parentId !== undefined ? `${parentId}.${id}` : id}. On{' '}
              {contractName && (
                <>
                  [{contractName}]
                  <br />
                </>
              )}
              <Link href={getEtherscanAddressLink(chainId, contractAddress)}>
                {contractAddress}
              </Link>
            </CallTitle>

            <ScriptBox>{formatDecodedCallString(call)}</ScriptBox>
          </CallWrapper>
        );
      })}
    </>
  );
};

import { Link } from '@lidofinance/lido-ui';
import {
  CallTitle,
  CallWrapper,
  ScriptBox,
  NestedPadding,
} from 'features/dual-governance/proposals/shared-components/evm-script-parsed/full/style';

import { EVMScriptDecoded } from '@lidofinance/evm-script-decoder/lib/types';
import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import { getContractName } from 'utils/getContractName';
import { useLidoSDK } from 'providers/lido-sdk';
import { formatCallString } from '../utils';

type Props = {
  binary: string;
  decoded?: EVMScriptDecoded;
  parentId?: string | number;
};

export const ScriptBody = ({ binary, decoded, parentId }: Props) => {
  const { chainId } = useLidoSDK();
  if (!decoded?.calls.length) {
    return (
      <CallWrapper>
        <ScriptBox>{binary}</ScriptBox>
      </CallWrapper>
    );
  }

  return (
    <>
      {decoded.calls.map((call, i) => {
        const id = i + 1;
        const { address, abi, encodedCallData, decodedCallData } = call;
        const callString = formatCallString(id, abi, decodedCallData);
        const nestedScriptsIdxs = abi?.inputs?.reduce(
          (r, c, j) => (c.name === '_evmScript' ? [...r, j] : r),
          [] as number[],
        );
        const showNestedScripts =
          nestedScriptsIdxs && nestedScriptsIdxs.length > 0;
        const contractNameListed = getContractName(chainId, address);

        return (
          <CallWrapper key={i}>
            <CallTitle size="xxs">
              {parentId !== undefined ? `${parentId}.${id}` : id}. On{' '}
              {contractNameListed && (
                <>
                  [{contractNameListed}]
                  <br />
                </>
              )}
              <Link href={getEtherscanAddressLink(chainId, address)}>
                {address}
              </Link>
            </CallTitle>

            <ScriptBox>{callString.callString}</ScriptBox>

            {showNestedScripts && (
              <NestedPadding>
                {nestedScriptsIdxs.map((idx) => (
                  <ScriptBody
                    key={idx}
                    binary={encodedCallData}
                    decoded={decodedCallData?.[idx]}
                    parentId={id}
                  />
                ))}
              </NestedPadding>
            )}
          </CallWrapper>
        );
      })}
    </>
  );
};

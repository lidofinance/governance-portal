import { EVMScriptDecoded } from '@lidofinance/evm-script-decoder/lib/types';
import { getContractName } from 'utils/getContractName';
import { useLidoSDK } from 'providers/lido-sdk';
import { Text } from '@lidofinance/lido-ui';
import { formatCallString } from './utils';
import { CallTitle, CallWrapper } from './styles';

type Props = {
  binary: string;
  decoded?: EVMScriptDecoded;
  parentId?: string | number;
};

export const ProposalScriptParsed = ({ binary, decoded, parentId }: Props) => {
  const {
    core: { chainId },
  } = useLidoSDK();

  if (!decoded) return null;

  const callsMap = decoded.calls.map((call, i) => {
    const id = i + 1;
    const { address, abi, encodedCallData, decodedCallData, methodId } = call;

    // const callString = formatCallString(id, abi, decodedCallData);
    // console.log(abi, 'abi');
    const nestedScriptsIdxs = abi?.inputs?.reduce(
      (r, c, j) => (c.name === '_evmScript' ? [...r, j] : r),
      [],
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
      {callsMap.map(({ id, address, abi, contractNameListed }) => {
        return (
          <>
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
          </>
        );
      })}
    </>
  );
};

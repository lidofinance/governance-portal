import { ReactNode } from 'react';
import { CallWrapper, ScriptBox } from './style';
import { useFormatDecodedCallString } from './utils';
import { DecodedCall } from 'utils/decode-evm-script-calls';

type Props = {
  binary?: string;
  parentId?: string | number;
  calls?: DecodedCall[];
  children?: ReactNode;
};

export const ScriptBody = ({ calls, binary, parentId, children }: Props) => {
  const formatDecodedCallString = useFormatDecodedCallString();

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
        const id = parentId !== undefined ? `${parentId}.${i + 1}` : `${i + 1}`;
        return <ScriptBox key={id}>{formatDecodedCallString(call)}</ScriptBox>;
      })}
    </>
  );
};

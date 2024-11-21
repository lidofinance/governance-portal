import { Fragment } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { CallTitle, CallWrapper } from './style';

type DecodedCall = {
  id: number;
  contractName: string | undefined;
  decoded: {
    args: any;
    functionName: string | undefined;
  };
};

type Props = {
  calls: DecodedCall[];
};

export const ScriptBody = ({ calls }: Props) => {
  if (!calls) return null;
  return (
    <>
      {calls.map(({ id, contractName, decoded }) => (
        <Fragment key={`call-${id}`}>
          <CallWrapper>
            <Text size="sm" color="secondary">
              Call{' '}
              <CallTitle $warning={!decoded.functionName}>
                {decoded.functionName || 'Unknown method'}
              </CallTitle>
              <span>{' on '}</span>
              <CallTitle $warning={!contractName}>
                {contractName || 'Unknown contract'}
              </CallTitle>
            </Text>
          </CallWrapper>
        </Fragment>
      ))}
    </>
  );
};

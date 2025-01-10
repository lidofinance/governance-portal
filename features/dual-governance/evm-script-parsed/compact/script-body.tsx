import { Box, Text } from '@lidofinance/lido-ui';
import { CallTitle } from 'features/dual-governance/evm-script-parsed/compact/style';
import { DecodedCall } from 'features/dual-governance/evm-script-parsed/utils/decode-calls';

type Props = {
  calls: DecodedCall[];
};

export const ScriptBody = ({ calls }: Props) => {
  if (!calls) return null;
  return (
    <>
      {calls.map(({ id, contractName, decoded }) => (
        <Box marginBottom={8} key={`call-${id}`}>
          <Text size="sm" color="secondary">
            Call{' '}
            <CallTitle $warning={!decoded?.functionName}>
              {decoded?.functionName || 'Unknown method'}
            </CallTitle>
            <span>{' on '}</span>
            <CallTitle $warning={!contractName}>
              {contractName || 'Unknown contract'}
            </CallTitle>
          </Text>
        </Box>
      ))}
    </>
  );
};

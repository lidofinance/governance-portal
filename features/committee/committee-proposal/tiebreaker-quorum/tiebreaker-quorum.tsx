import { Text } from 'shared/components/text';
import { TiebreakerQuorumTable } from './style';
import { Button } from 'shared/components/button';
import { Box } from '@lidofinance/lido-ui';

export const TiebreakerQuorum = () => {
  return (
    <>
      <TiebreakerQuorumTable>
        <thead>
          <tr>
            <th align="left">
              <Text strong>Tiebreaker Quorum</Text>
            </th>
            <th align="left">
              <Text strong>4/4</Text>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Text>Committee 1</Text>
            </td>
            <td>
              <Text>3/4</Text>
            </td>
            <td>
              <Text color="secondary">Voted &quot;Yes&quot;</Text>
            </td>
          </tr>
          <tr>
            <td>
              <Text>Committee 2</Text>
            </td>
            <td>
              <Text>4/4</Text>
            </td>
            <td>
              <Text color="secondary">Voted &quot;Yes&quot;</Text>
            </td>
          </tr>
          <tr>
            <td>
              <Text>Committee 3</Text>
            </td>
            <td>
              <Text>2/4</Text>
            </td>
            <td>
              <Text color="secondary">Voted &quot;Yes&quot;</Text>
            </td>
          </tr>
        </tbody>
      </TiebreakerQuorumTable>
      <Box marginTop={12}>
        <Button fullwidth>Execute</Button>
      </Box>
    </>
  );
};

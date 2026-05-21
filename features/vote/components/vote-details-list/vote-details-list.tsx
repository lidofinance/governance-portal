import { Identicon, Link, trimAddress } from '@lidofinance/lido-ui';
import { useLidoSDK } from 'providers/lido-sdk';
import { useVoteContext } from '@vote/providers/vote-context';
import { getEtherscanAddressLink, getEtherscanTxLink } from 'utils/etherscan';
import { FormattedDate } from '../formatted-date';
import { List, Row, Label, Value, ProposerWrap } from './style';

export const VoteDetailsList = () => {
  const { chainId } = useLidoSDK();
  const { vote, eventStart, eventExecute } = useVoteContext();

  const creator = eventStart?.args.creator;
  const startTxHash = eventStart?.event.transactionHash;
  const executeBlock = eventExecute?.event.blockNumber;
  const executeTxHash = eventExecute?.event.transactionHash;

  return (
    <List>
      <Row>
        <Label>Proposer</Label>
        <Value>
          {creator ? (
            <ProposerWrap>
              <Identicon address={creator} diameter={16} />
              <Link href={getEtherscanAddressLink(chainId, creator)}>
                {trimAddress(creator, 4)}
              </Link>
            </ProposerWrap>
          ) : (
            '—'
          )}
        </Value>
      </Row>
      <Row>
        <Label>Started at</Label>
        <Value>
          <FormattedDate date={Number(vote.startDate)} format="MMM D, HH:mm" />
        </Value>
      </Row>
      <Row>
        <Label>Snapshot block</Label>
        <Value>
          {startTxHash ? (
            <Link href={getEtherscanTxLink(chainId, startTxHash)}>
              #{vote.snapshotBlock.toString()}
            </Link>
          ) : (
            `#${vote.snapshotBlock.toString()}`
          )}
        </Value>
      </Row>
      {executeBlock != null && executeTxHash && (
        <Row>
          <Label>Enacted on block</Label>
          <Value>
            <Link href={getEtherscanTxLink(chainId, executeTxHash)}>
              #{executeBlock.toString()}
            </Link>
          </Value>
        </Row>
      )}
    </List>
  );
};

import { Identicon, Link, trimAddress } from '@lidofinance/lido-ui';
import { useLidoSDK } from 'providers/lido-sdk';
import { useVoteContext } from '@vote/providers/vote-context';
import { getEtherscanTxLink } from 'utils/etherscan';
import { AddressPop } from 'shared/components/address-pop/address-pop';
import { List, Row, Label, Value, ProposerWrap } from './style';
import { FormattedDate } from 'shared/components/formatted-date';

export const VoteDetailsList = () => {
  const { chainId } = useLidoSDK();
  const { vote, eventStart, eventExecute } = useVoteContext();

  const creator = eventStart?.args.creator;
  const startTxHash = eventStart?.event.transactionHash;
  const executeTxHash = eventExecute?.event.transactionHash;

  return (
    <List>
      <Row>
        <Label>Proposer</Label>
        <Value>
          {creator ? (
            <AddressPop address={creator} isPaddingless isInline>
              <ProposerWrap>
                <Identicon address={creator} diameter={20} />
                {trimAddress(creator, 4)}
              </ProposerWrap>
            </AddressPop>
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
      {startTxHash && (
        <Row>
          <Label>Start TX</Label>
          <Value>
            <Link href={getEtherscanTxLink(chainId, startTxHash)}>
              {trimAddress(startTxHash, 4)}
            </Link>
          </Value>
        </Row>
      )}
      {executeTxHash && (
        <Row>
          <Label>Enact TX</Label>
          <Value>
            <Link href={getEtherscanTxLink(chainId, executeTxHash)}>
              {trimAddress(executeTxHash, 4)}
            </Link>
          </Value>
        </Row>
      )}
    </List>
  );
};

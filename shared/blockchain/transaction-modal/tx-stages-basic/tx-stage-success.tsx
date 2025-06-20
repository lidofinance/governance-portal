import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import { StageIconSuccess } from './icons';
import { TransactionModalContent } from '../transaction-modal-content';
import { Token } from '../../types';
import { TxAmount } from '../tx-stages-parts/tx-amount';
import { Text } from 'shared/components/text';
import { Link } from '@lidofinance/lido-ui';
import { Box } from '../../../components/box';

type TxStageSuccessProps = {
  txHash?: string | null;
  description: React.ReactNode;
  title: React.ReactNode;
  footer?: React.ReactNode;
  showEtherscan?: boolean;
  onClickEtherscan?: React.MouseEventHandler<HTMLAnchorElement>;
  amount?: bigint | null;
  nftIds?: string[] | object | null;
  token?: Token | 'ETH' | null;
  showStakeLink?: boolean;
};

export const TxStageSuccess = ({
  txHash,
  description,
  title,
  footer,
  showEtherscan = true,
  showStakeLink = false,
  onClickEtherscan,
  amount,
  nftIds,
  token,
}: TxStageSuccessProps) => {
  const _title = (
    <span>
      {title}{' '}
      {amount && token ? (
        <TxAmount amount={amount} token={token} />
      ) : nftIds ? (
        <>
          <span>
            NFTs: #{' '}
            {Array.isArray(nftIds)
              ? nftIds.join(', ')
              : Object.keys(nftIds).join(', ')}
          </span>
          {showStakeLink && (
            <Box marginTop={10}>
              <Text size={16}>
                To claim your ETH, please proceed to{' '}
                <Link href="https://stake.lido.fi/withdrawals/claim">
                  stake.lido.fi/withdrawals/claim
                </Link>
              </Text>
            </Box>
          )}
        </>
      ) : (
        ''
      )}
    </span>
  );

  return (
    <TransactionModalContent
      icon={<StageIconSuccess />}
      title={_title}
      description={description}
      footerHint={
        showEtherscan &&
        txHash && <TxLinkEtherscan txHash={txHash} onClick={onClickEtherscan} />
      }
      footer={footer}
    />
  );
};

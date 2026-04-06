import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import { StageIconSuccess } from './icons';
import { TransactionModalContent } from '../transaction-modal-content';
import { Token } from '../../types';
import { TxAmount } from '../tx-stages-parts/tx-amount';
import { Text } from 'shared/components/text';
import { Link } from '@lidofinance/lido-ui';
import { Box } from 'shared/components/box';
import { config } from 'config';
import { useStETHConversion } from '@dg/hooks/use-steth-conversion';

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
  shouldConvertShares?: boolean;
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
  shouldConvertShares = true,
}: TxStageSuccessProps) => {
  const { data: convertedStETHLockedShares } = useStETHConversion(
    token === Token.stETH && amount ? amount : 0n,
  );

  const _title = (
    <span>
      {title}{' '}
      {amount && token ? (
        <TxAmount
          amount={
            token === Token.stETH &&
            shouldConvertShares &&
            convertedStETHLockedShares
              ? convertedStETHLockedShares
              : amount
          }
          token={token}
        />
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
                <Link href={`${config.stakeOrigin}/withdrawals/claim`}>
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

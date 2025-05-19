import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import { StageIconSuccess } from './icons';
import { TransactionModalContent } from '../transaction-modal-content';
import { Token } from '../../types';
import { TxAmount } from '../tx-stages-parts/tx-amount';

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
};

export const TxStageSuccess = ({
  txHash,
  description,
  title,
  footer,
  showEtherscan = true,
  onClickEtherscan,
  amount,
  nftIds,
  token,
}: TxStageSuccessProps) => {
  const _title = (
    <span>
      You {title}{' '}
      {amount && token ? (
        <TxAmount amount={amount} token={token} />
      ) : nftIds ? (
        <span>
          NFTs: #{' '}
          {Array.isArray(nftIds)
            ? nftIds.join(', ')
            : Object.keys(nftIds).join(', ')}
        </span>
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

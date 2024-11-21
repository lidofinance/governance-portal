import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import { StageIconLoader } from './icons';
import { TransactionModalContent } from '../transaction-modal-content';

type TxStagePendingProps = {
  description?: React.ReactNode;
  title: React.ReactNode;
  txHash?: string | null;
};

export const TxStagePending = ({
  title,
  description,
  txHash,
}: TxStagePendingProps) => {
  return (
    <TransactionModalContent
      icon={<StageIconLoader />}
      title={title}
      description={description || 'Awaiting block confirmation'}
      footerHint={txHash && <TxLinkEtherscan txHash={txHash} />}
    />
  );
};

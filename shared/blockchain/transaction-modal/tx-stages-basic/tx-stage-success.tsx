import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import { StageIconSuccess } from './icons';
import { TransactionModalContent } from '../transaction-modal-content';

type TxStageSuccessProps = {
  txHash?: string | null;
  description: React.ReactNode;
  title: React.ReactNode;
  footer?: React.ReactNode;
  showEtherscan?: boolean;
  onClickEtherscan?: React.MouseEventHandler<HTMLAnchorElement>;
};

export const TxStageSuccess = ({
  txHash,
  description,
  title,
  footer,
  showEtherscan = true,
  onClickEtherscan,
}: TxStageSuccessProps) => {
  return (
    <TransactionModalContent
      icon={<StageIconSuccess />}
      title={title}
      description={description}
      footerHint={
        showEtherscan &&
        txHash && <TxLinkEtherscan txHash={txHash} onClick={onClickEtherscan} />
      }
      footer={footer}
    />
  );
};

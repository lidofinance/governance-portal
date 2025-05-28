import { Link } from '@lidofinance/lido-ui';
import { getEtherscanTxLink } from 'utils/etherscan';
import { useLidoSDK } from 'providers/lido-sdk';

type TxLinkEtherscanProps = {
  text?: string;
  txHash?: string | null;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export const TxLinkEtherscan = (props: TxLinkEtherscanProps) => {
  const { txHash, text = 'View on Etherscan', onClick } = props;
  const { chainId } = useLidoSDK();

  if (!txHash) return null;

  return (
    <Link onClick={onClick} href={getEtherscanTxLink(chainId, txHash)}>
      {text}
    </Link>
  );
};

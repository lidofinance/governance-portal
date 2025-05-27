import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';

type SuccessTextProps = {
  txHash?: string;
};

export const SuccessText = ({ txHash }: SuccessTextProps) => {
  return (
    <>
      {txHash && (
        <>
          <br />
          Transaction can be viewed on{' '}
          <TxLinkEtherscan txHash={txHash} text="Etherscan" />.
        </>
      )}
    </>
  );
};

import { TxStageSign } from '../tx-stages-basic/tx-stage-sign';
import { TxStagePending } from '../tx-stages-basic/tx-stage-pending';
import { TxAmount } from '../tx-stages-parts/tx-amount';
import { Token } from 'shared/blockchain/types';

type TxStageSignOperationAmountProps = {
  amount: bigint;
  token: Token;
  operationText: string;
  isPending?: boolean;
  txHash?: string;
};

export const TxStageSignOperationAmount = ({
  amount,
  token,
  operationText,
  isPending,
  txHash,
}: TxStageSignOperationAmountProps) => {
  const amountEl = <TxAmount amount={amount} token={token} />;

  const Component = isPending ? TxStagePending : TxStageSign;

  return (
    <Component
      txHash={txHash}
      title={
        <>
          You are {operationText.toLowerCase()} {amountEl}
        </>
      }
      description={
        !isPending && (
          <>
            {operationText} {amountEl}.{' '}
          </>
        )
      }
    />
  );
};

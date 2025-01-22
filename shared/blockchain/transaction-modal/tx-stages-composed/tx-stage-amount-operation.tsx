import { TxStageSign } from '../tx-stages-basic';
import { TxStagePending } from '../tx-stages-basic';
import { TxAmount } from '../tx-stages-parts/tx-amount';
import { Token } from 'shared/blockchain/types';
import { EscrowActionArgs } from 'features/dual-governance/types';

type CommonProps = {
  operationText: string;
  isPending?: boolean;
  txHash?: string;
};

type Props = CommonProps & EscrowActionArgs;

export const TxStageSignOperationAmount = (props: Props) => {
  const { token, operationText, isPending, txHash } = props;
  const Component = isPending ? TxStagePending : TxStageSign;

  if (token === Token.unstETH) {
    const nftString = props.ids.map((id) => `#${id}`).join(', ');

    const s = props.ids.length > 1 ? 's' : '';

    return (
      <Component
        txHash={txHash}
        title={
          <>
            You are {operationText.toLowerCase()} {props.ids.length} NFT{s}
          </>
        }
        description={
          !isPending && (
            <>
              {operationText} following NFT{s}: {nftString}.
            </>
          )
        }
      />
    );
  }

  const amountEl = <TxAmount amount={props.amount} token={token} />;

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

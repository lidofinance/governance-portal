import { TxStageSign } from '../tx-stages-basic';
import { TxStagePending } from '../tx-stages-basic';
import { TxAmount } from '../tx-stages-parts/tx-amount';
import { Token } from 'shared/blockchain/types';
import { EscrowActionWithEthArgs } from 'features/dual-governance/types';

type CommonProps = {
  operationText: string;
  isPending?: boolean;
  txHash?: string;
};

type Props = CommonProps & EscrowActionWithEthArgs;

export const TxStageSignOperationAmount = (props: Props) => {
  const { token, operationText, isPending, txHash } = props;
  const Component = isPending ? TxStagePending : TxStageSign;

  if (token === Token.unstETH) {
    const nftString = Array.isArray(props.selectedNftIds)
      ? props.selectedNftIds.map((id) => `#${id}`).join(', ')
      : Object.keys(props.selectedNftIds)
          .map((id) => `#${id}`)
          .join(', ');

    const s = props.selectedNftIds.length > 1 ? 's' : '';

    return (
      <Component
        txHash={txHash}
        title={
          <>
            You are {operationText.toLowerCase()} {props.selectedNftIds.length}{' '}
            NFT{s}
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

  const operationTextFormatted = operationText.toLowerCase();

  return (
    <Component
      txHash={txHash}
      title={
        <>
          You are{' '}
          {operationTextFormatted === 'approving'
            ? operationTextFormatted
            : `${operationTextFormatted} with`}{' '}
          {amountEl}
        </>
      }
      description=""
    />
  );
};

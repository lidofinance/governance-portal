import { TxStageSign } from '../tx-stages-basic/tx-stage-sign';
import { TxStagePending } from '../tx-stages-basic/tx-stage-pending';

type Props = {
  ids: string[];
  operationText: string;
  isPending?: boolean;
  txHash?: string;
};

export const TxStageSignOperationNftAmount = ({
  ids,
  operationText,
  isPending,
  txHash,
}: Props) => {
  const Component = isPending ? TxStagePending : TxStageSign;

  const nftString = ids.map((id) => `#${id}`).join(', ');

  const s = ids.length > 1 ? 's' : '';

  return (
    <Component
      txHash={txHash}
      title={
        <>
          You are {operationText.toLowerCase()} {ids.length} NFT{s}
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
};

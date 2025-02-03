import { getGeneralTransactionModalStages } from 'shared/blockchain/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/blockchain/transaction-modal/hooks/use-transaction-modal-stage';
import {
  TxStageFail,
  TxStagePending,
  TxStageSuccess,
  TxStageSign,
} from 'shared/blockchain/transaction-modal/tx-stages-basic';

const getTxModalStagesClaimCustomNft = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  signStage: (nftId: number) =>
    transitStage(
      <TxStageSign title={`You are claiming NFT #${nftId}`} description="" />,
    ),
  pendingStage: (nftId: number) =>
    transitStage(<TxStagePending title={`You are claiming NFT #${nftId}`} />),
  successStage: ({ txHash, nftId }: { txHash: string; nftId: number }) =>
    transitStage(
      <TxStageSuccess
        title="Success"
        description={`NFT #${nftId} was successfully claimed`}
        txHash={txHash}
        showEtherscan
      />,
    ),
  failureStage: () => transitStage(<TxStageFail />),
});

export const useClaimCustomNftTxModal = () => {
  return useTransactionModalStage(getTxModalStagesClaimCustomNft);
};

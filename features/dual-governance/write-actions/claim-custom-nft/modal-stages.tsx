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

  signStage: (selectedNftIds: string[]) =>
    transitStage(
      <TxStageSign
        title={`You are claiming NFTs #${selectedNftIds.join(', #')}`}
        description=""
      />,
    ),
  pendingStage: (selectedNftIds: string[]) =>
    transitStage(
      <TxStagePending
        title={`You are claiming NFTs #${selectedNftIds.join(', #')}`}
      />,
    ),
  successStage: ({
    txHash,
    selectedNftIds,
  }: {
    txHash: string;
    selectedNftIds: string[];
  }) =>
    transitStage(
      <TxStageSuccess
        title="Success"
        description={`NFTs #${selectedNftIds.join(', #')} were successfully claimed`}
        txHash={txHash}
        showEtherscan
      />,
    ),
  failureStage: () => transitStage(<TxStageFail />),
});

export const useClaimCustomNftTxModal = () => {
  return useTransactionModalStage(getTxModalStagesClaimCustomNft);
};

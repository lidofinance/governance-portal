import { getErrorMessage, TxSentDataUnavailableError } from 'utils';
import type { TransactionModalTransitStage } from './use-transaction-modal-stage';
import { TxStageFail, TxStageSuccessMultisig } from '../tx-stages-basic';

export const getGeneralTransactionModalStages = (
  transitStage: TransactionModalTransitStage,
) => ({
  successMultisig: () =>
    transitStage(<TxStageSuccessMultisig />, {
      isClosableOnLedger: true,
    }),
  failed: (error: unknown, onRetry?: () => void) =>
    transitStage(
      <TxStageFail
        failedText={getErrorMessage(error)}
        onRetry={
          error instanceof TxSentDataUnavailableError ? undefined : onRetry
        }
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

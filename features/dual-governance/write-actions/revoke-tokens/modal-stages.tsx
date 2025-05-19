import { getEscrowActionModalStages } from 'shared/blockchain/transaction-modal/hooks/get-escrow-action-modal-stages';
import { useTransactionModalStage } from 'shared/blockchain/transaction-modal/hooks/use-transaction-modal-stage';

export const useRevokeTokensModalStages = () =>
  useTransactionModalStage(getEscrowActionModalStages('revoking', 'revoked'));

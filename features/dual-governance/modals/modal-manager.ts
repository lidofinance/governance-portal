import { getUseModal } from 'providers/modal-provider';
import { RevokeNftModal } from './revoke-nft-modal';
import { ClaimCustomNftModal } from './claim-custom-nft-modal';
import { DepositingModal } from './depositing-modal';
import { VerifyDepositModal } from './verify-deposit-modal';

export const useRevokeNftModal = getUseModal(RevokeNftModal);
export const useClaimCustomNftModal = getUseModal(ClaimCustomNftModal);
export const useDepositingModal = getUseModal(DepositingModal);
export const useVerifyDepositModal = getUseModal(VerifyDepositModal);

import { getUseModal } from 'providers/modal-provider';
import { RevokeUnstEthModal } from './revoke-unsteth-modal';
import { ClaimCustomNftModal } from './claim-custom-nft-modal';
import { DepositingModal } from './depositing-modal';
import { VerifyDepositModal } from './verify-deposit-modal';

export const useRevokeUnstEthModal = getUseModal(RevokeUnstEthModal);
export const useClaimCustomNftModal = getUseModal(ClaimCustomNftModal);
export const useDepositingModal = getUseModal(DepositingModal);
export const useVerifyDepositModal = getUseModal(VerifyDepositModal);

import { getUseModal } from 'providers/modal-provider';
import { SelectUnstEthModal } from './select-unsteth-modal';
import { ClaimCustomNftModal } from './claim-custom-nft-modal';
// import { DepositingModal } from './depositing-modal';
// import { VerifyDepositModal } from './verify-deposit-modal';

export const useSelectUnstethModal = getUseModal(SelectUnstEthModal);
export const useClaimCustomNftModal = getUseModal(ClaimCustomNftModal);
// export const useDepositingModal = getUseModal(DepositingModal);
// export const useVerifyDepositModal = getUseModal(VerifyDepositModal);

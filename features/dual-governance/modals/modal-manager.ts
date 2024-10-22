import { getUseModal } from 'providers/modal-provider';
import { RevokeNftModal } from './revoke-nft-modal';
import { ClaimCustomNftModal } from './claim-custom-nft-modal';

export const useRevokeNftModal = getUseModal(RevokeNftModal);
export const useClaimCustomNftModal = getUseModal(ClaimCustomNftModal);

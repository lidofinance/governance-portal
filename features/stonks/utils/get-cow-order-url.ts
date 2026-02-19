import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { COW_EXPLORER_URL } from 'shared/blockchain/constants';

export const getCowOrderUrl = (
  orderUid: string | undefined,
  chainId: CHAINS,
) => {
  if (!orderUid || chainId !== CHAINS.Mainnet) {
    return null;
  }

  return `${COW_EXPLORER_URL}/orders/${orderUid}`;
};

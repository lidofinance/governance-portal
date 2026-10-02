import { constants } from 'ethers';
import { PublicDelegate } from '../types';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Snapshot, Voting } from 'shared/blockchain/contracts';
import { getPublicDelegate } from '../utils/get-public-delegate';
import { SNAPSHOT_LIDO_SPACE_NAME } from '../constants';

export const useDelegationInfo = () => {
  const { chainId } = useLidoSDK();
  const account = useAccount();
  const votingContract = useReadContract(Voting);
  const snapshotContract = useReadContract(Snapshot);

  return useQuery({
    queryKey: [
      'use-delegation-info',
      chainId,
      account.address,
      votingContract.address,
    ],
    enabled: !!account.address,
    queryFn: async () => {
      if (!account.address) {
        return null;
      }

      let aragonDelegateAddress: string | null = (
        await votingContract.readContract('getDelegate', [account.address])
      ).toLowerCase();
      let aragonPublicDelegate: PublicDelegate | null = null;
      if (aragonDelegateAddress === constants.AddressZero) {
        aragonDelegateAddress = null;
      } else {
        aragonPublicDelegate = getPublicDelegate(aragonDelegateAddress);
      }

      let snapshotDelegateAddress: string | null = null;
      snapshotDelegateAddress = (
        await snapshotContract.readContract('delegation', [
          account.address,
          SNAPSHOT_LIDO_SPACE_NAME,
        ])
      ).toLowerCase();
      let snapshotPublicDelegate: PublicDelegate | null = null;
      if (snapshotDelegateAddress === constants.AddressZero) {
        snapshotDelegateAddress = null;
      } else {
        snapshotPublicDelegate = getPublicDelegate(snapshotDelegateAddress);
      }

      return {
        aragonDelegateAddress,
        aragonPublicDelegate,
        snapshotDelegateAddress,
        snapshotPublicDelegate,
      };
    },
  });
};

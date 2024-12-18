import { Loader, ModalProps, Text } from '@lidofinance/lido-ui';
import { StyledModal } from './style';
import { Button } from 'shared/components/button';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { WithdrawalQueue } from 'shared/blockchain/contracts';
import { useAccount } from 'wagmi';
import { NftMultiselectItem } from '../nft-multiselect';
import { useSimpleReducer } from 'shared/hooks';

type Props = {
  unstEthIds: bigint[];
} & ModalProps;

type UnstEth = {
  amountOfStETH: bigint;
  amountOfShares: bigint;
  owner: `0x${string}`;
  timestamp: bigint;
  isFinalized: boolean;
  isClaimed: boolean;
};

const getUnstEthStatus = (unstEth: UnstEth) => {
  if (unstEth.isFinalized) {
    return 'Finalized';
  }
  if (unstEth.isClaimed) {
    return 'Claimed';
  }
  return 'Not finalized';
};

export const RevokeUnstEthModal = ({ unstEthIds, ...modalProps }: Props) => {
  const { address } = useAccount();
  const { chainId } = useLidoSDK();
  const withdrawalQueue = useReadContract(WithdrawalQueue);

  const [selectedNftIds, setSelectedNftIds] = useSimpleReducer<
    Record<string, boolean>
  >({});

  const handleNftSelect = (id: string) => () => {
    setSelectedNftIds({ [id]: !selectedNftIds[id] });
  };

  const { data: unstEthItems, isLoading } = useQuery({
    queryKey: ['locked-unsteth-data', chainId, address],
    enabled: unstEthIds.length > 0,
    queryFn: async () => {
      const withdrawalRequests = await withdrawalQueue.readContract(
        'getWithdrawalStatus',
        [unstEthIds],
      );

      return unstEthIds.map((id, index) => ({
        id: id.toString(),
        stEthAmount: withdrawalRequests[index].amountOfStETH,
        status: getUnstEthStatus(withdrawalRequests[index]),
      }));
    },
  });

  return (
    <StyledModal
      {...modalProps}
      title={
        <Text size="lg" strong>
          Select NFTs to revoke
        </Text>
      }
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {unstEthItems?.map(({ id, stEthAmount }) => (
            <NftMultiselectItem
              key={id}
              id={id}
              stEthAmount={stEthAmount}
              checked={selectedNftIds[id]}
              onClick={handleNftSelect(id)}
            />
          ))}
        </div>
      )}
      <div>
        <Button>revoke</Button>
        <Button onClick={modalProps.onClose}>Close</Button>
      </div>
    </StyledModal>
  );
};

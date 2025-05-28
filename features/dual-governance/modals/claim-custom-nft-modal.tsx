import { ChangeEvent, useCallback } from 'react';
import { useState, useEffect } from 'react';
import { ModalProps, Text } from '@lidofinance/lido-ui';
import { StyledModal, StyledInput } from './style';
import { ActionsWrapper } from '../nft-multiselect/style';
import { Button } from 'shared/components/button';
import { DGTooltip } from '../tooltips';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { WithdrawalQueue } from 'shared/blockchain/contracts';
import {
  NftMultiselectItem,
  NftWithdrawalRequestReturnType,
} from '../nft-multiselect';
import { formatEth } from 'shared/blockchain/utils';
import { Address } from 'viem';

type Props = {
  claimNFTs: (
    selectedNftIds: string[],
    escrowAddress: Address,
  ) => Promise<boolean | undefined>;
  historicalEscrowAddresses?: Address[] | null;
} & ModalProps;

type CTAProps = {
  onClick: () => void;
  nftId: string;
  nftData: NftWithdrawalRequestReturnType | null;
  isLoading: boolean;
  historicalEscrowAddresses?: Address[] | null;
};

const CTA = ({
  onClick,
  nftId,
  nftData,
  isLoading,
  historicalEscrowAddresses,
}: CTAProps) => {
  if (!nftId) {
    return (
      <Button loading={isLoading} disabled>
        Enter NFT Token ID
      </Button>
    );
  }

  if (!nftData) {
    return (
      <Button loading={isLoading} disabled>
        NFT not found
      </Button>
    );
  }

  if (nftData && !nftData.isFinalized) {
    return (
      <Button loading={isLoading} disabled>
        NFT is not finalized
      </Button>
    );
  }

  if (nftData && nftData.isFinalized && nftData.isClaimed) {
    return (
      <Button loading={isLoading} disabled>
        NFT is already claimed
      </Button>
    );
  }

  if (
    nftData &&
    !nftData.isClaimed &&
    nftData.isFinalized &&
    nftData.amountOfStETH !== 0n
  ) {
    // Check if the NFT owner is a RageQuit escrow address
    const isOwnerRageQuitEscrow =
      historicalEscrowAddresses &&
      historicalEscrowAddresses.some(
        (escrowAddress) =>
          escrowAddress.toLowerCase() === nftData.owner.toLowerCase(),
      );

    if (!isOwnerRageQuitEscrow) {
      return (
        <Button loading={isLoading} disabled>
          NFT owner is not a RageQuit escrow
        </Button>
      );
    }

    return (
      <Button
        onClick={onClick}
        loading={isLoading}
      >{`Claim ${formatEth(nftData.amountOfStETH)} ETH`}</Button>
    );
  }

  return null;
};

export const ClaimCustomNftModal = ({
  claimNFTs,
  historicalEscrowAddresses,
  ...modalProps
}: Props) => {
  const withdrawalQueueContract = useReadContract(WithdrawalQueue);

  const [nftId, setNftId] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [nft, setNft] = useState<NftWithdrawalRequestReturnType | null>(null);
  const [isCTALoading, setCTALoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(nftId);
    }, 500);

    if (nftId === '') {
      setNft(null);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [nftId]);

  const searchNft = useCallback(async (value: string) => {
    if (!value || !withdrawalQueueContract) return;

    setCTALoading(true);

    try {
      const nftStatus = await withdrawalQueueContract.readContract(
        'getWithdrawalStatus',
        [[BigInt(value)]],
      );

      if (nftStatus.length === 1) {
        setNft(nftStatus[0]);
      } else {
        setNft(null);
      }
    } catch (error) {
      console.error('Error fetching NFT status:', error);
      setNft(null);
    } finally {
      setCTALoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void searchNft(debouncedValue);
  }, [debouncedValue, searchNft]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNftId(event.target.value);
  };

  const handleClaim = useCallback(async () => {
    try {
      await claimNFTs([nftId], nft?.owner as Address);
    } catch (error) {
      console.error('Unable to claim NFT:', error);
    }
  }, [claimNFTs, nft?.owner, nftId]);

  const Title = () => (
    <Text size="lg" strong>
      Claim custom NFTs <DGTooltip topic="customNFT" />
    </Text>
  );

  return (
    <StyledModal title={<Title />} {...modalProps}>
      <StyledInput
        onChange={handleInputChange}
        value={nftId}
        fullwidth
        type="number"
        placeholder="Enter NFT Token ID"
      ></StyledInput>
      {nft && (
        <NftMultiselectItem
          id={nftId}
          stEthAmount={nft.amountOfStETH}
          onClick={() => {}}
          customNftData={nft}
        ></NftMultiselectItem>
      )}
      <ActionsWrapper>
        <CTA
          isLoading={isCTALoading}
          onClick={handleClaim}
          nftId={nftId}
          nftData={nft}
          historicalEscrowAddresses={historicalEscrowAddresses}
        />
        {/*<Button onClick={closeModal}>Close</Button>*/}
        <Button variant="outlined">Close</Button>
      </ActionsWrapper>
    </StyledModal>
  );
};

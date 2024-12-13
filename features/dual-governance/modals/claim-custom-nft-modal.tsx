import { ChangeEvent, useCallback } from 'react';
import { ModalProps, Text } from '@lidofinance/lido-ui';
import { StyledModal, StyledInput } from './style';

// import { NftItem } from '../nft/nft-multiselect-item';
// import { NftData } from '../nft/types';
import { ActionsWrapper } from '../nft-multiselect/style';
import { Button } from 'shared/components/button';

const mockNft = {
  id: 10423,
  amount: 103.740782,
  finalized: true,
};

type Props = {
  closeModal: () => void;
} & ModalProps;

export const ClaimCustomNftModal = ({ closeModal, ...modalProps }: Props) => {
  const handleInputSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const nftId: any = e.target.value;
    console.log(nftId);
    // Todo: check if nft exists on escrow contract using WQ, get NFT from WQ, check if it's finalized using WQ
  }, []);

  const Title = () => (
    <Text size="lg" strong>
      Claim custom NFTs
    </Text>
  );

  // Todo: check if we need a number input or if we should start search with #

  return (
    <StyledModal title={<Title />} {...modalProps}>
      <StyledInput onChange={handleInputSearch} fullwidth></StyledInput>
      {/* <NftItem nft={mockNft}></NftItem> */}
      <ActionsWrapper>
        <Button>{`Claim ${mockNft.amount} ETH`}</Button>
        <Button onClick={closeModal}>Close</Button>
      </ActionsWrapper>
    </StyledModal>
  );
};

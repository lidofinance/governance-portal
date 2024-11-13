import { ModalProps, Text } from '@lidofinance/lido-ui';
import { StyledModal, ButtonsWrapper } from './style';
import { RevokeClaimNft } from '../nft/revoke-claim-nft';
import { NftData } from 'features/dual-governance/nft/types';
import { Button } from 'shared/components/button';

type Props = {
  items: NftData[];
} & ModalProps;

export const RevokeNftModal = ({ items, ...modalProps }: Props) => {
  const Title = () => (
    <Text size="lg" strong>
      Select NFTs to revoke
    </Text>
  );

  return (
    <StyledModal title={<Title />} {...modalProps}>
      <RevokeClaimNft items={items} selectable>
        <ButtonsWrapper>
          <Button>Revoke</Button>
          <Button>Close</Button>
        </ButtonsWrapper>
      </RevokeClaimNft>
    </StyledModal>
  );
};

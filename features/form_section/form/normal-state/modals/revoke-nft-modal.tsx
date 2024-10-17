import { ModalProps, Text } from '@lidofinance/lido-ui';
import { StyledModal, ButtonsWrapper } from './style';
import { RevokeClaimNft } from '../../nft/revoke-claim-nft';
import { ActionButton } from 'shared/components/action-button';

// TODO: link items type with NFTData type
type Props = {
  items: any;
} & Omit<ModalProps, 'as'>;

export const RevokeNftModal = ({ items, ...modalProps }: Props) => {
  const Title = () => (
    <Text size="lg" strong>
      Select NFTs to revoke
    </Text>
  );

  return (
    <StyledModal title={<Title />} {...modalProps}>
      <RevokeClaimNft items={items}>
        <ButtonsWrapper>
          <ActionButton type="primary">Revoke</ActionButton>
          <ActionButton type="secondary">Close</ActionButton>
        </ButtonsWrapper>
      </RevokeClaimNft>
    </StyledModal>
  );
};

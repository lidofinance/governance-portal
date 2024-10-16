import { ModalProps, Text } from '@lidofinance/lido-ui';
import { StyledModal, ButtonsWrapper } from './style';
import { RevokeClaimNft } from '../revoke-form/nft/revoke-claim-nft';
import { ActionButton } from 'shared/components/action-button';

export const RevokeNftModal = ({ items, ...modalProps }: ModalProps) => {
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

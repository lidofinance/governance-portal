import { ModalProps, Text } from '@lidofinance/lido-ui';
import { StyledModal } from './style';

type Props = {
  items: any[];
} & ModalProps;

export const RevokeNftModal = ({ items, ...modalProps }: Props) => {
  const Title = () => (
    <Text size="lg" strong>
      Select NFTs to revoke
    </Text>
  );

  return (
    <StyledModal title={<Title />} {...modalProps}>
      {/* <RevokeClaimNft items={items} selectable>
        <ButtonsWrapper>
          <Button>Revoke</Button>
          <Button>Close</Button>
        </ButtonsWrapper>
      </RevokeClaimNft> */}
    </StyledModal>
  );
};

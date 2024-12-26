import { Token } from 'shared/blockchain/types';
import { RevokeStEthPopupItem, RevokeStEthPopupStyled } from './style';
import { formatEth, getTokenIcon } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';

type Props = {
  anchorRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  stEthAmount: bigint;
  wstEthAmount: bigint;
  onClose: () => void;
  onRevoke: (token: Token) => () => void;
};

export const RevokeStEthPopup = (props: Props) => {
  const { anchorRef, isOpen, stEthAmount, wstEthAmount, onRevoke, onClose } =
    props;

  return (
    <RevokeStEthPopupStyled
      anchorRef={anchorRef}
      onClose={onClose}
      variant="default"
      open={isOpen}
      placement="bottomRight"
    >
      <RevokeStEthPopupItem onClick={onRevoke(Token.stETH)}>
        <div>
          {getTokenIcon(Token.stETH)}
          <Text weight={600} as="span">
            Revoke in {Token.stETH}
          </Text>
        </div>
        <Text size={14} color="secondary">
          {formatEth(stEthAmount)} {Token.stETH}
        </Text>
      </RevokeStEthPopupItem>

      <RevokeStEthPopupItem onClick={onRevoke(Token.wstETH)}>
        <div>
          {getTokenIcon(Token.wstETH)}
          <Text weight={600} as="span">
            Revoke in {Token.wstETH}
          </Text>
        </div>
        <Text size={14} color="secondary">
          {formatEth(wstEthAmount)} {Token.wstETH}
        </Text>
      </RevokeStEthPopupItem>
    </RevokeStEthPopupStyled>
  );
};

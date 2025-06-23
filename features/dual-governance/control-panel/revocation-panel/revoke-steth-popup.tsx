import { Token } from 'shared/blockchain/types';
import { RevokeStEthPopupItem, RevokeStEthPopupStyled } from './style';
import { formatEth, getTokenIcon } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';
import { useStETHConversion } from 'features/dual-governance/hooks/use-steth-conversion';

type Props = {
  anchorRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  stEthAmount: bigint;
  onClose: () => void;
  onRevoke: (token: Token) => () => void;
};

export const RevokeStEthPopup = (props: Props) => {
  const { anchorRef, isOpen, stEthAmount, onRevoke, onClose } = props;

  const { data: convertedStETHLockedShares } = useStETHConversion(stEthAmount);

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
        {convertedStETHLockedShares ? (
          <Text size={14} color="secondary">
            {formatEth(convertedStETHLockedShares)} {Token.stETH}
          </Text>
        ) : (
          <Text size={14} color="secondary">
            {formatEth(stEthAmount)} {Token.stETH}
          </Text>
        )}
      </RevokeStEthPopupItem>

      <RevokeStEthPopupItem onClick={onRevoke(Token.wstETH)}>
        <div>
          {getTokenIcon(Token.wstETH)}
          <Text weight={600} as="span">
            Revoke in {Token.wstETH}
          </Text>
        </div>
        <Text size={14} color="secondary">
          {formatEth(stEthAmount)} {Token.wstETH}
        </Text>
      </RevokeStEthPopupItem>
    </RevokeStEthPopupStyled>
  );
};

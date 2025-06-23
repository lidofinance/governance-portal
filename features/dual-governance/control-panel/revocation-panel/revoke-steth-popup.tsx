import { Token } from 'shared/blockchain/types';
import { RevokeStEthPopupItem, RevokeStEthPopupStyled } from './style';
import { formatEth, getTokenIcon } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { StETH } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';

type Props = {
  anchorRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  stEthAmount: bigint;
  onClose: () => void;
  onRevoke: (token: Token) => () => void;
};

export const RevokeStEthPopup = (props: Props) => {
  const { anchorRef, isOpen, stEthAmount, onRevoke, onClose } = props;

  const { chainId } = useLidoSDK();

  const readStEthContract = useReadContract(StETH);

  const { data: convertedStethLockedShares } = useQuery({
    queryKey: ['converted-steth-locked-shares', Number(stEthAmount), chainId],
    queryFn: async (): Promise<bigint> => {
      if (!readStEthContract) {
        throw new Error('readStEthContract must be defined');
      }

      if (!stEthAmount) {
        throw new Error('stEthAmount must be defined');
      }

      return await readStEthContract.readContract('getPooledEthByShares', [
        stEthAmount,
      ]);
    },
    enabled: !!readStEthContract && !!stEthAmount && stEthAmount > 0n,
  });

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
        {convertedStethLockedShares ? (
          <Text size={14} color="secondary">
            {formatEth(convertedStethLockedShares)} {Token.wstETH}
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

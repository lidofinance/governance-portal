import { ButtonIcon, Copy } from '@lidofinance/lido-ui';
import { Wrap } from './style';
import { useCopyToClipboard } from 'shared/hooks';
import { ButtonExternalView } from './button-external-view';
import { openWindow } from 'utils/open-window';
import { getEtherscanLink } from 'utils/etherscan';
import { useLidoSDK } from 'providers/lido-sdk';

type Props = {
  value: string | null | undefined;
  entity: 'address' | 'tx' | 'token';
};

export const CopyOpenActions = ({ value, entity }: Props) => {
  const { chainId } = useLidoSDK();
  const handleCopy = useCopyToClipboard(value ?? '');

  const copyText =
    entity === 'address' ? 'address' : entity === 'tx' ? 'hash' : 'token';

  return (
    <Wrap>
      <ButtonIcon
        onClick={(e) => {
          e.stopPropagation();
          handleCopy();
        }}
        icon={<Copy />}
        size="xs"
        variant="ghost"
        data-testid="copyAddressBtn"
      >
        Copy {copyText}
      </ButtonIcon>
      <ButtonExternalView
        onClick={() =>
          openWindow(getEtherscanLink(chainId, value ?? '', entity))
        }
        variant="ghost"
        data-testid="etherscanBtn"
      >
        View on Etherscan
      </ButtonExternalView>
    </Wrap>
  );
};

import { useCallback, useRef, useState } from 'react';
import { Link, Text, PopupMenu } from '@lidofinance/lido-ui';
import { ReactComponent as StethIcon } from 'assets/icons/tokens/steth.svg';
import { ReactComponent as WstethIcon } from 'assets/icons/tokens/wsteth.svg';
import { ReactComponent as UnstethIcon } from 'assets/icons/tokens/unsteth.svg';
import { ReactComponent as RevokeIcon } from 'assets/icons/circle-arrow-down.svg';
import { Tokens } from 'types/tokens';
import { useRevokeNftModal } from '../modals/modal-manager';

import { RevokeItemsWrapper, RevokeItem, RevokeAction } from './style';
import { ActionButton, ActionsWrapper } from '../support-form/style';

type RevokableTokens = Exclude<Tokens, Tokens.UNSTETH>;

const mockNftData = [
  {
    id: 10423,
    amount: 103.740782,
    finalized: true,
  },
  {
    id: 10456,
    amount: 6574.1856746,
    finalized: true,
  },
  {
    id: 10435,
    amount: 105432.008721,
    finalized: false,
  },
  {
    id: 10463,
    amount: 543.543120598,
    finalized: false,
  },
  {
    id: 15545,
    amount: 124.72345,
    finalized: true,
  },
];

export const RevokeForm = () => {
  /**
   *  State
   */

  const [isRevokeTokenMenuOpen, setIsRevokeTokenMenuOpen] = useState(false);

  /**
   *  Refs
   */

  const revokeStEtfButtonRef = useRef(null);
  const revokeNftItemRef = useRef(null);

  /**
   *  Hooks data
   */

  const { openModal: openRevokeNftModal } = useRevokeNftModal();

  /**
   *  Handlers
   */
  const handleRevokeStETH = useCallback((token: RevokableTokens) => {
    // Token to revoke stETH in - steth | wsteth,
    console.log(token);
  }, []);

  const handleNftRevoke = useCallback(() => {
    openRevokeNftModal({ items: mockNftData });
  }, [openRevokeNftModal]);

  return (
    <>
      <PopupMenu
        anchorRef={revokeStEtfButtonRef}
        onClose={() => setIsRevokeTokenMenuOpen(false)}
        themeOverride="light"
        variant="default"
        open={isRevokeTokenMenuOpen}
        placement="bottomRight"
      >
        <RevokeItem
          $plain
          $interactive
          onClick={() => handleRevokeStETH(Tokens.STETH)}
        >
          <StethIcon />
          <Text size="lg" strong>
            Revoke in stETH
          </Text>
          <Text size="lg" color="secondary">
            480,000.0317 stETH
          </Text>
        </RevokeItem>
        <RevokeItem
          $plain
          $interactive
          onClick={() => handleRevokeStETH(Tokens.WSTETH)}
        >
          <WstethIcon />
          <Text size="lg" strong>
            Revoke in wstETH
          </Text>
          <Text size="lg" color="secondary">
            424,052.7103 wstETH
          </Text>
        </RevokeItem>
      </PopupMenu>
      <Text style={{ marginBottom: '24px' }}>
        Your Tokens in VetoSignaling <Link>contract</Link>
      </Text>
      <RevokeItemsWrapper>
        <RevokeItem>
          <StethIcon />
          <Text size="lg" strong>
            480,000.0317 stETH
          </Text>
          <RevokeAction
            ref={revokeStEtfButtonRef}
            onClick={() => setIsRevokeTokenMenuOpen(true)}
          >
            <Text>Revoke</Text>
            <RevokeIcon />
          </RevokeAction>
        </RevokeItem>
        <RevokeItem ref={revokeNftItemRef}>
          <WstethIcon />
          <Text size="lg" strong>
            2.3153 unstETH
          </Text>
          <Text color="secondary" size="lg" strong>
            {mockNftData.length} NFT
          </Text>
          <RevokeAction onClick={handleNftRevoke}>
            <Text>Revoke</Text>
            <RevokeIcon />
          </RevokeAction>
        </RevokeItem>
      </RevokeItemsWrapper>
      <Text
        style={{ marginTop: '26px', marginBottom: '24px', marginLeft: '2px' }}
      >
        Your Tokens in VetoSignaling <Link>contract</Link>
      </Text>
      <RevokeItemsWrapper>
        <RevokeItem>
          <UnstethIcon />
          <Text size="lg" strong>
            480,000.0317 stETH
          </Text>
        </RevokeItem>
      </RevokeItemsWrapper>
      <ActionsWrapper>
        <ActionButton>
          <Text>Revoke all available</Text>
        </ActionButton>
      </ActionsWrapper>
    </>
  );
};

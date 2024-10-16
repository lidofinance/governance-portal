import { useCallback, useRef, useState, useEffect } from 'react';
import { Link, Text, PopupMenu } from '@lidofinance/lido-ui';
import { ReactComponent as StethIcon } from 'assets/icons/tokens/steth.svg';
import { ReactComponent as WstethIcon } from 'assets/icons/tokens/wsteth.svg';
import { ReactComponent as UnstethIcon } from 'assets/icons/tokens/unsteth.svg';
import { ReactComponent as RevokeIcon } from 'assets/icons/circle-arrow-down.svg';
import { Tokens } from 'types/tokens';
import { RevokeClaimNft } from './nft/revoke-claim-nft';

import { RevokeItemsWrapper, RevokeItem, RevokeAction } from './style';
import { ActionButton, ActionsWrapper } from '../support-form/style';

type RevokableTokens = Exclude<Tokens, Tokens.UNSTETH>;
type NftMenuStyles = {
  width: string;
  marginTop: string;
};

export const RevokeForm = () => {
  const [isRevokeTokenMenuOpen, setIsRevokeTokenMenuOpen] = useState(false);
  const [isRevokeNftMenuOpen, setIsRevokeNftMenuOpen] = useState(false);
  const [nftMenuStyles, setNftMenuStyles] = useState<NftMenuStyles | null>(
    null,
  );

  const revokeStEtfButtonRef = useRef(null);
  const revokeNftButtonRef = useRef(null);
  const revokeNftItemRef = useRef(null);

  useEffect(() => {
    // TODO: add throttle
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target;
        setNftMenuStyles({
          width: `${element.getBoundingClientRect().width}px`,
          marginTop: `${entry.contentRect.height}px`,
          marginLeft: `${entry.contentRect.left + 1}px`, // hardcode, resolve later
        });
      }
    });

    if (revokeNftItemRef.current) {
      resizeObserver.observe(revokeNftItemRef.current);
    }

    return () => {
      if (revokeNftItemRef.current) {
        resizeObserver.unobserve(revokeNftItemRef.current);
      }
    };
  }, []);

  const handleRevokeStETH = useCallback((token: RevokableTokens) => {
    // Token to revoke stETH in - steth | wsteth,
    console.log(token);
  });

  return (
    <>
      <PopupMenu
        style={{ ...nftMenuStyles, borderRadius: '24px' }}
        anchorRef={revokeNftButtonRef}
        onClose={() => setIsRevokeNftMenuOpen(false)}
        themeOverride="light"
        variant="default"
        open={isRevokeNftMenuOpen}
        placement="bottomRight"
      >
        <RevokeClaimNft />
      </PopupMenu>
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
            3 NFT
          </Text>
          <RevokeAction
            ref={revokeNftButtonRef}
            onClick={() => setIsRevokeNftMenuOpen(true)}
          >
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
        <ActionButton>Revoke all available</ActionButton>
      </ActionsWrapper>
    </>
  );
};

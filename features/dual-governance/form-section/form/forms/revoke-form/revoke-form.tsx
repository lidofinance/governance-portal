import { useCallback, useRef, useState } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { RevokeIcon } from 'shared/components/icons';

import {
  useRevokeNftModal,
  useClaimCustomNftModal,
  useVerifyDepositModal,
} from 'features/dual-governance/modals/modal-manager';

import {
  RevokeTokenItemsWrapper,
  StyledRevokePopup,
  ContractLink,
} from './style';
import { ActionsWrapper } from '../support-form/style';
import { ActionButton } from 'shared/components/action-button';
import { FlexWrapper } from 'shared/styled-components';
import { RevokeTokenItem } from 'features/dual-governance/revoke-token-item';
import { Token } from 'shared/blockchain/types';

type RevocableToken = Exclude<Token, typeof Token.unstETH>;

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
  const {
    openModal: openClaimCustomNftModal,
    closeModal: closeClaimCustomNftModal,
  } = useClaimCustomNftModal();

  // TODO: Remove - for testing purposes only

  const {
    openModal: openVerifyDepositModal,
    closeModal: closeVerifyDepositModal,
  } = useVerifyDepositModal();

  /**
   *  Handlers
   */
  const handleRevokeStETH = useCallback((token: RevocableToken) => {
    // Token to revoke stETH in - steth | wsteth,
    // eslint-disable-next-line no-console
    console.log(token);
  }, []);

  const handleNftRevoke = useCallback(() => {
    openRevokeNftModal({ items: mockNftData });
  }, [openRevokeNftModal]);

  const handleClaimCustomNft = useCallback(() => {
    openClaimCustomNftModal({
      closeModal: closeClaimCustomNftModal,
    });
  }, [openClaimCustomNftModal, closeClaimCustomNftModal]);

  return (
    <>
      <StyledRevokePopup
        anchorRef={revokeStEtfButtonRef}
        onClose={() => setIsRevokeTokenMenuOpen(false)}
        variant="default"
        open={isRevokeTokenMenuOpen}
        placement="bottomRight"
      >
        <RevokeTokenItem
          plain
          interactive
          onClick={() => handleRevokeStETH(Token.stETH)}
          token={Token.stETH}
          amount={0n}
        >
          <Text size="lg" strong>
            Revoke in stETH
          </Text>
          <Text size="lg" color="secondary">
            480,000.0317 stETH
          </Text>
        </RevokeTokenItem>
        <RevokeTokenItem
          plain
          interactive
          token={Token.wstETH}
          onClick={() => handleRevokeStETH(Token.wstETH)}
          amount={0n}
        >
          <Text size="lg" strong>
            Revoke in wstETH
          </Text>
          <Text size="lg" color="secondary">
            424,052.7103 wstETH
          </Text>
        </RevokeTokenItem>
      </StyledRevokePopup>
      <FlexWrapper $justifyContent="space-between">
        <Text>
          Your Tokens in VetoSignaling <ContractLink>contract</ContractLink>
        </Text>
        <ContractLink onClick={handleClaimCustomNft}>
          Claim custom NFT
        </ContractLink>
      </FlexWrapper>
      <RevokeTokenItemsWrapper>
        <RevokeTokenItem
          ref={revokeStEtfButtonRef}
          onClick={() => setIsRevokeTokenMenuOpen(true)}
          token={Token.stETH}
          amount={0n}
        />
        <RevokeTokenItem
          token={Token.unstETH}
          ref={revokeNftItemRef}
          amount={0n}
        >
          <Text size="lg" strong>
            {`${2.3153} ${Token.unstETH}`}
          </Text>
          <Text color="secondary" size="lg" strong>
            {mockNftData.length} NFT
          </Text>
          {/* TODO: ??? */}
          <button onClick={handleNftRevoke}>
            <Text>Revoke</Text>
            <RevokeIcon />
          </button>
        </RevokeTokenItem>
      </RevokeTokenItemsWrapper>
      <Text
        style={{ marginTop: '26px', marginBottom: '24px', marginLeft: '2px' }}
      >
        Your Tokens in RageQuit <ContractLink>contract</ContractLink>
      </Text>
      <RevokeTokenItemsWrapper>
        <RevokeTokenItem token={Token.stETH} amount={0n} isRevocable={false} />
      </RevokeTokenItemsWrapper>
      <ActionsWrapper>
        <ActionButton
          size="lg"
          onClick={() =>
            openVerifyDepositModal({ closeModal: closeVerifyDepositModal })
          }
        >
          Revoke all available
        </ActionButton>
      </ActionsWrapper>
    </>
  );
};

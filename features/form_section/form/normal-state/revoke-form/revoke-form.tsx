import { Link, Text } from '@lidofinance/lido-ui';
import { ReactComponent as StethIcon } from 'assets/icons/tokens/steth.svg';
import { ReactComponent as WstethIcon } from 'assets/icons/tokens/wsteth.svg';
import { ReactComponent as UnstethIcon } from 'assets/icons/tokens/unsteth.svg';

import { RevokeItemsWrapper, RevokeItem } from './style';
import { ActionButton, ActionsWrapper } from '../support-form/style';

export const RevokeForm = () => {
  return (
    <>
      <Text style={{ marginBottom: '24px' }}>
        Your Tokens in VetoSignaling <Link>contract</Link>
      </Text>
      <RevokeItemsWrapper>
        <RevokeItem>
          <StethIcon />
          <Text size="lg" strong>
            480,000.0317 stETH
          </Text>
        </RevokeItem>
        <RevokeItem>
          <WstethIcon />
          <Text size="lg" strong>
            2.3153 unstETH
          </Text>
          <Text color="secondary" size="lg" strong>
            3 NFT
          </Text>
        </RevokeItem>
      </RevokeItemsWrapper>
      <Text style={{ marginTop: '24px', marginBottom: '24px' }}>
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

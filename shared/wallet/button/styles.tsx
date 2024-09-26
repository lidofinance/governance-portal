import styled from 'styled-components';
import { Button, InlineLoader } from '@lidofinance/lido-ui';

export const WalledButtonStyle = styled((props) => <Button {...props} />)`
  flex-shrink: 1;
  min-width: unset;
  overflow: hidden;

  ${({ $isAddPaddingLeft }) => ($isAddPaddingLeft ? `padding-left: 9px` : '')};
`;

export const WalledButtonWrapperStyle = styled.span`
  border: 1px solid var(--custom-border);
  padding: 6px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`;

export const WalledButtonLoaderStyle = styled((props) => (
  <InlineLoader {...props} />
))`
  width: 60px;
`;

import styled from 'styled-components';

import { ButtonIcon, Close, Input } from '@lidofinance/lido-ui';
import { devicesHeaderMedia } from 'styles/global';
import { VOTE_MOBILE_MAX_WIDTH } from 'styles/constants';

export const StyledInput = styled(Input)`
  width: 300px;
  & > span {
    padding: 13px 15px 13px 10px;
    background: var(--lido-color-foreground);
  }
  & > span > span {
    padding-right: 8px;
  }
  input::placeholder {
    font-size: 14px;
    color: var(--primary-color-black-72);
  }

  @media ${devicesHeaderMedia.tablet} {
    width: 195px;
  }

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    width: 100%;
  }
`;

export const ClearButton = styled(ButtonIcon).attrs({
  icon: <Close />,
  color: 'secondary',
  variant: 'translucent',
  size: 'xs',
})`
  padding: 2px;
  color: white;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #d4d7dc;
  width: 16px;
  height: 16px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

import styled from 'styled-components';

import { InputNumber } from 'shared/components/input-number/input-number';
import { devicesHeaderMedia } from 'styles/global';

export const StyledInput = styled(InputNumber)`
  width: 300px;
  span {
    background: transparent;
    span {
      padding-right: 8px;
    }
  }
  input::placeholder {
    font-size: 14px;
    color: var(--primary-color-black-72);
  }

  @media ${devicesHeaderMedia.tablet} {
    width: 195px;
  }
`;

export const IconWrap = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 24px;
    height: 24px;
    margin-top: 8px;
  }
`;

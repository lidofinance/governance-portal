import styled from 'styled-components';

import { InputNumber } from 'shared/components/input-number/input-number';
import { devicesHeaderMedia } from 'styles/global';

export const StyledInput = styled(InputNumber)`
  width: 300px;
  span {
    padding: 13px 15px 13px 10px;
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

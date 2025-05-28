import styled from 'styled-components';
import { Input } from '@lidofinance/lido-ui';

export const InputStyled = styled(Input)`
  & > span {
    width: 100%;
    border-top: none;
    border-radius: 0 0 30px 30px;
    padding: 30px 14px 30px 20px;

    &:nth-child(2) {
      border-radius: 30px;
    }

    button {
      border-radius: 60px;
      font-size: 17px;
      padding: 12px 20px;
    }

    & > div {
      & > input {
        font-size: 17px;
      }

      & > span {
        font-size: 17px;
        color: var(--primary-color-black-50);
      }
    }
  }
`;

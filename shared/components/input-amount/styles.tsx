import styled, { css } from 'styled-components';
import { Input } from '@lidofinance/lido-ui';

export const InputStyled = styled(Input)`
  & > span {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    padding: 30px 14px 30px 20px;

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

export const InputStyled1 = styled(Input)`
  & > span {
    ${({ theme, disabled }) =>
      theme.name === 'dark'
        ? css`
            background: ${disabled && '#27272E8F'};
          `
        : css`
            background: ${disabled && '#EFF2F68F'};
          `}
  }
`;

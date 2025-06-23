import styled from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';

type Props = {
  $isActive: boolean;
};

export const ButtonWrapper = styled.div<Props>`
  display: flex;
  align-items: center;
  border-radius: 70px;
  box-sizing: content-box;

  button {
    border: none;
    height: 46px;
    padding: 0 20px;
    margin: -1px;

    &:hover {
      ${({ $isActive }) =>
        !$isActive && `background-color: transparent!important`}
    }

    @media ${devicesHeaderMedia.mobile} {
      padding: 0 14px;
    }
  }
`;

export const ToggleWrapper = styled.div`
  display: flex;
  gap: 16px;
  border: 1px solid var(--border-color-fog);
  border-radius: 70px;
  background-color: #1312170a;

  @media ${devicesHeaderMedia.mobile} {
    gap: 6px;
  }
`;

import styled from 'styled-components';

export const AvatarWrap = styled.div<{ size?: number }>`
  position: relative;
  border-radius: 50%;
  width: ${({ size }) => `${size ?? 28}px`};
  height: ${({ size }) => `${size ?? 28}px`};
  overflow: hidden;
  flex-shrink: 0;

  & > img,
  & > svg {
    width: 100%;
    height: 100%;
  }

  & > img[src=''] {
    display: none;
  }
`;

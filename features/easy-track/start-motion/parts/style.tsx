import styled from 'styled-components';
import { Text } from 'shared/components/text';
import { TrashIcon } from 'shared/components/icons';
import { Block } from '@lidofinance/lido-ui';

export const Fieldset = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;

  & > label > span:last-child:not(:only-child) {
    z-index: 1;
  }

  & > * {
    width: 100%;
  }
`;

export const FieldsWrapper = styled(Block)`
  margin-bottom: 20px;

  ${Fieldset}:last-of-type {
    margin-bottom: 0;
  }
`;

export const FieldsHeader = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;

export const FieldsHeaderDesc = styled.span`
  font-size: 14px;
  font-weight: 700;
  line-height: 19px;
`;

const RemoveItemButtonWrap = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  opacity: 0.6;
  margin-left: auto;
  margin-right: 0;
  cursor: pointer;
  transition: opacity ease ${({ theme }) => theme.duration.med};
  color: ${({ theme }) => theme.colors.error};
  font-weight: 700;

  & svg {
    display: block;
    margin-left: 10px;
    fill: currentColor;
  }

  &:hover {
    opacity: 1;
    transition-duration: ${({ theme }) => theme.duration.fast};
  }
`;

export const RemoveItemButton = ({
  onClick,
  children,
}: {
  onClick: React.MouseEventHandler;
  children: React.ReactNode;
}) => {
  return (
    <RemoveItemButtonWrap onClick={onClick}>
      <div>{children}</div>
      <TrashIcon />
    </RemoveItemButtonWrap>
  );
};

export const MessageBox = styled.div`
  margin-bottom: 20px;
  padding: 20px 15px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md + 'px'};
`;

export const ErrorBox = styled.div`
  margin-bottom: 20px;
  padding: 20px 15px;
  font-size: 14px;
  background-color: rgba(255, 0, 0, 0.25);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md + 'px'};
`;

export const HashRequests = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HashRequestBlock = styled(Block)<{ $withError?: boolean }>`
  padding: 16px;

  & > div:not(:last-child) {
    margin-bottom: 8px;
  }

  & span {
    word-break: break-all;
  }

  ${(props) =>
    props.$withError &&
    `
    background-color: rgba(var(--lido-rgb-error), 0.2);
  `}
`;

export const HashRequestError = styled(Text).attrs({
  size: 14,
  color: 'error',
})`
  margin-bottom: 10px;
`;

export const MotionInfoBox = styled.div<{ $variant?: 'error' | 'warning' }>`
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  background-color: ${({ $variant }) =>
    $variant === 'error' ? 'rgba(225, 77, 77, 0.5)' : '#fffae0'};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  line-height: 20px;
  margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
`;

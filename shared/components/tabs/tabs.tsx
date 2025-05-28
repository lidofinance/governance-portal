import { cloneElement } from 'react';
import { StyledTab, TabsWrapper } from './style';

// TODO: fix type
export const Tabs = ({ children }: { children: any[] }) => {
  return (
    <TabsWrapper>
      {children.map((child, index) => cloneElement(child, { key: index }))}
    </TabsWrapper>
  );
};

type Props = {
  isActive: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export const Tab = ({ children, isActive, disabled, onClick }: Props) => {
  return (
    <StyledTab
      $isActive={isActive}
      $disabled={disabled}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </StyledTab>
  );
};

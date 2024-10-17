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

// TODO: fix types
export const Tab = ({ children, isActive, onClick }: any) => {
  return (
    <StyledTab $isActive={isActive} onClick={onClick}>
      {children}
    </StyledTab>
  );
};

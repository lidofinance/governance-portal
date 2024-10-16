import { cloneElement } from 'react';
import { StyledTab, TabsWrapper } from './style';

export const Tabs = ({ children }) => {
  return (
    <TabsWrapper>
      {children.map((child, index) => cloneElement(child, { key: index }))}
    </TabsWrapper>
  );
};

export const Tab = ({ children, isActive, onClick }) => {
  return (
    <StyledTab $isActive={isActive} onClick={onClick}>
      {children}
    </StyledTab>
  );
};

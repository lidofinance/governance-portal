import { FC, PropsWithChildren } from 'react';
import { DelegationFormControllerStyled } from './style';

export const DelegationFormController: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <DelegationFormControllerStyled data-testid="delegationForm">
      {children}
    </DelegationFormControllerStyled>
  );
};

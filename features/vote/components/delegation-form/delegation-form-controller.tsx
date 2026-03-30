import { FC, PropsWithChildren } from 'react';
import { DelegationFormControllerStyled } from './style';
import { useDelegationFormData } from '@vote/providers/delegation-form-context';

export const DelegationFormController: FC<PropsWithChildren> = ({
  children,
}) => {
  const { mode } = useDelegationFormData();

  return (
    <DelegationFormControllerStyled $customMode={mode !== 'simple'}>
      {children}
    </DelegationFormControllerStyled>
  );
};

import { useDelegationFormData } from '@vote/providers/delegation-form-context';
import { DelegationFormFootNoteStyled } from './style';

export const DelegationFormFootNote = () => {
  const { mode } = useDelegationFormData();

  if (mode === 'simple') {
    return null;
  }

  return (
    <DelegationFormFootNoteStyled>
      You only delegate your voting power, not the ownership of your tokens
    </DelegationFormFootNoteStyled>
  );
};

import { FC, useMemo, createContext, useContext, useCallback } from 'react';
import invariant from 'tiny-invariant';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller-context';
import { useFormControllerRetry } from 'shared/hook-form/use-form-controller-retry';

const StartMotionFormContext = createContext(null);

export const useStartMotionFormData = () => {
  const value = useContext(StartMotionFormContext);
  invariant(
    value,
    'useStartMotionFormData was used outside the StartMotionFormContext provider',
  );
  return value;
};

export type DelegationFormProviderProps = {
  children?: React.ReactNode;
};

export const StartMotionFormProvider: FC<DelegationFormProviderProps> = ({
  children,
}) => {
  const { retryEvent } = useFormControllerRetry();

  const formObject = useForm({
    defaultValues: {},
    mode: 'onChange',
  });

  const value = null;

  const handleSubmit = useCallback(async () => {
    return true;
  }, []);

  const formControllerValue = useMemo(
    (): FormControllerContextValueType => ({
      onSubmit: handleSubmit,
      onReset: () => {},
      retryEvent,
    }),
    [handleSubmit, retryEvent],
  );

  return (
    <FormProvider {...formObject}>
      <StartMotionFormContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </StartMotionFormContext.Provider>
    </FormProvider>
  );
};

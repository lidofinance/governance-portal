import { useAvailableMotions } from '../hooks/use-available-motions';
import { Container, Option } from '@lidofinance/lido-ui';
import { getMotionTypeDisplayName } from '../utils/get-motion-type-display-name';
import { useForm, FormProvider } from 'react-hook-form';
import { formParts, getDefaultFormPartsData, FormData } from './parts';
import { Fieldset } from './parts/style';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';

export const StartMotion = () => {
  const { availableMotions } = useAvailableMotions();

  const formMethods = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      motionType: null,
      ...getDefaultFormPartsData(),
    },
  });

  const motionType = formMethods.watch('motionType');

  const CurrentFormPart =
    motionType && motionType in formParts
      ? formParts[motionType as keyof typeof formParts].Component
      : null;

  return (
    <FormProvider {...formMethods}>
      <Container as="main" size="tight">
        <Fieldset>
          <SelectHookForm fieldName="motionType" label="Motion type">
            {availableMotions?.map((motion) => (
              <Option key={motion.address} value={motion.motionType}>
                {getMotionTypeDisplayName(motion.motionType)}
              </Option>
            ))}
          </SelectHookForm>
        </Fieldset>
        {CurrentFormPart && motionType && (
          <CurrentFormPart
            fieldNames={
              formParts[motionType as keyof typeof formParts].fieldNames
            }
            submitAction={<div></div>}
          />
        )}
      </Container>
    </FormProvider>
  );
};

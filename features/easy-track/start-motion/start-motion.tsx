import { useAvailableMotions } from '../hooks/use-available-motions';
import { FormController } from 'shared/hook-form/form-controller';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { StartMotionFormProvider } from '../providers/start-motion-form-context';
import { Container, Option } from '@lidofinance/lido-ui';
import { getMotionTypeDisplayName } from '../utils/get-motion-type-display-name';

export const StartMotion = () => {
  const { availableMotions } = useAvailableMotions();

  return (
    <StartMotionFormProvider>
      <FormController>
        <Container as="main" size="tight">
          <SelectHookForm fieldName="motionType" label="Motion type">
            {availableMotions?.map((motion) => (
              <Option key={motion.address} value={motion.motionType}>
                {getMotionTypeDisplayName(motion.motionType)}
              </Option>
            ))}
          </SelectHookForm>
        </Container>
      </FormController>
    </StartMotionFormProvider>
  );
};

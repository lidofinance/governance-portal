import { Option } from '@lidofinance/lido-ui';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { ComponentProps } from 'react';

type SelectOption = {
  id: number;
  name: string;
};

const MAX_NAME_LENGTH = 45;

const getOptionLabel = (option: SelectOption) =>
  `${option.name.slice(0, MAX_NAME_LENGTH)}${
    option.name.length > MAX_NAME_LENGTH ? '...' : ''
  } (id: ${option.id})`;

type Props = Omit<
  ComponentProps<typeof SelectHookForm>,
  'children' | 'label' | 'rules'
> & {
  options: SelectOption[];
};

export const NodeOperatorSelectControl = (props: Props) => {
  const { options, ...selectControlProps } = props;

  return (
    <SelectHookForm
      label="Node operator"
      rules={{ required: 'Field is required' }}
      {...selectControlProps}
    >
      {options.map((nodeOperator) => (
        <Option key={nodeOperator.id} value={String(nodeOperator.id)}>
          {getOptionLabel(nodeOperator)}
        </Option>
      ))}
    </SelectHookForm>
  );
};

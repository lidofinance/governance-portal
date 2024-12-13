import { useFormContext } from 'react-hook-form';
import { NftMultiselect } from './nft-multiselect';
import { NftMultiselectProps, NftMultiselectValuesMap } from './types';

type Props = { fieldName: string } & Omit<
  NftMultiselectProps,
  'selectedOptions' | 'onChange'
>;

export const NftMultiselectHookForm = (props: Props) => {
  const { fieldName, ...rest } = props;
  const { watch, setValue } = useFormContext();

  const selectedOptions: NftMultiselectValuesMap = watch(fieldName);

  return (
    <NftMultiselect
      {...rest}
      selectedOptions={selectedOptions}
      onChange={(value) => setValue(fieldName, value)}
    />
  );
};

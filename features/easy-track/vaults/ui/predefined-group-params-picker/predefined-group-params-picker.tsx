import { Button } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import { ButtonsWrap, Wrap } from './style';
import { PredefinedGroupSetup } from '@easy-track/vaults/types';
import { useLidoSDK } from 'providers/lido-sdk';
import { PREDEFINED_GROUP_SETUPS_MAP } from '@easy-track/vaults/constants';

type Props = {
  title?: string;
  upgradeMode?: boolean;
  onSelect: (option: PredefinedGroupSetup) => void;
};

export const PredefinedGroupParamsPicker = ({
  title,
  upgradeMode,
  onSelect,
}: Props) => {
  const { chainId } = useLidoSDK();

  const options = PREDEFINED_GROUP_SETUPS_MAP[chainId];

  if (!options?.length) {
    return null;
  }

  return (
    <Wrap>
      <Text size={14}>{title ?? 'Predefined group setups'}</Text>
      <ButtonsWrap>
        {options.map((option, index) => (
          <Button
            variant="outlined"
            key={index}
            size="xs"
            type="button"
            onClick={() => onSelect(option)}
          >
            {upgradeMode ? 'Upgrade to ' : ''}
            {option.label}
          </Button>
        ))}
      </ButtonsWrap>
    </Wrap>
  );
};

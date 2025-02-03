import { UnstethIcon } from 'shared/components/icons';
import { Amount, CheckboxStyled, NftItemWrapper } from './style';
import { formatEth } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';
import { NftMultiselectItemProps } from './types';
import { Badge } from '../proposals/shared-components/vote-status-badge/style';

export const NftMultiselectItem = (props: NftMultiselectItemProps) => {
  const { id, stEthAmount, checked, onClick, selectable, customNftData } =
    props;

  return (
    <NftItemWrapper
      $interactive={customNftData === null}
      $checked={checked}
      onClick={onClick}
    >
      {selectable && <CheckboxStyled checked={!!checked} readOnly />}
      <UnstethIcon />
      <Text weight={600}>#{id}</Text>
      <Amount>{formatEth(stEthAmount)} stETH</Amount>
      {customNftData && (
        <Badge $variant={customNftData.isFinalized ? 'success' : 'default'}>
          {customNftData.isFinalized ? 'Finalized' : 'Not finalized'}
        </Badge>
      )}
    </NftItemWrapper>
  );
};

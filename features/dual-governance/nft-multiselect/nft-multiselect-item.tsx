import { UnstethIcon } from 'shared/components/icons';
import { Amount, CheckboxStyled, NftItemWrapper } from './style';
import { formatEth } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';
import { NftMultiselectItemProps } from './types';
import { Badge } from '../proposals/shared-components/vote-status-badge/style';
import { useRef } from 'react';

export const NftMultiselectItem = (props: NftMultiselectItemProps) => {
  const { id, stEthAmount, checked, onClick, selectable, customNftData } =
    props;

  const checkboxRef = useRef(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onClick();
  };
  return (
    <NftItemWrapper
      $interactive={customNftData === null || selectable}
      $checked={checked}
      onClick={selectable ? undefined : onClick}
    >
      {selectable && (
        <CheckboxStyled
          ref={checkboxRef}
          onChange={handleCheckboxChange}
          onClick={(event) => event.stopPropagation()}
          checked={!!checked}
        />
      )}
      <UnstethIcon />
      <Text color="default" weight={600}>
        #{id}
      </Text>
      <Amount>{formatEth(stEthAmount)} stETH</Amount>
      {customNftData && (
        <Badge $variant={customNftData.isFinalized ? 'success' : 'default'}>
          {customNftData.isFinalized ? 'Finalized' : 'Not finalized'}
        </Badge>
      )}
    </NftItemWrapper>
  );
};

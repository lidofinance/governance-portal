import { UnstethIcon } from 'shared/components/icons';
import { Amount, CheckboxStyled, NftItemWrapper } from './style';
import { formatEth } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';
import { NftMultiselectItemProps } from './types';

export const NftMultiselectItem = (props: NftMultiselectItemProps) => {
  const { id, stEthAmount, checked, onClick } = props;

  return (
    <NftItemWrapper $checked={checked} onClick={onClick}>
      <CheckboxStyled checked={!!checked} readOnly />
      <UnstethIcon />
      <Text weight={600}>#{id}</Text>
      <Amount>{formatEth(stEthAmount)} stETH</Amount>
      {/* TODO: remove if not needed */}
      {/* <ProposalStatus $variant={nft.finalized ? 'success' : 'default'}>
        {nft.finalized ? 'Finalized' : 'Not finalized'}
      </ProposalStatus> */}
    </NftItemWrapper>
  );
};

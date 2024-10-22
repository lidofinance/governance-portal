import { Text } from '@lidofinance/lido-ui';
import { UnstethIcon } from 'shared/components/icons';
import {
  Amount,
  StatusBadge,
  StyledCheckbox,
  NftItem as NftItemStyled,
} from './style';
import { NftData } from './types';

type Props = {
  nft: NftData;
  selectable?: boolean;
  checked?: boolean;
  onChange?: (id: NftData['id'], isChecked: boolean) => void;
};

export const NftItem = ({ nft, checked, selectable, onChange }: Props) => {
  return (
    <NftItemStyled $checked={checked}>
      {selectable && (
        <StyledCheckbox
          checked={checked}
          onChange={(e) => onChange && onChange(nft.id, e.target.checked)}
        />
      )}
      <UnstethIcon />
      <Text strong>#{nft.id}</Text>
      <Amount>{nft.amount} ETH</Amount>
      <StatusBadge $variant={nft.finalized ? 'success' : 'default'}>
        {nft.finalized ? 'Finalized' : 'Not finalized'}
      </StatusBadge>
    </NftItemStyled>
  );
};

import { UnstethIcon } from 'shared/components/icons';
import {
  Amount,
  CheckboxStyled,
  NftItemWrapper,
  OwnerLabel,
  OwnerWrapper,
} from './style';
import { formatEth } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';
import { NftMultiselectItemProps } from './types';
import { Badge } from '../proposals/shared-components/vote-status-badge/style';
import { useRef } from 'react';
import { Link } from '@lidofinance/lido-ui';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { useLidoSDK } from 'providers/lido-sdk';

export const NftMultiselectItem = (props: NftMultiselectItemProps) => {
  const { id, stEthAmount, checked, onClick, selectable, customNftData } =
    props;
  const { chainId } = useLidoSDK();
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

      {customNftData && customNftData.owner && (
        <OwnerWrapper>
          <OwnerLabel color="secondary">Owner:</OwnerLabel>
          <Link
            href={getEtherscanAddressLink(chainId, customNftData.owner)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${customNftData.owner.slice(0, 6)}...${customNftData.owner.slice(-4)}`}
          </Link>
        </OwnerWrapper>
      )}
      <Amount>{formatEth(stEthAmount)} stETH</Amount>

      {customNftData && (
        <Badge $variant={customNftData.isFinalized ? 'success' : 'default'}>
          {customNftData.isFinalized ? 'Finalized' : 'Not finalized'}
        </Badge>
      )}
    </NftItemWrapper>
  );
};

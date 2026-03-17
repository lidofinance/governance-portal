import { trimAddress } from '@lidofinance/lido-ui';
import { Wrap } from './style';
import { AddressPop } from '../address-pop';
import { Address } from 'viem';

type Props = {
  address: Address;
  trim?: number;
};

export const AddressPopInline = ({ address, trim = 4 }: Props) => {
  return (
    <AddressPop address={address} isPaddingless isInline>
      <Wrap>{trim ? trimAddress(address, trim) : address}</Wrap>
    </AddressPop>
  );
};

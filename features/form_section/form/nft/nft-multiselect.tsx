import { useCallback, useState } from 'react';
import { InputDecoratorMaxButton as MaxButton } from 'shared/components/input-amount/input-decorator-max-button';
import { StyledSelect } from '../style';
import { RevokeClaimNft } from './revoke-claim-nft';

const mockNftData = [
  {
    id: 10423,
    amount: 103.740782,
    finalized: true,
  },
  {
    id: 10456,
    amount: 6574.1856746,
    finalized: true,
  },
  {
    id: 10435,
    amount: 105432.008721,
    finalized: false,
  },
  {
    id: 10463,
    amount: 543.543120598,
    finalized: false,
  },
  {
    id: 15545,
    amount: 124.72345,
    finalized: true,
  },
];

// empty function for type checking, we handle select change separately
const emptyHandler = () => {};

const RightDecorator = () => {
  return <MaxButton>Select all</MaxButton>;
};

export const NftMultiselect = () => {
  const [currentValue, setCurrentValue] = useState('');

  const handleNftSelect = useCallback((selected: string[]) => {
    setCurrentValue(selected.toString());
  }, []);

  return (
    <>
      <StyledSelect
        rightDecorator={<RightDecorator />}
        value={currentValue}
        onChange={emptyHandler}
      >
        <RevokeClaimNft
          selectable
          items={mockNftData}
          callback={handleNftSelect}
        />
      </StyledSelect>
    </>
  );
};

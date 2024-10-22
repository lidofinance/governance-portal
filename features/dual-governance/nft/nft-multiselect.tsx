import { useCallback, useState } from 'react';
import { StyledSelect } from '../form-section/form/style';
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

export const NftMultiselect = () => {
  const [currentValue, setCurrentValue] = useState('');

  const handleNftSelect = useCallback((selected: string[]) => {
    const currentValue = selected.map((id) => ` #${id}`).toString();
    setCurrentValue(currentValue);
  }, []);

  return (
    <>
      <StyledSelect $value={currentValue} $onChange={() => {}}>
        <RevokeClaimNft
          initialChecked={currentValue}
          selectable
          showSelectAll
          items={mockNftData}
          callback={handleNftSelect}
        />
      </StyledSelect>
    </>
  );
};

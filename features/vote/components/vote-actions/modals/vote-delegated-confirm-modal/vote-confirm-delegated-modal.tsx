import { Button } from '@lidofinance/lido-ui';
import { VoteMode } from 'features/vote/types';
import { DelegatorsSelector } from '../../components/delegators-selector';
import { Text } from 'shared/components/text';
import { ComponentProps, useState } from 'react';
import { Address } from 'viem';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { formatBalance } from 'utils/format-balance';
import { Box } from 'shared/components/box';
import { VOTE_MODE_MAP } from 'features/vote/constants';

type Props = {
  mode: VoteMode;
  eligibleDelegators: ComponentProps<typeof DelegatorsSelector>['delegators'];
  onSubmit: (selectedVoters: Address[]) => void;
};

export const VoteConfirmDelegatedModal = ({
  eligibleDelegators,
  mode,
  onSubmit,
}: Props) => {
  const [selectedAddresses, setSelectedAddresses] = useState<Address[]>([]);
  const [selectedBalance, setSelectedBalance] = useState<bigint>(0n);

  const { data: tokenData } = useGovernanceToken();

  const handleSelectionChange = (
    selectedAddresses: Address[],
    selectedBalance: bigint,
  ) => {
    setSelectedAddresses(selectedAddresses);
    setSelectedBalance(selectedBalance);
  };

  const handleSubmit = () => {
    onSubmit(selectedAddresses);
  };

  return (
    <>
      <Box textAlign="center">
        <Text>Vote with Delegated VP</Text>
      </Box>
      <Box margin="10px 0">
        <Button color="secondary" onClick={handleSubmit} fullwidth>
          {`"${VOTE_MODE_MAP[mode]}" (${formatBalance(selectedBalance)} ${tokenData?.symbol})`}
        </Button>
      </Box>
      <DelegatorsSelector
        delegators={eligibleDelegators}
        onSelectionChange={handleSelectionChange}
      />
    </>
  );
};

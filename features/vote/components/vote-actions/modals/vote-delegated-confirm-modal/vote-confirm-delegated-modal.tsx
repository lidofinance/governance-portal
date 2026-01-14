import { Button } from '@lidofinance/lido-ui';
import { VoteMode, voteModeDict } from 'features/vote/types';
import { DelegatorsSelector } from '../../components/delegators-selector';
import { Text } from 'shared/components/text';
import { useState } from 'react';
import { Address } from 'viem';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { formatBalance } from 'utils/format-balance';
import { Box } from 'shared/components/box';

type Props = {
  mode: VoteMode;
  voteId: bigint;
  onSubmit: (selectedVoters: Address[]) => void;
};

export const VoteConfirmDelegatedModal = ({
  mode,
  voteId,
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
        <Text>Vote Yes with Delegated VP</Text>
      </Box>
      <DelegatorsSelector
        voteId={voteId}
        onSelectionChange={handleSelectionChange}
      />
      <Button color="secondary" onClick={handleSubmit} fullwidth>
        {`"${voteModeDict[mode]}" (${formatBalance(selectedBalance)} ${tokenData?.symbol})`}
      </Button>
    </>
  );
};

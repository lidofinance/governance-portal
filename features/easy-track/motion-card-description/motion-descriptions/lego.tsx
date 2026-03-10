import { useMemo } from 'react';
import { getAddress, formatEther } from 'viem';
import { evmTopUpLegoProgramAbi } from 'abi/generated/EvmTopUpLegoProgram';
import { MotionDescriptionProps } from '../types';
import { useLegoTokenOptions } from '../../hooks/use-lego-token-options';
import { AddressPopInline } from 'shared/components/address-pop-inline';

export const LEGOTopUp = ({
  callData,
}: MotionDescriptionProps<typeof evmTopUpLegoProgramAbi>) => {
  const options = useLegoTokenOptions();

  const formattedTokens = useMemo(() => {
    return callData[0].map((address) => {
      const normalizedAddress = getAddress(address);
      return options.find((o) => getAddress(o.value) === normalizedAddress)
        ?.label;
    });
  }, [callData, options]);

  return (
    <div>
      Top up LEGO program with:
      {callData[0].map((tokenAddress, i) => (
        <div key={i}>
          {Number(formatEther(callData[1][i])).toLocaleString('en-EN')}{' '}
          {formattedTokens[i] || (
            <>
              token with address <AddressPopInline address={tokenAddress} />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

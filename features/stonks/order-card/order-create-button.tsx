/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, ToastError } from '@lidofinance/lido-ui';
import { OrderData } from '@stonks/types';
import { useLidoSDK } from 'providers/lido-sdk';
import { useMutation } from '@tanstack/react-query';
import { API_ROUTES } from 'constants/api';
import { keccak256, stringToHex } from 'viem';

type Props = {
  order: OrderData;
  isLoading?: boolean;
  onSuccess?: () => void;
};

export const StonksOrderCardCreateButton = ({
  order,
  isLoading,
  onSuccess,
}: Props) => {
  const { chainId } = useLidoSDK();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        address: order.address,
        sellToken: order.stonksMetadata.tokenFrom.addresses[chainId]!,
        buyToken: order.stonksMetadata.tokenTo.addresses[chainId]!,
        receiver: order.receiverAddress,
        sellAmount: order.sellAmount.toString(),
        buyAmount: order.buyAmount.toString(),
        validTo: order.validTo,
        appData: keccak256(stringToHex('{}')),
        feeAmount: '0',
        partiallyFillable: false,
        from: order.address,
        kind: 'sell',
        signingScheme: 'eip1271',
        sellTokenBalance: 'erc20',
        buyTokenBalance: 'erc20',
        signature: '0x',
        chainId,
      };

      const response = await fetch(`/${API_ROUTES.COW_PLACE_ORDER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        return data as string;
      }
    },
    onSuccess: () => onSuccess?.(),
    onError: (error: any) => {
      console.error(error);
      ToastError(error?.message ?? 'Something went wrong', {});
    },
  });

  return (
    <Button
      size="sm"
      onClick={() => mutate()}
      loading={isPending || isLoading}
      fullwidth
    >
      Create CoW Order
    </Button>
  );
};

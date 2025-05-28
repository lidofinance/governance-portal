import { FC } from 'react';
import { ButtonProps } from '@lidofinance/lido-ui';
import { Button } from 'shared/components/button';

export const UnsupportedChainButton: FC<ButtonProps> = (props) => {
  return (
    <Button disabled={true} fullwidth {...props}>
      Unsupported chain
    </Button>
  );
};

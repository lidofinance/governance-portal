import { decodeFunctionResult, formatUnits } from 'viem';
import { lidoLendExitBookActionsAbi } from 'abi/generated';
import { LidoLendExitBookAction } from '@easy-track/lido-lend/actions';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { MotionDescriptionProps } from '../types';

const abi = lidoLendExitBookActionsAbi;

export const LidoLendExitBookActions = ({
  callData,
}: MotionDescriptionProps<typeof abi>) => {
  const [action, payload] = callData;

  switch (action) {
    case LidoLendExitBookAction.SetMorphoExitBookAllowed: {
      const [marketParamsList, allowed] = decodeFunctionResult({
        abi,
        functionName: 'decodeSetMorphoExitBookAllowedPayload',
        data: payload,
      });

      return (
        <>
          Set <b>{marketParamsList.length}</b> market
          {marketParamsList.length === 1 ? '' : 's'} to{' '}
          <b>{allowed ? 'allowed' : 'disallowed'}</b> on the Morpho exit book
          <ul>
            {marketParamsList.map((marketParams, index) => (
              <li key={index}>
                Loan token:{' '}
                <AddressPopInline address={marketParams.loanToken} />,
                collateral token:{' '}
                <AddressPopInline address={marketParams.collateralToken} />,
                oracle: <AddressPopInline address={marketParams.oracle} />, IRM:{' '}
                <AddressPopInline address={marketParams.irm} />, LLTV:{' '}
                <b>{formatUnits(marketParams.lltv, 16)}%</b>
              </li>
            ))}
          </ul>
        </>
      );
    }

    case LidoLendExitBookAction.SetErc4626ExitBookAllowed: {
      const [vaults, allowed] = decodeFunctionResult({
        abi,
        functionName: 'decodeSetErc4626ExitBookAllowedPayload',
        data: payload,
      });

      return (
        <>
          Set <b>{vaults.length}</b> vault{vaults.length === 1 ? '' : 's'} to{' '}
          <b>{allowed ? 'allowed' : 'disallowed'}</b> on the ERC-4626 exit book
          <ul>
            {vaults.map((vault) => (
              <li key={vault}>
                <AddressPopInline address={vault} />
              </li>
            ))}
          </ul>
        </>
      );
    }

    default:
      return <>Unknown Lido Lend exit book action ({action})</>;
  }
};

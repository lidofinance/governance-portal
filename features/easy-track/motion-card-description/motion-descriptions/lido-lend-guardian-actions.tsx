import { decodeFunctionResult } from 'viem';
import { lidoLendGuardianActionsAbi } from 'abi/generated';
import { LidoLendGuardianAction } from '@easy-track/lido-lend/actions';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { MotionDescriptionProps } from '../types';
import { Amount, MarketId } from './lido-lend-parts';

const abi = lidoLendGuardianActionsAbi;

export const LidoLendGuardianActions = ({
  callData,
}: MotionDescriptionProps<typeof abi>) => {
  const [action, payload] = callData;

  switch (action) {
    case LidoLendGuardianAction.AddGuardian: {
      const [marketId, guardian, newQuorum] = decodeFunctionResult({
        abi,
        functionName: 'decodeAddGuardianPayload',
        data: payload,
      });

      return (
        <>
          Add guardian <AddressPopInline address={guardian} /> to market{' '}
          <MarketId marketId={marketId} /> and set the quorum to{' '}
          <Amount value={newQuorum} />
        </>
      );
    }

    case LidoLendGuardianAction.RemoveGuardian: {
      const [marketId, guardian, newQuorum] = decodeFunctionResult({
        abi,
        functionName: 'decodeRemoveGuardianPayload',
        data: payload,
      });

      return (
        <>
          Remove guardian <AddressPopInline address={guardian} /> from market{' '}
          <MarketId marketId={marketId} /> and set the quorum to{' '}
          <Amount value={newQuorum} />
        </>
      );
    }

    case LidoLendGuardianAction.ReplaceGuardian: {
      const [marketId, oldGuardian, newGuardian] = decodeFunctionResult({
        abi,
        functionName: 'decodeReplaceGuardianPayload',
        data: payload,
      });

      return (
        <>
          Replace guardian <AddressPopInline address={oldGuardian} /> with{' '}
          <AddressPopInline address={newGuardian} /> on market{' '}
          <MarketId marketId={marketId} />
        </>
      );
    }

    case LidoLendGuardianAction.SetGuardiansQuorum: {
      const [marketId, newQuorum] = decodeFunctionResult({
        abi,
        functionName: 'decodeSetGuardiansQuorumPayload',
        data: payload,
      });

      return (
        <>
          Set guardians quorum of market <MarketId marketId={marketId} /> to{' '}
          <Amount value={newQuorum} />
        </>
      );
    }

    case LidoLendGuardianAction.SetSuspectWindow: {
      const [marketId, newSuspectWindow] = decodeFunctionResult({
        abi,
        functionName: 'decodeSetSuspectWindowPayload',
        data: payload,
      });

      return (
        <>
          Set suspect window of market <MarketId marketId={marketId} /> to{' '}
          <Amount value={newSuspectWindow} /> seconds
        </>
      );
    }

    case LidoLendGuardianAction.UnbanAccounts: {
      const requests = decodeFunctionResult({
        abi,
        functionName: 'decodeUnbanAccountsPayload',
        data: payload,
      });

      return (
        <>
          Unban <b>{requests.length}</b> account
          {requests.length === 1 ? '' : 's'} from guardian signals
          <ul>
            {requests.map((request) => (
              <li key={request.account}>
                <AddressPopInline address={request.account} /> on market
                {request.marketIds.length === 1 ? '' : 's'}:{' '}
                {request.marketIds.map((marketId, index) => (
                  <span key={marketId}>
                    {index > 0 && ', '}
                    <MarketId marketId={marketId} />
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </>
      );
    }

    default:
      return <>Unknown Lido Lend guardian action ({action})</>;
  }
};

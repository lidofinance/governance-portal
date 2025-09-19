import { PublicDelegate } from '../shared/votes/types';
import { PUBLIC_DELEGATES } from '../features/vote/public-delegates';

export const getPublicDelegate = (address: string): PublicDelegate | null =>
  //@ts-expect-error typing issues
  PUBLIC_DELEGATES.find(
    (delegate) => delegate.address.toLowerCase() === address.toLowerCase(),
  ) ?? null;

import { useEffect } from 'react';
import { lockScroll, unlockScroll } from 'utils/scroll-utils';

export const useScrollLock = (isLocked = true) => {
  useEffect(() => {
    if (!isLocked) return;
    lockScroll();
    return unlockScroll;
  }, [isLocked]);
};

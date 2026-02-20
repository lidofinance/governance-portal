const HTML_LOCK_CLASS = 'html-scroll-lock';
const BODY_LOCK_CLASS = 'body-scroll-lock';

const isClient = typeof window !== 'undefined';

let lockersStack = 0;
let scrollPosition = 0;
let isScrollLocked = false;
const body = isClient ? document.body : null;
const html = isClient ? document.documentElement : null;

const getScrollPosition = () => {
  if (!html || !body) return 0;
  if (!isScrollLocked) {
    scrollPosition =
      window.pageYOffset || html.scrollTop || body.scrollTop || 0;
  }
  return scrollPosition;
};

// Scroll Locker
export const lockScroll = () => {
  if (!html || !body) return;
  if (++lockersStack > 1) return;
  const scroll = getScrollPosition();
  isScrollLocked = true;
  html.classList.add(HTML_LOCK_CLASS);
  body.classList.add(BODY_LOCK_CLASS);
  body.style.top = `-${scroll}px`;
};

// Scroll Unlocker
export const unlockScroll = () => {
  if (!html || !body) return;
  lockersStack = Math.max(0, lockersStack - 1);
  if (lockersStack > 0 || !isScrollLocked) return;
  html.classList.remove(HTML_LOCK_CLASS);
  body.classList.remove(BODY_LOCK_CLASS);
  body.style.top = '';
  const scroll = getScrollPosition();
  window.scrollTo(0, scroll);
  isScrollLocked = false;
};

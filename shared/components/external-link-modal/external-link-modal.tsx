import { Modal } from '@lidofinance/lido-ui';
import { Text } from '../text';
import type { ModalComponentType } from 'providers/modal-provider';
import { Button } from '../button';
import { openWindow } from 'utils/open-window';
import { useCallback } from 'react';
import { ExternalLinkModalContent, ExternalLinkModalLink } from './style';
import { ExternalLinkIcon } from '../icons';

type ExternalLinkModalProps = {
  href: string;
  onClose: () => void;
};

const trustedSites = ['https://research.lido.fi/', 'https://snapshot.org/'];

export const ExternalLinkModal: ModalComponentType<ExternalLinkModalProps> = ({
  href,
  onClose,
  ...modalProps
}) => {
  const link = href || '';
  const handleClick = useCallback(() => {
    if (link) openWindow(link);
    onClose?.();
  }, [onClose, link]);

  const isTrusted = trustedSites.some((trustedSite) =>
    link.startsWith(trustedSite),
  );
  const notice = isTrusted
    ? 'Site is reputable, but content may vary.'
    : 'Proceed carefully and read the address before opening.';

  return (
    <Modal {...modalProps} onClose={onClose} title="External Link">
      <ExternalLinkModalContent>
        <Text as="p" size={14} weight={400}>
          {`You're about to visit: `}
          <ExternalLinkModalLink>{link}.</ExternalLinkModalLink>
        </Text>
        <Text as="p" size={12}>
          {notice}
        </Text>
        <Button onClick={handleClick}>
          <ExternalLinkIcon />
          Open
        </Button>
      </ExternalLinkModalContent>
    </Modal>
  );
};

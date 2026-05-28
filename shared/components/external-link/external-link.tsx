import { ReactNode } from 'react';
import { getUseModal } from 'providers/modal-provider';
import { ExternalLinkModal } from '../external-link-modal/external-link-modal';

import { ExternalLinkAnchor, ExternalLinkWrap } from './style';

export const useExternalLinkModal = getUseModal(ExternalLinkModal);

type Props = {
  href?: string;
  children: ReactNode;
  asLink?: boolean;
};

export const ExternalLink = ({ href = '', children, asLink }: Props) => {
  const { openModal, closeModal } = useExternalLinkModal();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    openModal({
      href,
      onClose: () => closeModal(),
    });
  };

  if (asLink) {
    return (
      <ExternalLinkAnchor href={href} onClick={handleClick}>
        {children}
      </ExternalLinkAnchor>
    );
  }

  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  return (
    <ExternalLinkWrap
      onClick={handleClick}
      role="link"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </ExternalLinkWrap>
  );
};

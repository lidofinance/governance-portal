import { ReactNode } from 'react';
import { getUseModal } from 'providers/modal-provider';
import { ExternalLinkModal } from '../external-link-modal/external-link-modal';

import { ExternalLinkWrap } from './style';

export const useExternalLinkModal = getUseModal(ExternalLinkModal);

type Props = {
  href?: string;
  children: ReactNode;
};

export const ExternalLink = ({ href = '', children }: Props) => {
  const { openModal, closeModal } = useExternalLinkModal();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal({
      href,
      onClose: () => closeModal(),
    });
  };

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

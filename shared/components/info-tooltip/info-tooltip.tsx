import { TooltipHoverable } from '../tooltip-hoverable/tooltip-hoverable';
import { ReactNode } from 'react';
import { IconWrapper } from './style';

export const InfoTooltip = ({
  title,
  className,
}: {
  title: ReactNode;
  className?: string;
}) => {
  return (
    <TooltipHoverable title={title} className={className}>
      <span>
        <IconWrapper />
      </span>
    </TooltipHoverable>
  );
};

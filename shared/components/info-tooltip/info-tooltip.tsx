import { TooltipHoverable } from '../tooltip-hoverable/tooltip-hoverable';
import { ReactNode } from 'react';
import { IconWrapper } from './style';

export const InfoTooltip = ({ title }: { title: ReactNode }) => {
  return (
    <TooltipHoverable title={title}>
      <span>
        <IconWrapper />
      </span>
    </TooltipHoverable>
  );
};

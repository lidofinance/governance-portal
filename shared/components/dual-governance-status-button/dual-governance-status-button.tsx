import { useRef, useState } from 'react';
import { DualGovernanceStatusButtonStyled, PopoverStyled } from './style';
import { Box, Loader } from '@lidofinance/lido-ui';
import { DualGovernancePlainIcon } from '../icons';
import { DualGovernanceWidget } from 'features/dual-governance/dual-governance-widget';
import { useDualGovernanceWidgetState } from 'features/dual-governance/dual-governance-widget/use-dual-governance-widget-state';
import { VisibleGovernanceState } from 'features/dual-governance/types';

export const DualGovernanceStatusButton = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const { data, isLoading } = useDualGovernanceWidgetState();

  const handleButtonClick = () => {
    if (!data) return;
    setIsPopupOpen(true);
  };

  return (
    <Box position="relative">
      <DualGovernanceStatusButtonStyled
        $status={data?.visibleStatus ?? VisibleGovernanceState.Unset}
        disabled={isLoading}
        onClick={handleButtonClick}
        ref={anchorRef}
        icon={isLoading ? <Loader /> : <DualGovernancePlainIcon />}
        data-testid="dgBtn"
      />
      {!!data && (
        <PopoverStyled
          placement="bottomRight"
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          anchorRef={anchorRef}
        >
          <DualGovernanceWidget dualGovernanceState={data} />
        </PopoverStyled>
      )}
    </Box>
  );
};

type FormArgs = {
  newStakeShareLimit: string;
  newPriorityExitShareThreshold: string;
  currentStakeShareLimit: string;
  currentPriorityExitShareThreshold: string;
};

export const validateUpdateStakingModuleShareLimits = ({
  newStakeShareLimit,
  newPriorityExitShareThreshold,
  currentStakeShareLimit,
  currentPriorityExitShareThreshold,
}: FormArgs): string | null => {
  const newShare = Number(newStakeShareLimit);
  const newThreshold = Number(newPriorityExitShareThreshold);
  const currentShare = Number(currentStakeShareLimit);
  const currentThreshold = Number(currentPriorityExitShareThreshold);

  if (newShare === currentShare && newThreshold === currentThreshold) {
    return 'At least one value must differ from its current value';
  }

  if (newShare > newThreshold) {
    return 'Stake share limit must be less or equal than priority exit share threshold';
  }

  return null;
};

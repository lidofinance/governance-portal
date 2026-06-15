import { MAX_BP } from '@easy-track/constants';

type FormArgs = {
  action: 'create' | 'update' | 'clear';
  subNodeOperators: { nodeOperatorId: string; share: string }[];
};

export const validateCreateOrUpdateOperatorGroup = ({
  action,
  subNodeOperators,
}: FormArgs): string | null => {
  // Clear forces empty operators + empty name in populateTx; nothing to check.
  if (action === 'clear') {
    return null;
  }

  if (subNodeOperators.length === 0) {
    return 'At least one sub-operator is required';
  }

  const sum = subNodeOperators.reduce((acc, { share }) => {
    const parsed = Number(share);
    return Number.isFinite(parsed) ? acc + parsed : acc;
  }, 0);

  if (sum !== MAX_BP) {
    return `Sub-operator shares must sum to ${MAX_BP} (current: ${sum})`;
  }

  return null;
};

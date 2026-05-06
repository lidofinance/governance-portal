const MAX_BP = 10000;

type FormArgs = {
  groupId: string;
  subNodeOperators: { nodeOperatorId: string; share: string }[];
  externalOperators: { nodeOperatorId: string }[];
};

export const validateCreateOrUpdateOperatorGroup = ({
  groupId,
  subNodeOperators,
  externalOperators,
}: FormArgs): string | null => {
  const isCreate = groupId === '0' || groupId === '';

  if (isCreate && subNodeOperators.length === 0) {
    return 'Creating a new group requires at least one sub-operator';
  }

  if (
    !isCreate &&
    subNodeOperators.length === 0 &&
    externalOperators.length > 0
  ) {
    return 'To clear an existing group, external operators must also be empty';
  }

  if (subNodeOperators.length > 0) {
    const sum = subNodeOperators.reduce((acc, { share }) => {
      const parsed = Number(share);
      return Number.isFinite(parsed) ? acc + parsed : acc;
    }, 0);
    if (sum !== MAX_BP) {
      return `Sub-operator shares must sum to ${MAX_BP} (current: ${sum})`;
    }
  }

  return null;
};

export const validateNodeOperatorName = (
  value: string,
  maxNameLength: bigint | undefined,
) => {
  try {
    if (value.trim().length === 0) {
      return 'Name must not be empty';
    }

    if (maxNameLength && maxNameLength < value.length) {
      return `Name length must be less or equal than ${maxNameLength} characters`;
    }
  } catch (error) {
    return 'Unable to parse value';
  }
};

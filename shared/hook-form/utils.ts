export enum DefaultValidationErrorTypes {
  VALIDATE = 'validate',
  UNHANDLED = 'UNHANDLED',
}

export const isValidationErrorTypeValidate = (type?: string) =>
  type === DefaultValidationErrorTypes.VALIDATE;

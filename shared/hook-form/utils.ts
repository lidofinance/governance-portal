export enum DefaultValidationErrorTypes {
  VALIDATE = 'VALIDATE',
  UNHANDLED = 'UNHANDLED',
}

export const isValidationErrorTypeValidate = (type?: string) =>
  type === DefaultValidationErrorTypes.VALIDATE;

enum DefaultValidationErrorTypes {
  VALIDATE = 'VALIDATE',
  UNHANDLED = 'UNHANDLED',
}

// React Hook Form returns error types in uppercase when using resolver and in lowercase when using custom validator option
export const isValidationErrorTypeValidate = (type?: string) =>
  type?.toUpperCase() === DefaultValidationErrorTypes.VALIDATE;

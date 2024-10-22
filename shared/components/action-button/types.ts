export type ButtonType = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
};

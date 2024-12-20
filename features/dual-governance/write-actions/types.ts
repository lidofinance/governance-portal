export type ActionArgs = {
  onConfirm: () => Promise<void>;
  onRetry?: () => void;
};

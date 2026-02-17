import { OrderStatus } from '../types';

export const getOrderStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'open':
      return 'Active';
    case 'fulfilled':
      return 'Fulfilled';
    case 'cancelled':
      return 'Cancelled';
    case 'expired':
      return 'Expired';
    case 'presignaturePending':
    case 'not-created':
      return 'Pending';
    default:
      return 'Unknown';
  }
};

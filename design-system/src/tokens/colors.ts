export const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#2563EB',
    600: '#1D4ED8',
    700: '#1E40AF',
    800: '#1E3A8A',
    900: '#172554',
  },
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  gray: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
};

export const statusColors = {
  pendingPayment: colors.warning,
  pendingAccept: colors.primary[500],
  accepted: colors.primary[500],
  inService: colors.info,
  completed: colors.success,
  cancelled: colors.gray[500],
  refunding: colors.warning,
  refunded: colors.success,
  refundFailed: colors.danger,
};

export const providerStatusColors = {
  online: colors.success,
  busy: colors.warning,
  offline: colors.gray[500],
  working: colors.info,
};

export const textColors = {
  primary: colors.gray[900],
  secondary: colors.gray[700],
  tertiary: colors.gray[500],
  disabled: colors.gray[400],
  link: colors.primary[500],
  error: colors.danger,
  success: colors.success,
};

export const bgColors = {
  page: colors.gray[50],
  card: colors.gray[0],
  nav: colors.gray[0],
  dialog: colors.gray[0],
  input: colors.gray[0],
};

export const borderColors = {
  default: colors.gray[200],
  hover: colors.primary[300],
  focus: colors.primary[500],
  error: colors.danger,
  disabled: colors.gray[200],
};
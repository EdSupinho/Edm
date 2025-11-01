import { StyleSheet } from 'react-native';
import { borderRadius, colors, commonStyles, shadows, spacing, typography } from './designSystem';

export const globalStyles = StyleSheet.create({
  // Botões
  buttonPrimary: {
    ...commonStyles.button,
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  buttonSecondary: {
    ...commonStyles.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonSuccess: {
    ...commonStyles.button,
    backgroundColor: colors.success,
    ...shadows.sm,
  },
  buttonWarning: {
    ...commonStyles.button,
    backgroundColor: colors.warning,
    ...shadows.sm,
  },
  buttonError: {
    ...commonStyles.button,
    backgroundColor: colors.error,
    ...shadows.sm,
  },
  buttonDisabled: {
    ...commonStyles.button,
    backgroundColor: colors.gray300,
  },
  
  // Textos de botão
  buttonTextPrimary: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  buttonTextSecondary: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  
  // Cards
  card: {
    ...commonStyles.card,
  },
  cardElevated: {
    ...commonStyles.card,
    ...shadows.lg,
  },
  
  // Inputs
  input: {
    ...commonStyles.input,
  },
  inputFocused: {
    ...commonStyles.input,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  inputError: {
    ...commonStyles.input,
    borderColor: colors.error,
  },
  
  // Textos
  textHeading: {
    ...commonStyles.textHeading,
  },
  textSubheading: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  textBody: {
    ...commonStyles.textPrimary,
  },
  textCaption: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  textSuccess: {
    color: colors.success,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  textError: {
    color: colors.error,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  textWarning: {
    color: colors.warning,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  
  // Badges
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgePrimary: {
    backgroundColor: colors.primary,
  },
  badgeSuccess: {
    backgroundColor: colors.success,
  },
  badgeWarning: {
    backgroundColor: colors.warning,
  },
  badgeError: {
    backgroundColor: colors.error,
  },
  badgeSecondary: {
    backgroundColor: colors.gray400,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  
  // Dividers
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  dividerThick: {
    height: 2,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...commonStyles.textSecondary,
    marginTop: spacing.sm,
  },
  
  // Empty states
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.lg,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
    color: colors.gray400,
  },
  
  // Shadows
  shadowSm: {
    ...shadows.sm,
  },
  shadowMd: {
    ...shadows.md,
  },
  shadowLg: {
    ...shadows.lg,
  },
  shadowXl: {
    ...shadows.xl,
  },
  
  // Spacing
  marginSm: {
    margin: spacing.sm,
  },
  marginMd: {
    margin: spacing.md,
  },
  marginLg: {
    margin: spacing.lg,
  },
  paddingSm: {
    padding: spacing.sm,
  },
  paddingMd: {
    padding: spacing.md,
  },
  paddingLg: {
    padding: spacing.lg,
  },
  
  // Flex
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexAround: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  // Borders
  borderRounded: {
    borderRadius: borderRadius.md,
  },
  borderRoundedLg: {
    borderRadius: borderRadius.lg,
  },
  borderRoundedXl: {
    borderRadius: borderRadius.xl,
  },
  borderRoundedFull: {
    borderRadius: borderRadius.full,
  },
});

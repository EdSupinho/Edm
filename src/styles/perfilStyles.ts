import { StyleSheet } from 'react-native';
import { borderRadius, colors, commonStyles, shadows, spacing, typography } from './designSystem';

export const perfilStyles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  title: {
    ...commonStyles.textHeading,
    fontSize: typography.fontSize['3xl'],
  },
  syncContainer: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  syncTitle: {
    ...commonStyles.textHeading,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  statusLabelText: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  syncButton: {
    ...commonStyles.button,
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  syncButtonDisabled: {
    backgroundColor: colors.gray400,
  },
  syncButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  syncButtonPortuguese: {
    backgroundColor: colors.success,
    marginTop: spacing.sm,
  },
  profileContainer: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...commonStyles.textHeading,
    fontSize: typography.fontSize.lg,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  editButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  editForm: {
    marginTop: spacing.sm,
  },
  input: {
    ...commonStyles.input,
    marginBottom: spacing.lg,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.gray400,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginRight: spacing.sm,
    alignItems: 'center',
    ...shadows.sm,
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginLeft: spacing.sm,
    alignItems: 'center',
    ...shadows.sm,
  },
  saveButtonDisabled: {
    backgroundColor: colors.gray400,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  profileInfo: {
    marginTop: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  infoLabel: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    width: 80,
  },
  infoValue: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.base,
    flex: 1,
  },
  ordersContainer: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  refreshText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  loadingContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.base,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.lg,
  },
  shopButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  shopButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  ordersList: {
    marginTop: spacing.sm,
  },
  orderCard: {
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderId: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  orderDate: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  orderTotal: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.success,
    marginBottom: spacing.sm,
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  orderItemsTitle: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  orderItem: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
  },
  actionsContainer: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  actionButton: {
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  actionButtonText: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
  },
});

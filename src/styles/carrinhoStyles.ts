import { Dimensions, StyleSheet } from 'react-native';
import { borderRadius, colors, commonStyles, shadows, spacing, typography } from './designSystem';

const { width } = Dimensions.get('window');

export const carrinhoStyles = StyleSheet.create({
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
    fontSize: typography.fontSize['2xl'],
  },
  subtitle: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.base,
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    margin: spacing.lg,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  clearButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
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
  shopButton: {
    ...commonStyles.button,
    ...commonStyles.buttonPrimary,
  },
  shopButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  noResultsText: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.lg,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  clearSearchButton: {
    ...commonStyles.button,
    backgroundColor: colors.gray400,
  },
  clearSearchButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    margin: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  itemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  quantityButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  quantityButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  quantityText: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginHorizontal: spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  removeButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.white,
  },
  summaryContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    margin: spacing.lg,
    marginTop: spacing.md,
    ...shadows.md,
  },
  sectionTitle: {
    ...commonStyles.textHeading,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.base,
  },
  summaryValue: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  totalLabel: {
    ...commonStyles.textHeading,
    fontSize: typography.fontSize.lg,
  },
  totalValue: {
    ...commonStyles.textHeading,
    fontSize: typography.fontSize.lg,
    color: colors.success,
  },
  checkoutButton: {
    ...commonStyles.button,
    backgroundColor: colors.success,
    margin: spacing.lg,
    marginTop: spacing.md,
    ...shadows.lg,
  },
  checkoutButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  userInfoContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    margin: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  userInfoTitle: {
    ...commonStyles.textHeading,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.md,
  },
  userInfoInput: {
    ...commonStyles.input,
    marginBottom: spacing.sm,
  },
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
});

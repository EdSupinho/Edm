import { Dimensions, StyleSheet } from 'react-native';
import { borderRadius, colors, commonStyles, shadows, spacing, typography } from './designSystem';

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.md * 3) / 2;

export const produtosStyles = StyleSheet.create({
  container: {
    ...commonStyles.container,
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
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  title: {
    ...commonStyles.textHeading,
    fontSize: typography.fontSize['3xl'],
  },
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSize.base,
    backgroundColor: colors.surfaceSecondary,
  },
  searchButton: {
    marginLeft: spacing.sm,
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  searchButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...commonStyles.textHeading,
    fontSize: typography.fontSize.xl,
  },
  seeAllText: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginRight: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minWidth: 100,
    alignItems: 'center',
    ...shadows.sm,
  },
  categoryName: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  productCard: {
    backgroundColor: colors.surface,
    marginRight: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    width: 180,
    overflow: 'hidden',
    ...shadows.md,
  },
  productImage: {
    width: '100%',
    height: 140,
  },
  productInfo: {
    padding: spacing.md,
  },
  productName: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.tight * typography.fontSize.sm,
  },
  productPrice: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  productCategory: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.xs,
  },
  seeAllButton: {
    ...commonStyles.button,
    ...commonStyles.buttonPrimary,
    margin: spacing.lg,
  },
  seeAllButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

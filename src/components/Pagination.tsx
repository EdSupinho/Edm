import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <View style={styles.container}>
      {/* Info de itens */}
      <Text style={styles.infoText}>
        Mostrando {startItem}-{endItem} de {totalItems} itens
      </Text>

      {/* Controles de paginação */}
      <View style={styles.pagination}>
        {/* Botão Anterior */}
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={[styles.pageButtonText, currentPage === 1 && styles.pageButtonTextDisabled]}>
            ‹
          </Text>
        </TouchableOpacity>

        {/* Números das páginas */}
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <Text style={styles.dots}>...</Text>
            ) : (
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === page && styles.pageButtonActive
                ]}
                onPress={() => onPageChange(page as number)}
              >
                <Text style={[
                  styles.pageButtonText,
                  currentPage === page && styles.pageButtonTextActive
                ]}>
                  {page}
                </Text>
              </TouchableOpacity>
            )}
          </React.Fragment>
        ))}

        {/* Botão Próximo */}
        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.pageButtonText, currentPage === totalPages && styles.pageButtonTextDisabled]}>
            ›
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  pageButton: {
    minWidth: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    marginVertical: 2,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 8,
  },
  pageButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  pageButtonDisabled: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e0e0e0',
    opacity: 0.5,
  },
  pageButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  pageButtonTextActive: {
    color: '#fff',
  },
  pageButtonTextDisabled: {
    color: '#ccc',
  },
  dots: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
    marginVertical: 2,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FilterOptions {
  precoMin: string;
  precoMax: string;
  categoriaId: number | null;
  disponibilidade: 'todos' | 'disponivel' | 'indisponivel';
  ordenacao: 'nome' | 'preco_asc' | 'preco_desc' | 'data_desc';
}

interface AdvancedSearchProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  categorias: Array<{ id: number; nome: string }>;
  currentFilters?: FilterOptions;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  visible,
  onClose,
  onApplyFilters,
  categorias,
  currentFilters = {
    precoMin: '',
    precoMax: '',
    categoriaId: null,
    disponibilidade: 'todos',
    ordenacao: 'nome'
  }
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      precoMin: '',
      precoMax: '',
      categoriaId: null,
      disponibilidade: 'todos',
      ordenacao: 'nome'
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filtros Avançados</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetButton}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Filtro de Preço */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Faixa de Preço</Text>
            <View style={styles.priceRow}>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Mínimo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={filters.precoMin}
                  onChangeText={(value) => setFilters({ ...filters, precoMin: value })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Máximo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="999.99"
                  value={filters.precoMax}
                  onChangeText={(value) => setFilters({ ...filters, precoMax: value })}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Filtro de Categoria */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  filters.categoriaId === null && styles.categoryButtonActive
                ]}
                onPress={() => setFilters({ ...filters, categoriaId: null })}
              >
                <Text style={[
                  styles.categoryButtonText,
                  filters.categoriaId === null && styles.categoryButtonTextActive
                ]}>
                  Todas
                </Text>
              </TouchableOpacity>
              {categorias.map((categoria) => (
                <TouchableOpacity
                  key={categoria.id}
                  style={[
                    styles.categoryButton,
                    filters.categoriaId === categoria.id && styles.categoryButtonActive
                  ]}
                  onPress={() => setFilters({ ...filters, categoriaId: categoria.id })}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    filters.categoriaId === categoria.id && styles.categoryButtonTextActive
                  ]}>
                    {categoria.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Filtro de Disponibilidade */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disponibilidade</Text>
            <View style={styles.availabilityRow}>
              {[
                { key: 'todos', label: 'Todos' },
                { key: 'disponivel', label: 'Disponível' },
                { key: 'indisponivel', label: 'Indisponível' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.availabilityButton,
                    filters.disponibilidade === option.key && styles.availabilityButtonActive
                  ]}
                  onPress={() => setFilters({ ...filters, disponibilidade: option.key as any })}
                >
                  <Text style={[
                    styles.availabilityButtonText,
                    filters.disponibilidade === option.key && styles.availabilityButtonTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Filtro de Ordenação */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordenar por</Text>
            <View style={styles.sortOptions}>
              {[
                { key: 'nome', label: 'Nome A-Z' },
                { key: 'preco_asc', label: 'Preço: Menor' },
                { key: 'preco_desc', label: 'Preço: Maior' },
                { key: 'data_desc', label: 'Mais Recentes' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortButton,
                    filters.ordenacao === option.key && styles.sortButtonActive
                  ]}
                  onPress={() => setFilters({ ...filters, ordenacao: option.key as any })}
                >
                  <Text style={[
                    styles.sortButtonText,
                    filters.ordenacao === option.key && styles.sortButtonTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  resetButton: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  categoriesScroll: {
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  availabilityButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  availabilityButtonActive: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  availabilityButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  availabilityButtonTextActive: {
    color: '#fff',
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sortButton: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sortButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  applyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

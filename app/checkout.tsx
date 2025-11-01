import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../src/contexts/CartContext';
import { useOrders } from '../src/contexts/OrderContext';

export default function CheckoutScreen() {
  const { items, total, clearCart } = useCart();
  const { createOrder, loading } = useOrders();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    cep: '',
    observacoes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['nome', 'email', 'telefone', 'endereco', 'cidade', 'cep'];
    const missing = required.filter(field => !formData[field as keyof typeof formData].trim());
    
    if (missing.length > 0) {
      Alert.alert('Campos Obrigatórios', `Preencha: ${missing.join(', ')}`);
      return false;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Email Inválido', 'Digite um email válido');
      return false;
    }

    return true;
  };

  const handleFinalizarPedido = async () => {
    if (!validateForm()) return;

    Alert.alert(
      'Confirmar Pedido',
      `Total: R$ ${total.toFixed(2)}\n\nDeseja finalizar o pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: async () => {
            try {
              // Preparar dados do pedido
              const orderData = {
                itens: items.map(item => ({
                  produto_id: item.produto_id,
                  quantidade: item.quantidade,
                  preco: item.preco,
                  nome: item.nome,
                  imagem_url: item.imagem_url
                })),
                total: total,
                nome_cliente: formData.nome,
                email_cliente: formData.email,
                telefone_cliente: formData.telefone,
                endereco_entrega: formData.endereco,
                cidade_entrega: formData.cidade,
                cep_entrega: formData.cep,
                observacoes: formData.observacoes
              };

              // Criar pedido
              const result = await createOrder(orderData);
              
              if (result.success) {
                Alert.alert(
                  'Pedido Realizado!', 
                  `Seu pedido #${result.orderId} foi enviado com sucesso!`,
                  [
                    { 
                      text: 'OK', 
                      onPress: () => {
                        clearCart();
                        router.push('/(tabs)/pedidos' as any);
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Erro', result.error || 'Erro ao criar pedido');
              }
            } catch (error) {
              console.error('Erro ao finalizar pedido:', error);
              Alert.alert('Erro', 'Erro inesperado ao finalizar pedido');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resumo do Pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.nome}</Text>
              <Text style={styles.itemDetails}>
                {item.quantidade}x MZN {item.preco.toFixed(2)}
              </Text>
              <Text style={styles.itemTotal}>
                MTs {(item.preco * item.quantidade).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>MZN {total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Dados Pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nome completo *"
            value={formData.nome}
            onChangeText={(value) => handleInputChange('nome', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Telefone *"
            value={formData.telefone}
            onChangeText={(value) => handleInputChange('telefone', value)}
            keyboardType="phone-pad"
          />
        </View>

        {/* Endereço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Endereço completo *"
            value={formData.endereco}
            onChangeText={(value) => handleInputChange('endereco', value)}
          />
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Cidade *"
              value={formData.cidade}
              onChangeText={(value) => handleInputChange('cidade', value)}
            />
            
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Correios *"
              value={formData.cep}
              onChangeText={(value) => handleInputChange('cep', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Observações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observações sobre o pedido (opcional)"
            value={formData.observacoes}
            onChangeText={(value) => handleInputChange('observacoes', value)}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Botão Finalizar */}
        <TouchableOpacity 
          style={[styles.finalizeButton, loading && styles.finalizeButtonDisabled]} 
          onPress={handleFinalizarPedido}
          disabled={loading}
        >
          <Text style={styles.finalizeButtonText}>
            {loading ? 'Processando...' : `Finalizar Pedido - ${total.toFixed(2)} MZN`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  backButton: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemDetails: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 10,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  finalizeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  finalizeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalizeButtonDisabled: {
    backgroundColor: '#6c757d',
  },
});

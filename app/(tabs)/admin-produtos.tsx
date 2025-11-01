import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiUrl } from '../../src/config/api';
import { useAuth } from '../../src/contexts/AuthContext';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagem_url: string;
  categoria_id: number;
  categoria_nome: string;
  ativo: boolean;
}

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

export default function AdminProdutosScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    imagem_url: '',
    categoria_id: '',
    ativo: true,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { token } = useAuth();
  const API_BASE_URL = getApiUrl();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [produtosRes, categoriasRes] = await Promise.all([
        fetch(`${API_BASE_URL}/produtos`),
        fetch(`${API_BASE_URL}/categorias`)
      ]);
      
      const produtosData = await produtosRes.json();
      const categoriasData = await categoriasRes.json();
      
      setProdutos(produtosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (produto?: Produto) => {
    if (produto) {
      setEditingProduto(produto);
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco.toString(),
        estoque: produto.estoque.toString(),
        imagem_url: produto.imagem_url,
        categoria_id: produto.categoria_id.toString(),
        ativo: produto.ativo,
      });
      setSelectedImage(null);
    } else {
      setEditingProduto(null);
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        estoque: '',
        imagem_url: '',
        categoria_id: '',
        ativo: true,
      });
      setSelectedImage(null);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingProduto(null);
    setSelectedImage(null);
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
        estoque: '',
      imagem_url: '',
      categoria_id: '',
      ativo: true,
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Necessária', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setFormData({...formData, imagem_url: result.assets[0].uri});
    }
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.descricao || !formData.preco || !formData.categoria_id) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const data = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque) || 0,
        imagem_url: formData.imagem_url,
        categoria_id: parseInt(formData.categoria_id),
        ativo: formData.ativo,
      };

      const url = editingProduto 
        ? `${API_BASE_URL}/admin/produtos/${editingProduto.id}`
        : `${API_BASE_URL}/admin/produtos`;
      
      const method = editingProduto ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Sucesso', result.mensagem);
        closeModal();
        loadData();
      } else {
        const error = await response.json();
        Alert.alert('Erro', error.erro || 'Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Alert.alert('Erro', 'Erro ao salvar produto');
    }
  };

  const handleDelete = (produto: Produto) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o produto "${produto.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/admin/produtos/${produto.id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.ok) {
                Alert.alert('Sucesso', 'Produto excluído com sucesso');
                loadData();
              } else {
                const error = await response.json();
                Alert.alert('Erro', error.erro || 'Erro ao excluir produto');
              }
            } catch (error) {
              console.error('Erro ao excluir produto:', error);
              Alert.alert('Erro', 'Erro ao excluir produto');
            }
          }
        }
      ]
    );
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(preco);
  };

  const renderProduto = ({ item }: { item: Produto }) => (
    <View style={styles.produtoCard}>
      <View style={styles.produtoHeader}>
        <Text style={styles.produtoNome} numberOfLines={2}>
          {item.nome}
        </Text>
        <View style={styles.produtoActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openModal(item)}
          >
            <Text style={styles.actionButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.produtoDescricao} numberOfLines={2}>
        {item.descricao}
      </Text>
      
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoPreco}>{formatarPreco(item.preco)}</Text>
        <Text style={styles.produtoEstoque}>Estoque: {item.estoque}</Text>
      </View>
      
      <Text style={styles.produtoCategoria}>{item.categoria_nome}</Text>
      
      <View style={styles.produtoStatus}>
        <Text style={[
          styles.statusText,
          { color: item.ativo ? '#28a745' : '#dc3545' }
        ]}>
          {item.ativo ? 'Ativo' : 'Inativo'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar Produtos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal()}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Produtos */}
      <FlatList
        data={produtos}
        renderItem={renderProduto}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.produtosList}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal de Adicionar/Editar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingProduto ? 'Editar Produto' : 'Novo Produto'}
            </Text>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.saveButton}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome *</Text>
              <TextInput
                style={styles.input}
                value={formData.nome}
                onChangeText={(text) => setFormData({...formData, nome: text})}
                placeholder="Nome do produto"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.descricao}
                onChangeText={(text) => setFormData({...formData, descricao: text})}
                placeholder="Descrição do produto"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>Preço *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.preco}
                  onChangeText={(text) => setFormData({...formData, preco: text})}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>Estoque</Text>
                <TextInput
                  style={styles.input}
                  value={formData.estoque}
                  onChangeText={(text) => setFormData({...formData, estoque: text})}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categorias.map((categoria) => (
                  <TouchableOpacity
                    key={categoria.id}
                    style={[
                      styles.categoriaButton,
                      formData.categoria_id === categoria.id.toString() && styles.categoriaButtonSelected
                    ]}
                    onPress={() => setFormData({...formData, categoria_id: categoria.id.toString()})}
                  >
                    <Text style={[
                      styles.categoriaButtonText,
                      formData.categoria_id === categoria.id.toString() && styles.categoriaButtonTextSelected
                    ]}>
                      {categoria.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Imagem do Produto</Text>
              
              {/* Botão para selecionar da galeria */}
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Text style={styles.imagePickerButtonText}>📸 Selecionar da Galeria</Text>
              </TouchableOpacity>

              {/* Texto "OU" */}
              <View style={styles.orDivider}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>OU</Text>
                <View style={styles.orLine} />
              </View>

              {/* Campo de URL */}
              <TextInput
                style={styles.input}
                value={formData.imagem_url}
                onChangeText={(text) => setFormData({...formData, imagem_url: text})}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </View>

            {formData.imagem_url && (
              <View style={styles.imagePreview}>
                <Text style={styles.label}>Preview da Imagem</Text>
                <Image
                  source={{ uri: formData.imagem_url }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <TouchableOpacity
                style={styles.switchContainer}
                onPress={() => setFormData({...formData, ativo: !formData.ativo})}
              >
                <Text style={styles.label}>Produto Ativo</Text>
                <View style={[
                  styles.switch,
                  formData.ativo && styles.switchActive
                ]}>
                  <View style={[
                    styles.switchThumb,
                    formData.ativo && styles.switchThumbActive
                  ]} />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  produtosList: {
    padding: 15,
  },
  produtoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  produtoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  produtoActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
    borderRadius: 4,
    backgroundColor: '#f8f9fa',
  },
  deleteButton: {
    backgroundColor: '#f8d7da',
  },
  actionButtonText: {
    fontSize: 16,
  },
  produtoDescricao: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  produtoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  produtoPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  produtoEstoque: {
    fontSize: 14,
    color: '#6c757d',
  },
  produtoCategoria: {
    fontSize: 12,
    color: '#007bff',
    marginBottom: 5,
  },
  produtoStatus: {
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6c757d',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  saveButton: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputGroupHalf: {
    flex: 1,
    marginRight: 10,
  },
  inputRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoriaButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 10,
  },
  categoriaButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoriaButtonText: {
    fontSize: 14,
    color: '#6c757d',
  },
  categoriaButtonTextSelected: {
    color: '#fff',
  },
  imagePreview: {
    marginTop: 10,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  imagePickerButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    padding: 2,
  },
  switchActive: {
    backgroundColor: '#28a745',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
});

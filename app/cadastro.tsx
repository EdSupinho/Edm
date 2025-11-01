import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../src/contexts/UserContext';

export default function CadastroScreen() {
  const { register, loading } = useUser();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    endereco: '',
    data_nascimento: '',
    genero: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Erro', 'Email é obrigatório');
      return false;
    }
    if (!formData.senha.trim()) {
      Alert.alert('Erro', 'Senha é obrigatória');
      return false;
    }
    if (formData.senha !== formData.confirmarSenha) {
      Alert.alert('Erro', 'Senhas não coincidem');
      return false;
    }
    if (formData.senha.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleCadastro = async () => {
    if (!validateForm()) return;

    try {
      const result = await register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone,
        endereco: formData.endereco,
        data_nascimento: formData.data_nascimento || undefined,
        genero: formData.genero || undefined
      });

      if (result.success) {
        Alert.alert(
          'Cadastro Realizado!',
          'Sua conta foi criada com sucesso! Agora você pode fazer login.',
          [
            { 
              text: 'Ir para Login', 
              onPress: () => router.push('/login' as any)
            }
          ]
        );
      } else {
        Alert.alert('Erro', result.error || 'Erro ao cadastrar usuário');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Alert.alert('Erro', 'Erro inesperado ao cadastrar usuário');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Criar Conta</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              value={formData.nome}
              onChangeText={(value) => handleInputChange('nome', value)}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChangeText={(value) => handleInputChange('telefone', value)}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Nascimento</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={formData.data_nascimento}
              onChangeText={(value) => handleInputChange('data_nascimento', value)}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gênero</Text>
            <View style={styles.genderRow}>
              {['M', 'F', 'Outro'].map((genero) => (
                <TouchableOpacity
                  key={genero}
                  style={[
                    styles.genderButton,
                    formData.genero === genero && styles.genderButtonActive
                  ]}
                  onPress={() => handleInputChange('genero', genero)}
                >
                  <Text style={[
                    styles.genderButtonText,
                    formData.genero === genero && styles.genderButtonTextActive
                  ]}>
                    {genero}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Digite seu endereço completo"
              value={formData.endereco}
              onChangeText={(value) => handleInputChange('endereco', value)}
              multiline
              numberOfLines={3}
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.sectionTitle}>Segurança</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              value={formData.senha}
              onChangeText={(value) => handleInputChange('senha', value)}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Senha *</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              value={formData.confirmarSenha}
              onChangeText={(value) => handleInputChange('confirmarSenha', value)}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity 
            style={[styles.cadastroButton, loading && styles.cadastroButtonDisabled]} 
            onPress={handleCadastro}
            disabled={loading}
          >
            <Text style={styles.cadastroButtonText}>
              {loading ? 'Criando Conta...' : 'Criar Conta'}
            </Text>
          </TouchableOpacity>

          {/* Link para Login */}
          <View style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/login' as any)}>
              <Text style={styles.loginLinkButton}>Fazer Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
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
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
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
  genderButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  genderButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  cadastroButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  cadastroButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  cadastroButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },
  loginLinkButton: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
});

// Configuração da API
// Para desenvolvimento local, use o IP da sua rede
// Para produção, altere para o domínio do servidor

// Obter URL da API do ambiente ou usar padrão
const getBaseUrl = () => {
  // Prioridade: variável de ambiente > localhost padrão
  // No Expo, variáveis de ambiente devem começar com EXPO_PUBLIC_
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL;
  if (apiUrl) {
    return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
  }
  
  // Fallback para desenvolvimento local
  return 'http://localhost:5000/api';
};

export const API_CONFIG = {
  // URL base da API (será definida dinamicamente)
  BASE_URL: getBaseUrl(),
  
  // URLs alternativas para diferentes ambientes
  LOCALHOST: 'http://localhost:5000/api',
  
  // Timeout para requisições (em ms)
  TIMEOUT: 10000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

export const getApiUrl = () => {
  // Verificar se há variável de ambiente configurada
  const envUrl = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  
  return API_CONFIG.BASE_URL;
};

export default API_CONFIG;

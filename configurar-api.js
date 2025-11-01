#!/usr/bin/env node

/**
 * Script para configurar a URL da API no app Expo
 * 
 * Uso: node configurar-api.js https://sua-url.onrender.com
 */

const fs = require('fs');
const path = require('path');

const apiUrl = process.argv[2];

if (!apiUrl) {
  console.log('❌ Erro: URL da API não fornecida');
  console.log('\n📝 Uso:');
  console.log('   node configurar-api.js https://sua-url.onrender.com');
  console.log('\n💡 Exemplo:');
  console.log('   node configurar-api.js https://loja-api.onrender.com');
  process.exit(1);
}

// Normalizar URL (remover /api se existir no final)
const normalizedUrl = apiUrl.replace(/\/api\/?$/, '');

const apiConfigPath = path.join(__dirname, 'src/config/api.ts');
let apiConfigContent = fs.readFileSync(apiConfigPath, 'utf8');

// Substituir a função getApiUrl para retornar a URL fornecida
const newGetApiUrl = `export const getApiUrl = () => {
  // URL da API hospedada
  return '${normalizedUrl}/api';
};`;

// Substituir a função getApiUrl existente
apiConfigContent = apiConfigContent.replace(
  /export const getApiUrl = \(\) => \{[\s\S]*?\};/,
  newGetApiUrl
);

fs.writeFileSync(apiConfigPath, apiConfigContent, 'utf8');

console.log('✅ URL da API configurada com sucesso!');
console.log(`\n📡 API URL: ${normalizedUrl}/api`);
console.log('\n📝 Próximos passos:');
console.log('   1. Reinicie o servidor Expo (Ctrl+C e depois npm start)');
console.log('   2. Teste a conexão no app');


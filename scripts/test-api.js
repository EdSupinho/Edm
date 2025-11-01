// Script para testar a conexão com a API
const https = require('https');
const http = require('http');

function testAPI(ip) {
  const url = `http://${ip}:5000/api/status`;
  
  console.log(`🔍 Testando conexão com: ${url}`);
  
  http.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ API funcionando!');
        console.log(`📊 Status: ${response.api_externa_online ? 'Online' : 'Offline'}`);
        console.log(`📦 Produtos: ${response.produtos_locais}`);
        console.log(`🏷️ Categorias: ${response.categorias_locais}`);
      } catch (error) {
        console.log('❌ Erro ao parsear resposta:', error.message);
      }
    });
  }).on('error', (error) => {
    console.log(`❌ Erro de conexão: ${error.message}`);
    console.log('💡 Verifique se:');
    console.log('   1. O backend está rodando (python app.py)');
    console.log('   2. O IP está correto');
    console.log('   3. O firewall não está bloqueando a porta 5000');
  });
}

// Testar com diferentes IPs
const ips = [
  '192.168.43.251',
  '192.168.17.1',
  '192.168.248.1',
  'localhost'
];

console.log('🚀 Testando conexões com a API...\n');

ips.forEach((ip, index) => {
  setTimeout(() => {
    console.log(`\n--- Teste ${index + 1}: ${ip} ---`);
    testAPI(ip);
  }, index * 1000);
});

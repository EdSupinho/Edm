const http = require('http');

function testAdminAuth(ip) {
  const baseUrl = `http://${ip}:5000`;
  
  console.log(`🔍 Testando sistema de administrador em: ${baseUrl}`);
  
  console.log('\n--- Teste 1: Login de Administrador ---');
  
  const loginData = JSON.stringify({
    username: 'admin',
    senha: 'admin123'
  });
  
  const loginOptions = {
    hostname: ip,
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };
  
  const loginReq = http.request(loginOptions, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log('✅ Login realizado com sucesso!');
          console.log(`👤 Admin: ${response.admin.username}`);
          console.log(`🔑 Token: ${response.token.substring(0, 20)}...`);
          
          // Teste 2: Verificar token
          testTokenVerification(ip, response.token);
        } else {
          console.log('❌ Erro no login:', response.erro);
        }
      } catch (error) {
        console.log('❌ Erro ao parsear resposta:', error.message);
      }
    });
  });
  
  loginReq.on('error', (error) => {
    console.log(`❌ Erro de conexão: ${error.message}`);
  });
  
  loginReq.write(loginData);
  loginReq.end();
}

function testTokenVerification(ip, token) {
  console.log('\n--- Teste 2: Verificação de Token ---');
  
  const verifyOptions = {
    hostname: ip,
    port: 5000,
    path: '/api/admin/verify',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  
  const verifyReq = http.request(verifyOptions, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log('✅ Token válido!');
          console.log(`👤 Admin verificado: ${response.admin.username}`);
          
          // Teste 3: Criar produto (requer autenticação)
          testCreateProduct(ip, token);
        } else {
          console.log('❌ Token inválido:', response.erro);
        }
      } catch (error) {
        console.log('❌ Erro ao verificar token:', error.message);
      }
    });
  });
  
  verifyReq.on('error', (error) => {
    console.log(`❌ Erro de conexão: ${error.message}`);
  });
  
  verifyReq.end();
}

function testCreateProduct(ip, token) {
  console.log('\n--- Teste 3: Criar Produto (Protegido) ---');
  
  const productData = JSON.stringify({
    nome: 'Produto Teste',
    descricao: 'Produto criado via teste automatizado',
    preco: 100.00,
    estoque: 10,
    categoria_id: 1,
    ativo: true
  });
  
  const productOptions = {
    hostname: ip,
    port: 5000,
    path: '/api/admin/produtos',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': Buffer.byteLength(productData)
    }
  };
  
  const productReq = http.request(productOptions, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log('✅ Produto criado com sucesso!');
          console.log(`📦 ID: ${response.id}`);
          console.log(`📝 Nome: ${response.produto.nome}`);
        } else {
          console.log('❌ Erro ao criar produto:', response.erro);
        }
      } catch (error) {
        console.log('❌ Erro ao parsear resposta:', error.message);
      }
    });
  });
  
  productReq.on('error', (error) => {
    console.log(`❌ Erro de conexão: ${error.message}`);
  });
  
  productReq.write(productData);
  productReq.end();
}

// Testar com diferentes IPs
const ips = [
  '192.168.43.251',
  '192.168.17.1',
  '192.168.248.1',
  'localhost'
];

console.log('🚀 Testando sistema de autenticação de administrador...\n');

ips.forEach((ip, index) => {
  setTimeout(() => {
    console.log(`\n=== Teste ${index + 1}: ${ip} ===`);
    testAdminAuth(ip);
  }, index * 2000);
});

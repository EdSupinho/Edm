# 🚀 Instruções Rápidas - Loja Online

## ⚡ Execução Rápida

### 1. Backend (Flask API)
```bash
cd backend
python run.py
```
**Ou manualmente:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 2. Frontend (React Native/Expo)
```bash
npm install
npx expo start
```

## 📱 Como Testar

1. **Backend**: Acesse `http://localhost:5000/api/produtos` no navegador
2. **Mobile**: Escaneie o QR code com o app Expo Go
3. **Web**: Pressione `w` no terminal do Expo

## 🔧 Configuração de Rede

Para testar em dispositivo físico, substitua `localhost` pelo IP da sua máquina:

1. Descubra seu IP: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Edite os arquivos das telas e substitua:
   ```typescript
   const API_BASE_URL = 'http://SEU_IP:5000/api';
   ```

## 📊 Endpoints da API

- `GET /api/categorias` - Listar categorias
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/{id}` - Detalhes do produto
- `POST /api/usuarios` - Criar usuário
- `POST /api/pedidos` - Criar pedido

## 🛍️ Funcionalidades

✅ **Home**: Produtos em destaque e categorias  
✅ **Produtos**: Catálogo com filtros e busca  
✅ **Carrinho**: Gestão de itens e finalização  
✅ **Perfil**: Dados do usuário e histórico  
✅ **Detalhes**: Informações completas do produto  

## 🎯 Fluxo de Teste

1. Abra o app no dispositivo
2. Navegue pelos produtos na Home
3. Toque em um produto para ver detalhes
4. Adicione produtos ao carrinho
5. Vá para o carrinho e preencha os dados
6. Finalize o pedido
7. Veja o histórico no perfil

## 🐛 Solução de Problemas

**Backend não inicia:**
- Verifique se Python 3 está instalado
- Execute `pip install -r requirements.txt`

**App não carrega dados:**
- Verifique se o backend está rodando na porta 5000
- Confirme a URL da API nos arquivos das telas

**Erro de rede no dispositivo:**
- Use o IP real da máquina em vez de localhost
- Verifique se o dispositivo está na mesma rede

## 📞 Suporte

Se algo não funcionar:
1. Verifique se ambos os servidores estão rodando
2. Confirme as URLs da API
3. Teste primeiro no navegador web
4. Verifique a conexão de rede

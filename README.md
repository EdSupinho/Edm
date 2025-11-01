# Loja Online Mobile

Uma aplicação completa de loja online com backend Flask e frontend React Native/Expo.

## 🚀 Funcionalidades

### Backend (Flask API)
- ✅ API REST completa com Flask
- ✅ Banco de dados SQLite com SQLAlchemy
- ✅ Modelos: Produto, Categoria, Usuario, Pedido, ItemPedido
- ✅ Endpoints para produtos, categorias, usuários e pedidos
- ✅ Dados iniciais pré-populados

### Frontend (React Native/Expo)
- ✅ Tela inicial com produtos em destaque
- ✅ Catálogo de produtos com filtros por categoria
- ✅ Carrinho de compras funcional
- ✅ Perfil do usuário com histórico de pedidos
- ✅ Detalhes do produto com seleção de quantidade
- ✅ Navegação por tabs
- ✅ Design responsivo e moderno

## 📱 Telas da Aplicação

1. **Home** - Produtos em destaque, categorias e busca
2. **Produtos** - Catálogo completo com filtros
3. **Carrinho** - Gerenciamento de itens e finalização
4. **Perfil** - Dados do usuário e histórico de pedidos
5. **Detalhes do Produto** - Informações completas e compra

## 🛠️ Tecnologias Utilizadas

### Backend
- Python 3.x
- Flask
- Flask-SQLAlchemy
- Flask-CORS
- SQLite

### Frontend
- React Native
- Expo
- TypeScript
- React Navigation
- Expo Router

## 📋 Pré-requisitos

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## 🚀 Como Executar

### 1. Configurar o Backend

```bash
# Navegar para a pasta do backend
cd backend

# Instalar dependências Python
pip install -r requirements.txt

# Executar o servidor Flask
python app.py
```

O backend estará rodando em `http://localhost:5000`

### 2. Configurar o Frontend

```bash
# Na pasta raiz do projeto
npm install

# Executar o projeto Expo
npx expo start
```

### 3. Testar no Dispositivo

- **Android**: Instale o app Expo Go e escaneie o QR code
- **iOS**: Instale o app Expo Go e escaneie o QR code
- **Web**: Pressione `w` no terminal para abrir no navegador

## 📊 Estrutura do Projeto

```
my-app/
├── backend/
│   ├── app.py              # Servidor Flask
│   ├── requirements.txt    # Dependências Python
│   └── loja.db            # Banco de dados SQLite
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx       # Tela Home
│   │   ├── produtos.tsx    # Catálogo de Produtos
│   │   ├── carrinho.tsx    # Carrinho de Compras
│   │   └── perfil.tsx      # Perfil do Usuário
│   ├── produto/
│   │   └── [id].tsx        # Detalhes do Produto
│   └── _layout.tsx         # Layout Principal
├── components/             # Componentes Reutilizáveis
├── constants/              # Constantes da Aplicação
└── package.json           # Dependências Node.js
```

## 🔧 Configuração da API

A URL base da API está configurada como `http://localhost:5000/api` em todas as telas. Para usar em dispositivos físicos, você precisará:

1. Descobrir o IP da sua máquina: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Substituir `localhost` pelo IP real nas constantes `API_BASE_URL`

## 📱 Funcionalidades Implementadas

### Backend API
- `GET /api/categorias` - Listar categorias
- `GET /api/produtos` - Listar produtos (com filtros)
- `GET /api/produtos/{id}` - Detalhes do produto
- `POST /api/usuarios` - Criar usuário
- `GET /api/usuarios/{id}` - Dados do usuário
- `POST /api/pedidos` - Criar pedido
- `GET /api/pedidos/usuario/{id}` - Pedidos do usuário

### Frontend Mobile
- ✅ Navegação por tabs
- ✅ Busca de produtos
- ✅ Filtros por categoria
- ✅ Carrinho de compras
- ✅ Gestão de quantidade
- ✅ Finalização de pedidos
- ✅ Perfil do usuário
- ✅ Histórico de pedidos

## 🎨 Design

A aplicação utiliza um design moderno e limpo com:
- Cores principais: Azul (#007bff), Verde (#28a745), Cinza (#6c757d)
- Cards com bordas arredondadas
- Sombras sutis
- Ícones emoji para melhor UX
- Layout responsivo

## 🔄 Fluxo de Compra

1. **Navegação** - Usuário navega pelos produtos
2. **Seleção** - Adiciona produtos ao carrinho
3. **Carrinho** - Revisa itens e preenche dados
4. **Pedido** - Finaliza compra
5. **Confirmação** - Recebe confirmação do pedido

## 🚧 Próximas Melhorias

- [ ] Autenticação de usuários
- [ ] Pagamento integrado
- [ ] Notificações push
- [ ] Avaliações de produtos
- [ ] Wishlist/Favoritos
- [ ] Códigos de desconto
- [ ] Rastreamento de pedidos
- [ ] Chat de suporte

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Se o backend está rodando na porta 5000
2. Se todas as dependências estão instaladas
3. Se o dispositivo está na mesma rede do computador
4. Se a URL da API está correta

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.
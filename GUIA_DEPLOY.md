# 🚀 Guia de Deploy e Compartilhamento da API

Este guia explica como hospedar a API Flask e compartilhar o app Expo para que outras pessoas possam usar.

## 📋 Índice

1. [Hospedagem da API](#1-hospedagem-da-api)
   - [Opção 1: Render (Recomendado - Grátis)](#opção-1-render-grátis)
   - [Opção 2: Railway](#opção-2-railway)
   - [Opção 3: Heroku](#opção-3-heroku)
2. [Configuração do App Expo](#2-configuração-do-app-expo)
3. [Compartilhando o Projeto](#3-compartilhando-o-projeto)
4. [Troubleshooting](#4-troubleshooting)

---

## 1. Hospedagem da API

### Opção 1: Render (Grátis) ⭐ RECOMENDADO

**Render** oferece hospedagem grátis com banco de dados SQLite.

#### Passo a Passo:

1. **Criar conta no Render**
   - Acesse: https://render.com
   - Faça login com GitHub (recomendado)

2. **Preparar o repositório**
   ```bash
   # Certifique-se de que todos os arquivos estão no Git
   git add .
   git commit -m "Preparar para deploy"
   git push
   ```

3. **Criar novo serviço Web no Render**
   - No dashboard do Render, clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub
   - Configure:
     - **Name**: `loja-api` (ou qualquer nome)
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
     - **Root Directory**: `backend`

4. **Configurar variáveis de ambiente**
   No Render, vá em "Environment" e adicione:
   ```
   PORT=10000
   SECRET_KEY=sua_chave_secreta_aleatoria_aqui
   JWT_SECRET_KEY=sua_chave_secreta_aleatoria_aqui
   FLASK_ENV=production
   ALLOWED_ORIGINS=*
   ```

5. **Deploy**
   - Clique em "Create Web Service"
   - Aguarde o deploy (pode levar alguns minutos)
   - Anote a URL gerada (ex: `https://loja-api.onrender.com`)

6. **Testar a API**
   Acesse: `https://sua-url.onrender.com/api/status`
   Deve retornar JSON com status da API.

7. **Popular banco de dados** (Primeira vez)
   Envie uma requisição POST para:
   ```
   POST https://sua-url.onrender.com/api/sync-portugues
   ```
   Isso populará o banco com produtos em português.

---

### Opção 2: Railway

1. Acesse: https://railway.app
2. Conecte com GitHub
3. Crie novo projeto → Deploy from GitHub repo
4. Selecione a pasta `backend`
5. Railway detecta automaticamente o Python
6. Adicione as variáveis de ambiente (mesmas do Render)
7. Deploy automático!

---

### Opção 3: Heroku

1. Instale Heroku CLI
2. Login: `heroku login`
3. Criar app: `heroku create loja-api`
4. Deploy:
   ```bash
   cd backend
   git subtree push --prefix backend heroku main
   ```
5. Configurar variáveis: `heroku config:set SECRET_KEY=sua_chave`

---

## 2. Configuração do App Expo

Após hospedar a API, você precisa configurar o app Expo para usar a URL hospedada.

### Método 1: Variável de Ambiente (Recomendado)

1. **Criar arquivo `.env` na raiz do projeto:**
   ```bash
   EXPO_PUBLIC_API_URL=https://sua-url.onrender.com
   ```

2. **Instalar dependência:**
   ```bash
   npm install dotenv
   ```

3. **Atualizar `app.json` ou criar `babel.config.js`:**
   ```javascript
   // babel.config.js
   module.exports = function(api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: [
         ['module:react-native-dotenv', {
           moduleName: '@env',
           path: '.env',
         }]
       ],
     };
   };
   ```

### Método 2: Editar Diretamente o arquivo `api.ts`

1. Abra: `src/config/api.ts`
2. Altere a função `getApiUrl()`:
   ```typescript
   export const getApiUrl = () => {
     // Substitua pela URL da sua API hospedada
     return 'https://sua-url.onrender.com/api';
   };
   ```

### Método 3: Criar arquivo de configuração

Crie um arquivo `src/config/env.ts`:
```typescript
// Substitua pela URL da sua API hospedada
export const API_BASE_URL = 'https://sua-url.onrender.com';
```

E use no `api.ts`:
```typescript
import { API_BASE_URL } from './env';
export const getApiUrl = () => `${API_BASE_URL}/api`;
```

---

## 3. Compartilhando o Projeto

### Opção A: Compartilhar via GitHub/GitLab

1. **Enviar código para repositório:**
   ```bash
   git add .
   git commit -m "Configurado para deploy"
   git push origin main
   ```

2. **Instruções para quem vai usar:**
   ```
   # Clonar repositório
   git clone https://github.com/seu-usuario/my-app.git
   cd my-app
   
   # Instalar dependências
   npm install
   
   # Configurar API (editar src/config/api.ts com a URL da API)
   # Ou criar arquivo .env com EXPO_PUBLIC_API_URL=https://sua-url.onrender.com
   
   # Rodar app
   npm start
   ```

### Opção B: Compartilhar via Expo Go (Mais fácil)

1. **Publicar no Expo:**
   ```bash
   expo publish
   ```
   Isso gera um link como: `exp://exp.host/@seu-usuario/my-app`

2. **Instruções:**
   - Instalar app "Expo Go" no celular
   - Escanear QR code ou acessar o link
   - O app rodará no celular da pessoa

### Opção C: Build Standalone (APK/IPA)

Para gerar arquivo instalável:

```bash
# Android
expo build:android

# iOS (requer conta Apple Developer)
expo build:ios
```

---

## 4. Troubleshooting

### Problema: API retorna erro CORS

**Solução:**
- No Render/Railway, configure `ALLOWED_ORIGINS=*` nas variáveis de ambiente
- Ou liste as origens específicas separadas por vírgula

### Problema: API não responde após deploy

**Solução:**
1. Verifique os logs no Render/Railway
2. Certifique-se que o `Procfile` está correto
3. Verifique se o `requirements.txt` tem todas as dependências

### Problema: App Expo não conecta na API

**Solução:**
1. Verifique se a URL está correta (use `https://`, não `http://`)
2. Teste a API no navegador primeiro
3. Verifique se não há firewall bloqueando
4. No Expo, use `expo start --tunnel` para contornar problemas de rede

### Problema: Banco de dados vazio

**Solução:**
Após o primeiro deploy, execute:
```bash
curl -X POST https://sua-url.onrender.com/api/sync-portugues
```

Ou use um cliente HTTP como Postman/Insomnia.

---

## 📝 Checklist Final

Antes de compartilhar, verifique:

- [ ] API está rodando e acessível (teste `/api/status`)
- [ ] Banco de dados foi populado (`/api/sync-portugues`)
- [ ] `src/config/api.ts` aponta para URL correta
- [ ] CORS está configurado para aceitar requisições
- [ ] Documentação/instruções foram criadas

---

## 🎉 Pronto!

Agora sua API está hospedada e o app Expo pode ser compartilhado. Qualquer pessoa que clonar o repositório e configurar a URL da API poderá rodar o app e ver seus dados!

**URL da API:** `https://sua-url.onrender.com`  
**URL do App:** `exp://exp.host/@seu-usuario/my-app`

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Render/Railway
2. Teste a API diretamente no navegador
3. Verifique a configuração de CORS
4. Confirme que todas as dependências estão instaladas


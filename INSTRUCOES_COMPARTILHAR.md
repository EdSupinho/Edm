# 📦 Instruções para Compartilhar o Projeto

## 🎯 Resumo Rápido

1. **Hospedar API** → Render.com (grátis)
2. **Configurar URL** → Editar `src/config/api.ts`
3. **Compartilhar código** → GitHub
4. **Outra pessoa roda** → `npm install && npm start`

---

## 🚀 Passo a Passo Completo

### 1️⃣ Hospedar a API no Render

1. Acesse https://render.com e faça login
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `loja-api`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Adicione variáveis de ambiente:
   ```
   PORT=10000
   SECRET_KEY=qualquer_chave_aleatoria_aqui_123
   JWT_SECRET_KEY=qualquer_chave_aleatoria_aqui_123
   FLASK_ENV=production
   ALLOWED_ORIGINS=*
   ```
6. Clique em "Create Web Service"
7. Aguarde o deploy (3-5 minutos)
8. Anote a URL gerada (ex: `https://loja-api.onrender.com`)

### 2️⃣ Popular o Banco de Dados

Após o deploy, execute:

**Opção A - No navegador:**
- Abra: `https://sua-url.onrender.com/api/sync-portugues`
- Se aparecer erro 405, veja Opção B

**Opção B - Com curl ou Postman:**
```bash
curl -X POST https://sua-url.onrender.com/api/sync-portugues
```

Ou use Postman/Insomnia:
- Método: POST
- URL: `https://sua-url.onrender.com/api/sync-portugues`

### 3️⃣ Configurar o App Expo

**Método Rápido (Recomendado):**

Execute no terminal:
```bash
node configurar-api.js https://sua-url.onrender.com
```

**Método Manual:**

Edite o arquivo `src/config/api.ts` e altere a função `getApiUrl()`:
```typescript
export const getApiUrl = () => {
  return 'https://sua-url.onrender.com/api';
};
```

### 4️⃣ Testar Localmente

1. Reinicie o Expo:
   ```bash
   npm start
   ```
2. Teste no app - os produtos devem aparecer!

### 5️⃣ Compartilhar o Código

**Opção A: GitHub (Recomendado)**

1. Criar repositório no GitHub
2. Enviar código:
   ```bash
   git add .
   git commit -m "Configurado para produção"
   git push origin main
   ```

3. Compartilhar o link do repositório

**Opção B: ZIP**

1. Compacte a pasta do projeto
2. Remova `node_modules` antes de compactar
3. Envie o arquivo ZIP

---

## 👥 Para Quem Vai Receber o Projeto

### Instruções de Instalação:

1. **Clonar/Baixar o projeto**
   ```bash
   git clone https://github.com/seu-usuario/my-app.git
   cd my-app
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar URL da API**

   Se você já hospedou a API, edite `src/config/api.ts`:
   ```typescript
   export const getApiUrl = () => {
     return 'https://sua-url.onrender.com/api';
   };
   ```

   Ou use o script:
   ```bash
   node configurar-api.js https://sua-url.onrender.com
   ```

4. **Rodar o app**
   ```bash
   npm start
   ```

5. **Escaneie o QR code** com Expo Go ou pressione:
   - `a` para Android
   - `i` para iOS

---

## ✅ Checklist Antes de Compartilhar

- [ ] API está hospedada e funcionando
- [ ] Banco de dados foi populado (`/api/sync-portugues`)
- [ ] URL da API está configurada no código
- [ ] Testou o app localmente
- [ ] Código está no GitHub ou arquivo ZIP

---

## 🔧 Troubleshooting

### API não conecta
- Verifique se a URL está correta (use `https://`)
- Teste a API no navegador primeiro: `https://sua-url.onrender.com/api/status`
- Verifique CORS nas variáveis de ambiente (`ALLOWED_ORIGINS=*`)

### App mostra erro de rede
- Confirme que a URL da API está correta
- Reinicie o Expo após alterar a configuração
- Use `expo start --tunnel` para problemas de rede

### Banco de dados vazio
- Execute `/api/sync-portugues` após deploy
- Verifique os logs do Render para erros

---

## 📞 URLs Importantes

- **API Status**: `https://sua-url.onrender.com/api/status`
- **API Docs**: Veja `GUIA_DEPLOY.md` para lista completa

---

## 🎉 Pronto!

Agora você pode compartilhar o projeto. Qualquer pessoa que seguir essas instruções conseguirá rodar o app e ver seus dados da API hospedada!


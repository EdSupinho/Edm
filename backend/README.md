# 🚀 API da Loja Online

API Flask para o sistema de loja online.

## 🔧 Configuração Local

### Pré-requisitos
- Python 3.11+
- pip

### Instalação

1. **Criar ambiente virtual:**
```bash
python -m venv venv
```

2. **Ativar ambiente virtual:**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Instalar dependências:**
```bash
pip install -r requirements.txt
```

4. **Rodar API:**
```bash
python app.py
```

A API estará disponível em: `http://localhost:5000`

## 🌐 Deploy

### Render.com (Recomendado)

1. Conecte seu repositório GitHub ao Render
2. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - **Root Directory**: `backend`

3. Variáveis de ambiente:
   - `PORT=10000`
   - `SECRET_KEY=sua_chave_secreta`
   - `JWT_SECRET_KEY=sua_chave_secreta`
   - `FLASK_ENV=production`
   - `ALLOWED_ORIGINS=*`

4. Após deploy, popular banco:
   ```bash
   curl -X POST https://sua-url.onrender.com/api/sync-portugues
   ```

## 📚 Endpoints Principais

- `GET /api/status` - Status da API
- `GET /api/produtos` - Listar produtos
- `GET /api/categorias` - Listar categorias
- `POST /api/sync-portugues` - Popular banco com produtos
- `POST /api/usuarios/cadastro` - Cadastrar usuário
- `POST /api/usuarios/login` - Login

Ver `app.py` para lista completa de endpoints.

## 🔐 Admin Padrão

Após primeira execução:
- **Username:** `admin`
- **Senha:** `admin123`

⚠️ **IMPORTANTE:** Altere a senha após primeiro login!

## 📝 Notas

- SQLite é usado para desenvolvimento
- Em produção, considere usar PostgreSQL
- CORS está configurado para aceitar todas as origens em produção


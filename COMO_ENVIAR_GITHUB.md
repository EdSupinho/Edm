# 📤 Como Enviar Projeto para o GitHub

Guia passo a passo para enviar seu projeto para o GitHub.

---

## 🎯 Opção 1: Usando Git no Terminal (Recomendado)

### Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com
2. Faça login na sua conta (ou crie uma conta se não tiver)
3. Clique no botão **"+"** no canto superior direito → **"New repository"**
4. Preencha:
   - **Repository name**: `my-app` (ou outro nome)
   - **Description**: "Loja online com React Native e Flask"
   - **Public** ou **Private** (escolha uma)
   - **NÃO marque** "Initialize with README" (já temos arquivos)
5. Clique em **"Create repository"**

### Passo 2: Preparar o Projeto Localmente

Abra o terminal na pasta do projeto e execute:

```bash
# 1. Verificar se já é um repositório Git
git status

# Se aparecer erro "not a git repository", inicialize:
git init
```

### Passo 3: Criar arquivo .gitignore (Se não existir)

Crie um arquivo `.gitignore` na raiz do projeto com:

```
# Dependências
node_modules/
venv/
__pycache__/
*.pyc

# Banco de dados
*.db
instance/
backend/loja.db
backend/app.db

# Logs
*.log
npm-debug.log*

# Ambiente
.env
.env.local

# Build
.expo/
dist/
build/

# Sistema
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temporários
*.tmp
.cache/
```

### Passo 4: Adicionar Arquivos ao Git

```bash
# Adicionar todos os arquivos
git add .

# Verificar o que será enviado
git status
```

### Passo 5: Fazer Primeiro Commit

```bash
git commit -m "Initial commit: Loja online com React Native e Flask"
```

### Passo 6: Conectar com o GitHub

```bash
# Adicionar o repositório remoto
# Substitua SEU_USUARIO pelo seu nome de usuário do GitHub
git remote add origin https://github.com/SEU_USUARIO/my-app.git

# Verificar se foi adicionado
git remote -v
```

### Passo 7: Enviar para o GitHub

```bash
# Enviar código (primeira vez)
git branch -M main
git push -u origin main
```

Você será solicitado a fazer login no GitHub.

---

## 🎯 Opção 2: Usando GitHub Desktop (Mais Fácil)

### Passo 1: Instalar GitHub Desktop

1. Baixe: https://desktop.github.com
2. Instale e faça login com sua conta GitHub

### Passo 2: Criar Repositório no GitHub

1. No GitHub Desktop, clique em **"File"** → **"New Repository"**
2. Preencha:
   - **Name**: `my-app`
   - **Local Path**: Escolha a pasta do seu projeto
   - **Git Ignore**: `Node`, `Python`
   - Clique em **"Create Repository"**

### Passo 3: Fazer Commit

1. No GitHub Desktop, você verá todos os arquivos
2. Escreva uma mensagem: "Initial commit"
3. Clique em **"Commit to main"**

### Passo 4: Publicar no GitHub

1. Clique em **"Publish repository"**
2. Escolha se quer **Public** ou **Private**
3. Clique em **"Publish Repository"**

---

## 🎯 Opção 3: Usando Interface Web do GitHub

### Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Crie o repositório (não inicialize com README)

### Passo 2: Fazer Upload Manual

1. No repositório criado, clique em **"uploading an existing file"**
2. Arraste e solte a pasta do projeto
3. Clique em **"Commit changes"**

⚠️ **Nota**: Este método não é recomendado para projetos grandes ou futuros updates.

---

## ✅ Verificar se Funcionou

1. Acesse seu repositório no GitHub: `https://github.com/SEU_USUARIO/my-app`
2. Você deve ver todos os arquivos do projeto

---

## 🔄 Atualizar o Repositório (Depois)

Quando fizer alterações no projeto:

### No Terminal:

```bash
# Ver o que mudou
git status

# Adicionar alterações
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Enviar para GitHub
git push
```

### No GitHub Desktop:

1. Vá na aba **"Changes"**
2. Escreva mensagem do commit
3. Clique em **"Commit to main"**
4. Clique em **"Push origin"**

---

## 🛠️ Comandos Git Úteis

```bash
# Ver status dos arquivos
git status

# Ver histórico de commits
git log

# Ver repositórios remotos
git remote -v

# Baixar atualizações do GitHub
git pull

# Ver diferenças
git diff
```

---

## ❓ Problemas Comuns

### Erro: "fatal: not a git repository"

**Solução**: Execute `git init` na pasta do projeto

### Erro: "repository not found"

**Solução**: Verifique se o nome do usuário e repositório estão corretos:
```bash
git remote set-url origin https://github.com/SEU_USUARIO/my-app.git
```

### Erro: "permission denied"

**Solução**: Você precisa estar logado no GitHub. Execute:
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Erro ao fazer push

**Solução**: Se usar HTTPS, você precisará de um Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Crie um token com permissão `repo`
3. Use o token como senha quando solicitado

---

## 📝 Checklist Antes de Enviar

- [ ] Arquivo `.gitignore` criado
- [ ] `node_modules` não será enviado (está no .gitignore)
- [ ] `venv` não será enviado (está no .gitignore)
- [ ] Banco de dados `.db` não será enviado
- [ ] Arquivos `.env` não serão enviados
- [ ] Todos os arquivos do projeto estão prontos

---

## 🎉 Pronto!

Agora seu projeto está no GitHub e pode ser compartilhado!

**URL do repositório**: `https://github.com/SEU_USUARIO/my-app`

Você pode compartilhar este link com outras pessoas! 🚀


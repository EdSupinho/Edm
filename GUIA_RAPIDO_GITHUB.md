# ⚡ Guia Rápido: Enviar para GitHub

## 🔧 Passo 1: Instalar Git (Se não tiver)

### Windows:

1. Baixe Git: https://git-scm.com/download/win
2. Instale (mantenha todas as opções padrão)
3. **Reinicie o terminal/PowerShell** após instalar

### Verificar se está instalado:
```powershell
git --version
```
Deve mostrar algo como: `git version 2.x.x`

---

## 🚀 Passo 2: Criar Repositório no GitHub

1. Acesse: https://github.com
2. Faça login
3. Clique no **"+"** no canto superior direito
4. Escolha **"New repository"**
5. Preencha:
   - **Name**: `my-app`
   - Escolha **Public** ou **Private**
   - **NÃO marque** "Add README" ou outras opções
6. Clique em **"Create repository"**

---

## 📤 Passo 3: Enviar Código

Abra o **PowerShell** na pasta do projeto (`my-app`) e execute:

```powershell
# 1. Inicializar Git (se ainda não foi feito)
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer primeiro commit
git commit -m "Initial commit: Loja online completa"

# 4. Adicionar repositório remoto
# SUBSTITUA SEU_USUARIO pelo seu nome de usuário do GitHub
git remote add origin https://github.com/EdSupinho/my-app.git

# 5. Renomear branch para main
git branch -M main

# 6. Enviar para GitHub
git push -u origin main
```

**Nota**: Na primeira vez, você será solicitado a fazer login no GitHub.

---

## ✅ Verificar

Acesse: `https://github.com/EdSupinho/my-app`

Você deve ver todos os seus arquivos! 🎉

---

## 🔄 Atualizar Depois (Quando Fizer Mudanças)

```powershell
git add .
git commit -m "Descrição das alterações"
git push
```

---

## ❓ Problemas?

### "git não é reconhecido"
- Instale Git (veja Passo 1)
- **Reinicie o PowerShell** após instalar

### "fatal: not a git repository"
- Execute `git init` primeiro

### Erro de autenticação
- Use Personal Access Token:
  1. GitHub → Settings → Developer settings → Personal access tokens
  2. Generate new token (classic)
  3. Marque `repo`
  4. Copie o token e use como senha

---

## 🎯 Alternativa: GitHub Desktop

Se preferir interface gráfica:

1. Baixe: https://desktop.github.com
2. Instale e faça login
3. File → Add Local Repository
4. Escolha a pasta `my-app`
5. Commit → Push

---

Pronto! Seu projeto está no GitHub! 🚀


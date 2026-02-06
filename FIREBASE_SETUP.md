# 🔥 Configuração do Firebase - PostMaker Pro

## Passos para Configurar

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `postmaker-pro` (ou qualquer nome)
4. Aceite os termos e continue
5. Você pode desabilitar o Google Analytics (opcional)
6. Clique em **"Criar projeto"**

### 2. Adicionar Aplicativo Web

1. No painel do projeto, clique no ícone **`</>`** (Web)
2. Apelido do app: `PostMaker Pro Web`
3. **NÃO** marque "Firebase Hosting" por enquanto
4. Clique em **"Registrar app"**

### 3. Copiar Credenciais

Você verá um código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_xxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "postmaker-pro.firebaseapp.com",
  projectId: "postmaker-pro",
  storageBucket: "postmaker-pro.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx",
};
```

### 4. Configurar no Projeto

1. Abra o arquivo `firebase-config.js`
2. **Substitua** as credenciais de exemplo pelas suas:

```javascript
const firebaseConfig = {
  apiKey: "COLE_SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-id",
  appId: "sua-app-id",
};
```

### 5. Configurar Firestore Database

1. No menu lateral do Firebase, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar no modo de teste"** (para desenvolvimento)
4. Escolha a localização: `southamerica-east1` (São Paulo)
5. Clique em **"Ativar"**

### 6. Configurar Regras de Segurança (Importante!)

No Firestore, vá em **"Regras"** e cole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura para todos
    match /templates/{template} {
      allow read: if true;

      // Permitir escrita apenas com senha (opcional)
      // Ou você pode deixar aberto para testes
      allow write: if true;
    }
  }
}
```

**Importante:** Publique as regras clicando em **"Publicar"**

### 7. Testar a Aplicação

1. Abra `index.html` no navegador
2. Veja se aparece **"Online | Firebase"** no rodapé
3. Vá para o Admin e crie um template
4. Abra em outra aba/dispositivo e veja se aparece!

---

## 🔒 Segurança (Para Produção)

Quando for para produção, melhore as regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /templates/{template} {
      // Qualquer um pode ler
      allow read: if true;

      // Apenas usuários autenticados podem escrever
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📱 Funciona Offline?

**SIM!** O Firebase tem cache local. Se o usuário acessar uma vez online, funcionará offline depois.

---

## 💰 É Grátis?

**SIM!** Plano Spark (grátis) inclui:

- ✅ 1GB de armazenamento
- ✅ 50.000 leituras/dia
- ✅ 20.000 escritas/dia
- ✅ Mais que suficiente para milhares de acessos

---

## ❓ Problemas Comuns

### "Firebase is not defined"

- Verifique se os scripts do Firebase estão carregando
- Abra o Console do navegador (F12) e veja os erros

### "Permission denied"

- Verifique as regras do Firestore
- Certifique-se que publicou as regras

### Templates não aparecem

- Verifique o Console (F12)
- Veja se há erros de CORS ou rede
- Confirme que o Firebase foi inicializado

---

## 🚀 Modo Alternativo (Sem Firebase)

Se não quiser usar Firebase agora, o sistema funciona com **localStorage**:

- ✅ Templates salvos localmente
- ❌ Não compartilha entre dispositivos
- ✅ Funciona 100% offline

Basta **não** configurar o Firebase. O sistema detecta automaticamente e usa localStorage!

---

## 📞 Próximos Passos

1. Configure o Firebase seguindo este guia
2. Teste criando templates
3. Compartilhe o link com outros usuários
4. Todos verão os mesmos templates!

**Dica:** Hospede no Firebase Hosting, Netlify ou Vercel para ter uma URL pública!

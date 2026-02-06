// Configuração do Firebase
// IMPORTANTE: Substitua com suas próprias credenciais do Firebase
// 1. Acesse: https://console.firebase.google.com/
// 2. Crie um projeto
// 3. Adicione um app web
// 4. Copie as credenciais abaixo

const firebaseConfig = {
  apiKey: "AIzaSyBHY8rmSlumcLicY3KsY9SIF424-naJkbA",
  authDomain: "postmaker-e1e8d.firebaseapp.com",
  projectId: "postmaker-e1e8d",
  storageBucket: "postmaker-e1e8d.firebasestorage.app",
  messagingSenderId: "910266276097",
  appId: "1:910266276097:web:27ac4f3be9f868f0f4a300",
};

// Inicializar Firebase
let db = null;
let storage = null;

function initFirebase() {
  try {
    if (typeof firebase === "undefined") {
      console.warn(
        "Firebase SDK não carregado. Usando localStorage como fallback."
      );
      return false;
    }

    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    storage = firebase.storage();

    console.log("✅ Firebase inicializado com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao inicializar Firebase:", error);
    console.warn("Usando localStorage como fallback.");
    return false;
  }
}

// Verificar se Firebase está disponível
const useFirebase = initFirebase();

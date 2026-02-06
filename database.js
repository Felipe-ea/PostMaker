// Módulo de Database - Funciona com Firebase ou localStorage
const Database = {
  // Comprimir imagem para reduzir tamanho
  async compressImage(base64Image, maxSizeKB = 900) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Redimensionar se necessário (máx 1920px)
        const maxDimension = 1920;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Tentar diferentes níveis de qualidade até caber
        let quality = 0.7;
        let compressed = canvas.toDataURL("image/jpeg", quality);

        // Reduzir qualidade se ainda estiver muito grande
        while (compressed.length > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          compressed = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(compressed);
      };
      img.src = base64Image;
    });
  },

  // Salvar template
  async saveTemplate(template) {
    if (useFirebase && db) {
      try {
        console.log("📤 Iniciando salvamento no Firebase...");

        // Comprimir imagem para caber no Firestore
        console.log("🗜️ Comprimindo imagem...");
        const compressedImage = await this.compressImage(template.image, 900);
        console.log(
          `✅ Imagem comprimida: ${(compressedImage.length / 1024).toFixed(
            2
          )} KB`
        );

        // Salvar dados no Firestore
        console.log("💾 Salvando no Firestore...");
        const docRef = await db.collection("templates").add({
          ...template,
          image: compressedImage,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        console.log("✅ Template salvo com ID:", docRef.id);
        template.id = docRef.id;
        return { success: true, id: docRef.id };
      } catch (error) {
        console.error("❌ Erro ao salvar no Firebase:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Fallback para localStorage
      const templates = this.getTemplatesSync();
      template.id = Date.now();
      template.createdAt = new Date().toISOString();
      templates.push(template);
      localStorage.setItem("postmaker_templates", JSON.stringify(templates));
      return { success: true, id: template.id };
    }
  },

  // Obter todos os templates
  async getTemplates(category = null) {
    if (useFirebase && db) {
      try {
        let query = db.collection("templates").orderBy("createdAt", "desc");

        if (category) {
          query = query.where("category", "==", category);
        }

        const snapshot = await query.get();
        const templates = [];

        snapshot.forEach((doc) => {
          templates.push({ id: doc.id, ...doc.data() });
        });

        return templates;
      } catch (error) {
        console.error("Erro ao buscar templates do Firebase:", error);
        return this.getTemplatesSync(category);
      }
    } else {
      return this.getTemplatesSync(category);
    }
  },

  // Obter templates do localStorage (síncrono)
  getTemplatesSync(category = null) {
    const data = localStorage.getItem("postmaker_templates");
    let templates = data ? JSON.parse(data) : [];

    if (category) {
      templates = templates.filter((t) => t.category === category);
    }

    return templates;
  },

  // Deletar template
  async deleteTemplate(id) {
    if (useFirebase && db) {
      try {
        await db.collection("templates").doc(id).delete();
        return { success: true };
      } catch (error) {
        console.error("Erro ao deletar do Firebase:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Fallback para localStorage
      const templates = this.getTemplatesSync();
      const filtered = templates.filter(
        (t) => t.id !== id && t.id !== parseInt(id)
      );
      localStorage.setItem("postmaker_templates", JSON.stringify(filtered));
      return { success: true };
    }
  },

  // Atualizar template
  async updateTemplate(id, updates) {
    if (useFirebase && db) {
      try {
        await db
          .collection("templates")
          .doc(id)
          .update({
            ...updates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        return { success: true };
      } catch (error) {
        console.error("Erro ao atualizar no Firebase:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Fallback para localStorage
      const templates = this.getTemplatesSync();
      const index = templates.findIndex(
        (t) => t.id === id || t.id === parseInt(id)
      );
      if (index !== -1) {
        templates[index] = { ...templates[index], ...updates };
        localStorage.setItem("postmaker_templates", JSON.stringify(templates));
        return { success: true };
      }
      return { success: false, error: "Template não encontrado" };
    }
  },
};

// Funções auxiliares
function showLoading(show = true) {
  const loader = document.getElementById("loadingOverlay");
  if (loader) {
    loader.style.display = show ? "flex" : "none";
  }
}

function showNotification(message, type = "success") {
  // Criar notificação toast
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

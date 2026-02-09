// Estado da aplicação
let selectedTemplate = null;
let canvas, ctx, previewCanvas, previewCtx;
let currentFilter = "";

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("resultCanvas");
  ctx = canvas.getContext("2d");

  previewCanvas = document.getElementById("previewCanvas");
  previewCtx = previewCanvas.getContext("2d");

  loadAvailableTemplates();

  // Event listeners
  document
    .getElementById("generateBtn")
    .addEventListener("click", generatePost);
  document
    .getElementById("downloadBtn")
    .addEventListener("click", downloadPost);
  document.getElementById("newPostBtn").addEventListener("click", resetForm);

  // Preview em tempo real ao digitar
  document
    .getElementById("userName")
    .addEventListener("input", updateLivePreview);
  document
    .getElementById("userPhone")
    .addEventListener("input", handlePhoneInput);

  // Filtros de categoria
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.category || "";
      console.log("🔍 Filtro selecionado:", currentFilter || "Todos");
      loadAvailableTemplates(currentFilter);
    });
  });
});

// Carregar templates disponíveis
async function loadAvailableTemplates(category = null) {
  console.log("🔄 loadAvailableTemplates chamado com categoria:", category);

  const container = document.getElementById("templatesGrid");
  container.innerHTML = '<p class="empty-message">Carregando...</p>';

  const templates = await Database.getTemplates(category);
  console.log("📦 Templates recebidos:", templates.length);

  if (templates.length === 0) {
    const categoryName =
      category === "royal-pago"
        ? "Royal Pago"
        : category === "capital-plus"
        ? "Capital Plus"
        : "";
    const message = categoryName
      ? `Nenhum template da categoria ${categoryName} ainda`
      : "Nenhum template disponível. Peça ao administrador para criar templates.";
    container.innerHTML = `<p class="empty-message">${message}</p>`;
    return;
  }

  container.innerHTML = templates
    .map((template) => {
      const categoryBadge =
        template.category === "royal-pago"
          ? '<span class="category-badge royal">🟡 Royal Pago</span>'
          : '<span class="category-badge capital">🔵 Capital Plus</span>';

      return `
        <div class="template-option ${
          selectedTemplate?.id === template.id ? "selected" : ""
        }" 
             onclick="selectTemplate('${template.id}')">
            <img src="${template.image}" alt="${template.name}">
            <div class="template-info">
              <h3>${template.name}</h3>
              ${categoryBadge}
            </div>
            ${
              selectedTemplate?.id === template.id
                ? '<span class="check-mark">✓</span>'
                : ""
            }
        </div>
    `;
    })
    .join("");
}

// Selecionar template
async function selectTemplate(id) {
  const templates = await Database.getTemplates(currentFilter);
  selectedTemplate = templates.find((t) => t.id == id);

  if (selectedTemplate) {
    document.getElementById("personalizeSection").style.display = "block";
    document.getElementById("previewLive").style.display = "block";
    await loadAvailableTemplates(currentFilter);

    // Inicializar preview
    updateLivePreview();

    // Scroll suave
    document
      .getElementById("personalizeSection")
      .scrollIntoView({ behavior: "smooth" });
  }
}

// Atualizar preview em tempo real
function updateLivePreview() {
  if (!selectedTemplate) return;

  const userName =
    document.getElementById("userName").value.trim() || "SEU NOME";
  const userPhone =
    document.getElementById("userPhone").value.trim() || "(00) 00000-0000";

  renderPost(previewCanvas, previewCtx, userName, userPhone);
}

// Renderizar post no canvas
function renderPost(targetCanvas, targetCtx, userName, userPhone) {
  if (!selectedTemplate) return;

  const img = new Image();
  img.onload = () => {
    // Configurar canvas com tamanho real
    targetCanvas.width = selectedTemplate.imageWidth || img.width;
    targetCanvas.height = selectedTemplate.imageHeight || img.height;

    // Limpar canvas completamente
    targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

    // Desenhar imagem base
    targetCtx.drawImage(img, 0, 0, targetCanvas.width, targetCanvas.height);

    // Configurar anti-aliasing para texto mais suave
    targetCtx.imageSmoothingEnabled = true;
    targetCtx.imageSmoothingQuality = "high";

    // Desenhar nome
    targetCtx.font = `bold ${selectedTemplate.nameStyle.fontSize}px ${selectedTemplate.nameStyle.font}`;
    targetCtx.fillStyle = selectedTemplate.nameStyle.color;
    targetCtx.textAlign = "left";
    targetCtx.textBaseline = "top";

    // Limpar área do texto antes de desenhar (previne duplicação)
    const nameMetrics = targetCtx.measureText(userName);
    const nameHeight = parseInt(selectedTemplate.nameStyle.fontSize) * 1.2;

    targetCtx.fillText(
      userName,
      selectedTemplate.namePosition.x,
      selectedTemplate.namePosition.y
    );

    // Desenhar telefone
    targetCtx.font = `${selectedTemplate.phoneStyle.fontSize}px ${selectedTemplate.phoneStyle.font}`;
    targetCtx.fillStyle = selectedTemplate.phoneStyle.color;
    targetCtx.textAlign = "left";
    targetCtx.textBaseline = "top";

    const phoneMetrics = targetCtx.measureText(userPhone);
    const phoneHeight = parseInt(selectedTemplate.phoneStyle.fontSize) * 1.2;

    targetCtx.fillText(
      userPhone,
      selectedTemplate.phonePosition.x,
      selectedTemplate.phonePosition.y
    );
  };
  img.src = selectedTemplate.image;
}

// Gerar post personalizado
function generatePost() {
  if (!selectedTemplate) {
    showNotification("Selecione um template", "error");
    return;
  }

  const userName = document.getElementById("userName").value.trim();
  const userPhone = document.getElementById("userPhone").value.trim();

  if (!userName || !userPhone) {
    showNotification("Preencha seu nome e telefone", "error");
    return;
  }

  showLoading(true);

  // Renderizar no canvas final
  renderPost(canvas, ctx, userName, userPhone);

  setTimeout(() => {
    showLoading(false);
    showNotification("Post gerado com sucesso! ✨", "success");

    // Mostrar resultado
    document.getElementById("resultSection").style.display = "block";
    document
      .getElementById("resultSection")
      .scrollIntoView({ behavior: "smooth" });
  }, 500);
}

// Baixar post
function downloadPost() {
  const userName = document.getElementById("userName").value.trim() || "post";
  const link = document.createElement("a");
  link.download = `${userName.replace(/\s+/g, "_")}_${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
  showNotification("Download iniciado! 📥", "success");
}

// Resetar formulário
function resetForm() {
  selectedTemplate = null;
  document.getElementById("userName").value = "";
  document.getElementById("userPhone").value = "";
  document.getElementById("personalizeSection").style.display = "none";
  document.getElementById("previewLive").style.display = "none";
  document.getElementById("resultSection").style.display = "none";
  loadAvailableTemplates(currentFilter);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Máscara e atualização para telefone
function handlePhoneInput(e) {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length <= 11) {
    if (value.length <= 2) {
      e.target.value = value;
    } else if (value.length <= 6) {
      e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length <= 10) {
      e.target.value = `(${value.slice(0, 2)}) ${value.slice(
        2,
        6
      )}-${value.slice(6)}`;
    } else {
      e.target.value = `(${value.slice(0, 2)}) ${value.slice(
        2,
        7
      )}-${value.slice(7, 11)}`;
    }
  }

  // Atualizar preview
  updateLivePreview();
}

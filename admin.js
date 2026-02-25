// Estado da aplicação
let currentImage = null;
let canvas, ctx, canvasWrapper;
let nameBox = null;
let phoneBox = null;
let draggedElement = null;
let dragOffset = { x: 0, y: 0 };
let resizing = false;
let currentFilter = "";

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvasWrapper = document.getElementById("canvasWrapper");

  // Event listeners
  document
    .getElementById("imageInput")
    .addEventListener("change", handleImageUpload);
  document
    .getElementById("saveTemplate")
    .addEventListener("click", saveTemplate);

  // Atualizar preview ao mudar configurações
  [
    "nameFontSize",
    "nameColor",
    "nameFont",
    "phoneFontSize",
    "phoneColor",
    "phoneFont",
  ].forEach((id) => {
    document.getElementById(id).addEventListener("input", updatePreview);
  });

  // Filtros de categoria
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.category || "";
      console.log("🔍 Filtro admin:", currentFilter || "Todos");
      loadTemplates(currentFilter);
    });
  });

  // Carregar templates apenas uma vez
  loadTemplates();
});

// Upload de imagem
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      currentImage = img;

      // Configurar canvas com tamanho real da imagem
      canvas.width = img.width;
      canvas.height = img.height;

      // Desenhar imagem
      drawCanvas();

      // Criar caixas de texto
      createTextBoxes();

      // Mostrar seção de configuração
      document.getElementById("configSection").style.display = "block";
      document
        .getElementById("configSection")
        .scrollIntoView({ behavior: "smooth" });
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// Criar caixas de texto arrastáveis
function createTextBoxes() {
  // Remover caixas antigas
  const oldBoxes = canvasWrapper.querySelectorAll(".text-box");
  oldBoxes.forEach((box) => box.remove());

  const canvasRect = canvas.getBoundingClientRect();
  const canvasStyle = window.getComputedStyle(canvas);
  const scaleX = canvas.width / canvas.offsetWidth;
  const scaleY = canvas.height / canvas.offsetHeight;

  // Caixa do nome
  nameBox = createBox(
    "name-box",
    "NOME",
    canvas.width * 0.3,
    canvas.height * 0.3,
    200,
    60,
  );
  canvasWrapper.appendChild(nameBox);

  // Caixa do telefone
  phoneBox = createBox(
    "phone-box",
    "TELEFONE",
    canvas.width * 0.3,
    canvas.height * 0.5,
    250,
    50,
  );
  canvasWrapper.appendChild(phoneBox);
}

// Criar uma caixa
function createBox(className, label, x, y, width, height) {
  const box = document.createElement("div");
  box.className = `text-box ${className}`;
  const icon = label === "NOME" ? "📝" : "📞";
  box.innerHTML = `
        <span class="text-box-label">${icon} ${label}</span>
        <span class="text-box-icon">${icon}</span>
        <div class="text-box-handle"></div>
    `;

  // Posição proporcional ao canvas
  const scaleX = canvas.offsetWidth / canvas.width;
  const scaleY = canvas.offsetHeight / canvas.height;

  box.style.left = x * scaleX + "px";
  box.style.top = y * scaleY + "px";
  box.style.width = width * scaleX + "px";
  box.style.height = height * scaleY + "px";

  // Data attributes para coordenadas reais
  box.dataset.realX = x;
  box.dataset.realY = y;
  box.dataset.realWidth = width;
  box.dataset.realHeight = height;

  // Event listeners para arrastar
  box.addEventListener("mousedown", startDrag);
  box.addEventListener("touchstart", startDrag);

  // Event listeners para redimensionar
  const handle = box.querySelector(".text-box-handle");
  handle.addEventListener("mousedown", startResize);
  handle.addEventListener("touchstart", startResize);

  return box;
}

// Iniciar arrasto
function startDrag(e) {
  if (e.target.classList.contains("text-box-handle")) return;

  e.preventDefault();
  draggedElement = e.currentTarget;

  const rect = draggedElement.getBoundingClientRect();
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  const clientY = e.clientY || (e.touches && e.touches[0].clientY);

  dragOffset.x = clientX - rect.left;
  dragOffset.y = clientY - rect.top;

  document.addEventListener("mousemove", drag);
  document.addEventListener("touchmove", drag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);
}

// Arrastar
function drag(e) {
  if (!draggedElement) return;

  e.preventDefault();
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  const clientY = e.clientY || (e.touches && e.touches[0].clientY);

  const containerRect = canvasWrapper.getBoundingClientRect();
  let newX = clientX - containerRect.left - dragOffset.x;
  let newY = clientY - containerRect.top - dragOffset.y;

  // Limitar dentro do canvas
  newX = Math.max(
    0,
    Math.min(newX, canvas.offsetWidth - draggedElement.offsetWidth),
  );
  newY = Math.max(
    0,
    Math.min(newY, canvas.offsetHeight - draggedElement.offsetHeight),
  );

  draggedElement.style.left = newX + "px";
  draggedElement.style.top = newY + "px";

  // Atualizar coordenadas reais
  const scaleX = canvas.width / canvas.offsetWidth;
  const scaleY = canvas.height / canvas.offsetHeight;

  draggedElement.dataset.realX = newX * scaleX;
  draggedElement.dataset.realY = newY * scaleY;

  updatePreview();
}

// Parar arrasto
function stopDrag() {
  draggedElement = null;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
}

// Iniciar redimensionamento
function startResize(e) {
  e.preventDefault();
  e.stopPropagation();

  resizing = true;
  draggedElement = e.target.closest(".text-box");

  document.addEventListener("mousemove", resize);
  document.addEventListener("touchmove", resize);
  document.addEventListener("mouseup", stopResize);
  document.addEventListener("touchend", stopResize);
}

// Redimensionar
function resize(e) {
  if (!draggedElement || !resizing) return;

  e.preventDefault();
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  const clientY = e.clientY || (e.touches && e.touches[0].clientY);

  const rect = draggedElement.getBoundingClientRect();
  const newWidth = Math.max(80, clientX - rect.left);
  const newHeight = Math.max(30, clientY - rect.top);

  draggedElement.style.width = newWidth + "px";
  draggedElement.style.height = newHeight + "px";

  // Atualizar dimensões reais
  const scaleX = canvas.width / canvas.offsetWidth;
  const scaleY = canvas.height / canvas.offsetHeight;

  draggedElement.dataset.realWidth = newWidth * scaleX;
  draggedElement.dataset.realHeight = newHeight * scaleY;

  updatePreview();
}

// Parar redimensionamento
function stopResize() {
  resizing = false;
  draggedElement = null;
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("touchmove", resize);
  document.removeEventListener("mouseup", stopResize);
  document.removeEventListener("touchend", stopResize);
}

// Desenhar canvas
function drawCanvas() {
  if (!currentImage) return;

  // Limpar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar imagem
  ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
}

// Atualizar preview
function updatePreview() {
  drawCanvas();

  if (!nameBox || !phoneBox) return;

  // Obter estilos
  const nameStyle = {
    fontSize: document.getElementById("nameFontSize").value,
    color: document.getElementById("nameColor").value,
    font: document.getElementById("nameFont").value,
  };

  const phoneStyle = {
    fontSize: document.getElementById("phoneFontSize").value,
    color: document.getElementById("phoneColor").value,
    font: document.getElementById("phoneFont").value,
  };

  // Desenhar texto do nome
  ctx.font = `bold ${nameStyle.fontSize}px ${nameStyle.font}`;
  ctx.fillStyle = nameStyle.color;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  // Usar coordenadas reais
  const nameX = parseFloat(nameBox.dataset.realX);
  const nameY = parseFloat(nameBox.dataset.realY);
  ctx.fillText("NOME EXEMPLO", nameX, nameY);

  // Desenhar texto do telefone
  ctx.font = `${phoneStyle.fontSize}px ${phoneStyle.font}`;
  ctx.fillStyle = phoneStyle.color;

  const phoneX = parseFloat(phoneBox.dataset.realX);
  const phoneY = parseFloat(phoneBox.dataset.realY);
  ctx.fillText("(11) 99999-9999", phoneX, phoneY);
}

// Salvar template
async function saveTemplate() {
  if (!currentImage || !nameBox || !phoneBox) {
    showNotification(
      "Configure a imagem e as posições de nome e telefone",
      "error",
    );
    return;
  }

  const templateName = document.getElementById("templateName").value.trim();
  const templateCategory = document.getElementById("templateCategory").value;

  if (!templateName) {
    showNotification("Insira um nome para o template", "error");
    return;
  }

  if (!templateCategory) {
    showNotification("Selecione uma categoria", "error");
    return;
  }

  showLoading(true);

  // Atualizar mensagem de loading
  const loadingMsg = document.querySelector("#loadingOverlay p");
  if (loadingMsg) loadingMsg.textContent = "Comprimindo imagem...";

  // Redesenhar canvas sem preview
  drawCanvas();

  // Obter imagem base64
  const imageData = canvas.toDataURL("image/png", 0.9);

  // Criar objeto de template com coordenadas reais
  const template = {
    name: templateName,
    category: templateCategory,
    image: imageData,
    imageWidth: canvas.width,
    imageHeight: canvas.height,
    namePosition: {
      x: parseFloat(nameBox.dataset.realX),
      y: parseFloat(nameBox.dataset.realY),
    },
    phonePosition: {
      x: parseFloat(phoneBox.dataset.realX),
      y: parseFloat(phoneBox.dataset.realY),
    },
    nameStyle: {
      fontSize: document.getElementById("nameFontSize").value,
      color: document.getElementById("nameColor").value,
      font: document.getElementById("nameFont").value,
    },
    phoneStyle: {
      fontSize: document.getElementById("phoneFontSize").value,
      color: document.getElementById("phoneColor").value,
      font: document.getElementById("phoneFont").value,
    },
  };

  // Salvar usando Database (Firebase ou localStorage)
  if (loadingMsg) loadingMsg.textContent = "Salvando template...";
  const result = await Database.saveTemplate(template);

  showLoading(false);
  if (loadingMsg) loadingMsg.textContent = "Carregando...";

  if (result.success) {
    showNotification(
      `✅ Template "${templateName}" salvo com sucesso!`,
      "success",
    );

    // Resetar formulário
    document.getElementById("templateName").value = "";
    document.getElementById("templateCategory").value = "";
    document.getElementById("imageInput").value = "";
    document.getElementById("configSection").style.display = "none";
    currentImage = null;
    nameBox = null;
    phoneBox = null;

    // Limpar caixas
    const boxes = canvasWrapper.querySelectorAll(".text-box");
    boxes.forEach((box) => box.remove());

    // Recarregar lista
    await loadTemplates(currentFilter);

    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    showNotification(`❌ Erro ao salvar: ${result.error}`, "error");
  }
}

// Obter templates
function getTemplates() {
  const data = localStorage.getItem("postmaker_templates");
  return data ? JSON.parse(data) : [];
}

// Carregar templates
async function loadTemplates(category = null) {
  console.log("🔄 Admin loadTemplates chamado com categoria:", category);

  const container = document.getElementById("templatesList");
  container.innerHTML = '<p class="empty-message">Carregando...</p>';

  const templates = await Database.getTemplates(category);
  console.log("📦 Admin templates recebidos:", templates.length);

  if (templates.length === 0) {
    const categoryName =
      category === "royal-pago"
        ? "Royal Pago"
        : category === "capital-plus"
          ? "Capital Plus"
          : "";
    const message = categoryName
      ? `Nenhum template da categoria ${categoryName} ainda`
      : "Nenhum template salvo ainda";
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
      <div class="template-card">
        <img src="${template.image}" alt="${template.name}">
        <div class="template-info">
          <h3>${template.name}</h3>
          ${categoryBadge}
        </div>
        <button onclick="deleteTemplate('${template.id}')" class="btn-delete">🗑️ Excluir</button>
      </div>
    `;
    })
    .join("");
}

// Excluir template
async function deleteTemplate(id) {
  if (!confirm("Tem certeza que deseja excluir este template?")) return;

  showLoading(true);
  const result = await Database.deleteTemplate(id);
  showLoading(false);

  if (result.success) {
    showNotification("Template excluído com sucesso", "success");
    await loadTemplates(currentFilter);
  } else {
    showNotification(`Erro ao excluir: ${result.error}`, "error");
  }
}

// Redimensionar caixas quando janela mudar
window.addEventListener("resize", () => {
  if (!nameBox || !phoneBox || !canvas) return;

  const scaleX = canvas.offsetWidth / canvas.width;
  const scaleY = canvas.offsetHeight / canvas.height;

  // Reposicionar caixa do nome
  nameBox.style.left = parseFloat(nameBox.dataset.realX) * scaleX + "px";
  nameBox.style.top = parseFloat(nameBox.dataset.realY) * scaleY + "px";
  nameBox.style.width = parseFloat(nameBox.dataset.realWidth) * scaleX + "px";
  nameBox.style.height = parseFloat(nameBox.dataset.realHeight) * scaleY + "px";

  // Reposicionar caixa do telefone
  phoneBox.style.left = parseFloat(phoneBox.dataset.realX) * scaleX + "px";
  phoneBox.style.top = parseFloat(phoneBox.dataset.realY) * scaleY + "px";
  phoneBox.style.width = parseFloat(phoneBox.dataset.realWidth) * scaleX + "px";
  phoneBox.style.height =
    parseFloat(phoneBox.dataset.realHeight) * scaleY + "px";
});

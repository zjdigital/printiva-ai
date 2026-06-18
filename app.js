// --- DOM Elements ---
const navButtons = document.querySelectorAll(".nav button");
const views = document.querySelectorAll(".view");

// Form Elements
const printivaForm = document.getElementById("printivaForm");
const aiEngine = document.getElementById("aiEngine");
const printMethod = document.getElementById("printMethod");
const themeInput = document.getElementById("theme");
const colorsInput = document.getElementById("colors");
const mainTextInput = document.getElementById("mainText");
const subTextInput = document.getElementById("subText");
const elementsInput = document.getElementById("elements");
const styleTags = document.querySelectorAll(".tag");
const humanMode = document.getElementById("humanMode");
const complexity = document.getElementById("complexity");
const strictMode = document.getElementById("strictMode");

// Preview Elements
const shirtSwatches = document.querySelectorAll(".color-swatch");
const shirtCanvasContainer = document.getElementById("shirtCanvasContainer");
const previewMainText = document.getElementById("previewMainText");
const previewSubText = document.getElementById("previewSubText");
const previewElements = document.getElementById("previewElements");

// Output Elements
const promptResult = document.getElementById("promptResult");
const generatePromptBtn = document.getElementById("generatePromptBtn");
const copyPromptBtn = document.getElementById("copyPromptBtn");
const toast = document.getElementById("toast");

// Brainstorming Elements
const bsTheme = document.getElementById("bsTheme");
const bsVibe = document.getElementById("bsVibe");
const generateBrainstormBtn = document.getElementById("generateBrainstormBtn");
const brainstormResults = document.getElementById("brainstormResults");
const conceptCardsContainer = document.getElementById("conceptCardsContainer");

// --- Navigation ---
navButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.view;
    navButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    views.forEach(view => view.classList.toggle("active", view.id === target));
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// --- Tags Interaction ---
styleTags.forEach(tag => {
  tag.addEventListener("click", () => {
    tag.classList.toggle("active");
    updatePreview();
  });
});

function getActiveTags() {
  const activeTags = [];
  styleTags.forEach(tag => {
    if (tag.classList.contains("active")) {
      activeTags.push(tag.dataset.tag);
    }
  });
  return activeTags.join(", ");
}

// --- Live T-Shirt Preview ---
shirtSwatches.forEach(swatch => {
  swatch.addEventListener("click", () => {
    shirtSwatches.forEach(s => s.classList.remove("active"));
    swatch.classList.add("active");
    const color = swatch.dataset.color;
    shirtCanvasContainer.setAttribute("data-shirt-color", color);
  });
});

function updatePreview() {
  previewMainText.textContent = mainTextInput.value.trim() || "MAIN TEXT";
  previewSubText.textContent = subTextInput.value.trim() || "SUB TEXT";
  previewElements.textContent = elementsInput.value.trim() || "Elemen Visual Kosong";
  
  if (!subTextInput.value.trim()) {
    previewSubText.style.display = 'none';
  } else {
    previewSubText.style.display = 'block';
  }
}

// Attach event listeners to update preview in real-time
[mainTextInput, subTextInput, elementsInput].forEach(input => {
  input.addEventListener("input", updatePreview);
});
updatePreview();

// --- Prompt Generation Logic ---
function buildPrompt() {
  const engine = aiEngine.value;
  const method = printMethod.value;
  const theme = themeInput.value.trim();
  const colors = colorsInput.value.trim();
  const mainText = mainTextInput.value.trim();
  const subText = subTextInput.value.trim();
  const elements = elementsInput.value.trim();
  const tags = getActiveTags();
  const human = humanMode.value;
  const comp = complexity.value;
  const strict = strictMode.value;
  const shirtColor = shirtCanvasContainer.getAttribute("data-shirt-color");

  // Format Text Block
  let typographyBlock = "";
  if (mainText) {
    typographyBlock += `Typography reading "${mainText}"`;
    if (subText) {
      typographyBlock += ` with smaller subtext reading "${subText}" below it`;
    }
    typographyBlock += ".";
  }

  // Printing & Texture Rules
  let printRule = "";
  if (method === "dtf") printRule = "crisp vector style, solid fills, clean edges for DTF printing";
  if (method === "plastisol") printRule = "solid spot colors, clean plastisol screen print style";
  if (method === "discharge") printRule = "soft vintage discharge print style, integrated with fabric";
  if (method === "waterbase") printRule = "soft waterbase ink style, slightly washed";

  // Human / Character Rules
  let humanRule = "";
  if (human === "silhouette") humanRule = "silhouetted character, no facial details, vector style character";
  if (human === "none") humanRule = "no humans, no characters, object and typography focus only";
  if (human === "detailed") humanRule = "detailed character illustration";

  // Complexity Rules
  let compRule = "";
  if (comp === "clean") compRule = "minimalist composition, lots of negative space, highly readable";
  if (comp === "medium") compRule = "balanced composition, moderate details";
  if (comp === "complex") compRule = "highly detailed, dynamic layout, action-packed";

  // Strictness / Negative Prompts
  let negativePrompt = "mockup, t-shirt, wrinkled fabric, model, human face, realistic photo, blurry, bad spelling";
  if (strict === "strict") {
    negativePrompt += ", numbers, badges, random logos, year numbers, random stars, messy splatters, extra text";
  }

  let finalPrompt = "";

  // Output formatting based on Engine
  if (engine === "midjourney") {
    finalPrompt = `**[T-shirt Design Artwork]** isolated on a pure ${shirtColor === 'white' ? 'white' : shirtColor === 'black' ? 'black' : 'solid'} background. 
**Theme**: ${theme}. 
**Colors**: ${colors}. 
**Text**: ${typographyBlock}
**Visuals**: ${elements}. ${tags}. 
**Style**: ${printRule}, ${humanRule}, ${compRule}, flat lighting, 2d vector art style, high contrast.
--no ${negativePrompt} --ar 2:3 --v 6.0`;
  } 
  else if (engine === "dalle3") {
    finalPrompt = `Please create an isolated t-shirt design artwork. Do NOT show a t-shirt mockup, only the graphic itself on a solid ${shirtColor} background. 
The theme is ${theme}. Use a color palette of ${colors}.
The main typography must explicitly read: "${mainText}". 
${subText ? `Include a smaller subtext reading: "${subText}".` : 'Do not include any extra text.'}
Visual elements: ${elements}. 
Artistic Style: ${tags}, ${printRule}, ${humanRule}, ${compRule}. 
Very important: Do not add any random numbers, badges, or years unless explicitly requested. Ensure spelling is perfect.`;
  } 
  else if (engine === "sdxl") {
    finalPrompt = `(t-shirt design artwork:1.3), isolated on solid ${shirtColor} background, ${theme}, (typography "${mainText}":1.2), ${subText ? `(subtext "${subText}":1.1), ` : ''} 
${elements}, ${tags}, ${printRule}, ${humanRule}, ${compRule}, high resolution, sharp edges, vector graphics style.
Negative prompt: ${negativePrompt}`;
  }

  return finalPrompt.trim();
}

generatePromptBtn.addEventListener("click", () => {
  const promptText = buildPrompt();
  promptResult.textContent = promptText;
  
  // Visual feedback
  promptResult.style.backgroundColor = "rgba(79, 70, 229, 0.1)";
  setTimeout(() => {
    promptResult.style.backgroundColor = "#0f172a";
  }, 300);
});

// --- Copy Functionality ---
function copyText(text) {
  if (!text || text.includes("Selesaikan form") || text.includes("Klik \"Generate")) return;
  navigator.clipboard.writeText(text).then(() => {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  });
}

copyPromptBtn.addEventListener("click", () => {
  copyText(promptResult.textContent.trim());
});

// --- Brainstorming Logic ---
const conceptDb = {
  vintage: {
    fontTheme: "Vintage Distressed",
    elements: "Ilustrasi gaya ukiran kayu tua atau badge lawas"
  },
  modern: {
    fontTheme: "Minimalis Bersih",
    elements: "Garis geometris tipis, bentuk abstrak rapi"
  },
  aggressive: {
    fontTheme: "Streetwear Grunge",
    elements: "Garis agresif, cipratan halftone, siluet tajam"
  },
  fun: {
    fontTheme: "Retro 90s Anime",
    elements: "Garis tebal, ekspresi ceria, gaya kartun pop"
  }
};

function getColorsForVibe(topic, vibeKey) {
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash += topic.charCodeAt(i);
  }
  
  const palettes = {
    vintage: [
      "Kuning mustard, putih kusam, navy",
      "Coklat tanah, krem, hijau army",
      "Merah marun, emas pudar, hitam",
      "Biru denim, putih tulang, abu-abu gelap"
    ],
    modern: [
      "Hitam, putih, abu-abu",
      "Biru dongker, putih, perak",
      "Sage green, putih, hitam mamba",
      "Monokrom hitam putih kontras"
    ],
    aggressive: [
      "Merah darah, hitam pekat, putih",
      "Kuning hazard, hitam, abu-abu",
      "Oranye api, hitam, putih terang",
      "Hijau neon, hitam pekat, silver"
    ],
    fun: [
      "Pink neon, cyan, kuning lemon",
      "Ungu pastel, tosca, putih",
      "Kuning cerah, biru langit, putih",
      "Mint green, peach, pink ceria"
    ]
  };
  
  const options = palettes[vibeKey] || palettes.modern;
  return options[hash % options.length];
}

generateBrainstormBtn.addEventListener("click", () => {
  const topic = bsTheme.value.trim() || "Klub Motor";
  const vibeKey = bsVibe.value;
  const vibeData = conceptDb[vibeKey];
  
  const concepts = [
    {
      title: "Konsep 1: Tipografi Dominan",
      mainText: `${topic.toUpperCase()} SQUAD`,
      subText: "Est. 2024 - No Limit",
      elements: `Tanpa elemen rumit, fokus tipografi tebal. ${vibeData.elements}`,
      colors: getColorsForVibe(topic, vibeKey),
      tags: [vibeData.fontTheme, "Tipografi Tebal (Bold Typography)"]
    },
    {
      title: "Konsep 2: Emblem Klasik",
      mainText: `${topic.toUpperCase()}`,
      subText: "Original Culture",
      elements: `Bentuk badge bundar/perisai dengan ikon ${topic}. ${vibeData.elements}`,
      colors: getColorsForVibe(topic + "alternatif", vibeKey),
      tags: ["Gaya Emblem/Badge", vibeData.fontTheme]
    }
  ];

  conceptCardsContainer.innerHTML = "";
  
  concepts.forEach((concept, index) => {
    const card = document.createElement("div");
    card.className = "concept-card";
    card.innerHTML = `
      <h4>${concept.title}</h4>
      <p><strong>Teks Utama:</strong> ${concept.mainText}</p>
      <p><strong>Subteks:</strong> ${concept.subText}</p>
      <p><strong>Warna:</strong> ${concept.colors}</p>
      <p><strong>Elemen:</strong> ${concept.elements}</p>
      <button class="btn secondary mt-4" onclick="applyConcept(${index})">Gunakan Konsep Ini</button>
    `;
    conceptCardsContainer.appendChild(card);
  });
  
  // Store globally for quick apply
  window.currentConcepts = concepts;
  brainstormResults.style.display = "block";
});

window.applyConcept = function(index) {
  const concept = window.currentConcepts[index];
  
  // Apply to form
  themeInput.value = bsTheme.value;
  mainTextInput.value = concept.mainText;
  subTextInput.value = concept.subText;
  colorsInput.value = concept.colors;
  elementsInput.value = concept.elements;
  
  // Set tags
  styleTags.forEach(tag => {
    if (concept.tags.includes(tag.dataset.tag)) {
      tag.classList.add("active");
    } else {
      tag.classList.remove("active");
    }
  });

  // Switch tab to generator
  navButtons[0].click();
  updatePreview();
  
  // Small scroll adjustment
  window.scrollTo({ top: 0, behavior: "smooth" });
  
  // Optional: Auto generate prompt
  setTimeout(buildPrompt, 100);
};

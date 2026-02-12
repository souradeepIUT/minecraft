const blocks = [
  "Oak Planks", "Spruce Logs", "Stone Bricks", "Cobblestone", "Deepslate",
  "Glass", "Lantern", "Copper Block", "Terracotta", "Smooth Quartz",
  "Mangrove Wood", "Dark Oak", "Nether Bricks", "Sea Lantern", "Moss Block",
  "Prismarine", "Brick Block", "Blackstone", "Amethyst", "Sandstone"
];

const buildThemes = [
  { name: "Skywatch Tower", type: "tower" },
  { name: "Riverside Cabin", type: "house" },
  { name: "Ancient Gate", type: "gateway" },
  { name: "Cliffside Farm", type: "farm" },
  { name: "Marketplace Pavilion", type: "hall" },
  { name: "Nether Outpost", type: "fort" }
];

const blockList = document.getElementById("blockList");
const message = document.getElementById("message");
const generateBtn = document.getElementById("generateBtn");
const resultsSection = document.getElementById("results");
const buildTitle = document.getElementById("buildTitle");
const buildDescription = document.getElementById("buildDescription");
const materials = document.getElementById("materials");
const steps = document.getElementById("steps");

function renderBlockPicker() {
  blocks.forEach((block, index) => {
    const label = document.createElement("label");
    label.className = "block-item";
    label.innerHTML = `
      <input type="checkbox" value="${block}" id="b-${index}" />
      <span>${block}</span>
    `;
    blockList.appendChild(label);
  });
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function toImageDataUri(title, items) {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='720' height='360'>
      <rect width='100%' height='100%' fill='#0f172a'/>
      <rect x='20' y='20' width='680' height='320' fill='#1f2937' stroke='#22c55e' stroke-width='3'/>
      <text x='36' y='76' fill='#bbf7d0' font-size='32' font-family='Verdana'>${title}</text>
      <text x='36' y='122' fill='#e5e7eb' font-size='20' font-family='Verdana'>${items}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function generateBuild(selected) {
  const theme = pickRandom(buildThemes);
  const style = pickRandom(["minimal", "medieval", "fantasy", "modern", "steampunk"]);
  const size = pickRandom(["small", "medium", "large"]);

  const title = `${style[0].toUpperCase() + style.slice(1)} ${theme.name}`;
  const description = `A ${size} ${theme.type} designed from your selected blocks. This AI concept can be regenerated infinitely for fresh layouts.`;

  const chosen = [...selected];
  const materialList = chosen.map(item => ({
    item,
    count: 32 + Math.floor(Math.random() * 160)
  }));

  const guide = [
    {
      text: "Lay out the foundation footprint and mark corners.",
      image: toImageDataUri("Step 1: Foundation", chosen.slice(0, 3).join(" • "))
    },
    {
      text: "Raise walls/supports and shape the main silhouette.",
      image: toImageDataUri("Step 2: Structure", chosen.slice(1, 4).join(" • "))
    },
    {
      text: "Add roof/details, then decorate with lighting and accents.",
      image: toImageDataUri("Step 3: Finishing", chosen.slice(0, 2).join(" • "))
    }
  ];

  return { title, description, materialList, guide };
}

function renderResult(result) {
  buildTitle.textContent = result.title;
  buildDescription.textContent = result.description;

  materials.innerHTML = "";
  result.materialList.forEach(({ item, count }) => {
    const li = document.createElement("li");
    li.textContent = `${item}: ${count}`;
    materials.appendChild(li);
  });

  steps.innerHTML = "";
  result.guide.forEach((step, idx) => {
    const article = document.createElement("article");
    article.className = "step";
    article.innerHTML = `
      <strong>Step ${idx + 1}</strong>
      <p>${step.text}</p>
      <img src="${step.image}" alt="Minecraft build guide step ${idx + 1}" />
    `;
    steps.appendChild(article);
  });

  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

generateBtn.addEventListener("click", () => {
  const selected = [...document.querySelectorAll("#blockList input:checked")].map(input => input.value);

  if (selected.length < 2) {
    message.textContent = "Please select at least 2 blocks to generate a build.";
    return;
  }

  message.textContent = "";
  const build = generateBuild(selected);
  renderResult(build);
});

renderBlockPicker();

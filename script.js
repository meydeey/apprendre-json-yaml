// ============================================
// APPRENDRE JSON & YAML — LE LABO IA
// Interactive Learning Platform
// ============================================

let currentSectionIndex = 0;
let completedSections = new Set();

// ============================================
// Parsers
// ============================================
function validateJson(str) {
  try {
    if (!str.trim())
      return { valid: false, error: "Ecris du JSON avant de valider." };
    const parsed = JSON.parse(str);
    return { valid: true, parsed };
  } catch (e) {
    const match = e.message.match(/position (\d+)/);
    let line = null;
    if (match) {
      const pos = parseInt(match[1]);
      line = str.substring(0, pos).split("\n").length;
    }
    return { valid: false, error: e.message, line };
  }
}

function validateYaml(str) {
  try {
    if (!str.trim())
      return { valid: false, error: "Ecris du YAML avant de valider." };
    const parsed = jsyaml.load(str);
    return { valid: true, parsed };
  } catch (e) {
    return {
      valid: false,
      error: e.message,
      line: e.mark ? e.mark.line + 1 : null,
    };
  }
}

function formatJson(str) {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch (e) {
    return null;
  }
}

function jsonToYaml(str) {
  try {
    const obj = JSON.parse(str);
    return jsyaml.dump(obj, { indent: 2, lineWidth: -1 });
  } catch (e) {
    return null;
  }
}

function yamlToJson(str) {
  try {
    const obj = jsyaml.load(str);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return null;
  }
}

// ============================================
// Tree Renderer
// ============================================
function renderTree(obj, indent) {
  indent = indent || 0;
  const pad = '<span class="tree-indent"></span>'.repeat(indent);

  if (obj === null) return `<span class="tree-null">null</span>`;
  if (typeof obj === "string")
    return `<span class="tree-string">"${escapeHtml(obj)}"</span>`;
  if (typeof obj === "number") return `<span class="tree-number">${obj}</span>`;
  if (typeof obj === "boolean")
    return `<span class="tree-boolean">${obj}</span>`;

  if (Array.isArray(obj)) {
    if (obj.length === 0) return `<span class="tree-bracket">[]</span>`;
    let html = `<span class="tree-bracket">[</span>\n`;
    obj.forEach((item, i) => {
      html += `${pad}<span class="tree-indent"></span>${renderTree(item, indent + 1)}`;
      html += i < obj.length - 1 ? ",\n" : "\n";
    });
    html += `${pad}<span class="tree-bracket">]</span>`;
    return html;
  }

  if (typeof obj === "object") {
    const keys = Object.keys(obj);
    if (keys.length === 0) return `<span class="tree-bracket">{}</span>`;
    let html = `<span class="tree-bracket">{</span>\n`;
    keys.forEach((key, i) => {
      html += `${pad}<span class="tree-indent"></span><span class="tree-key">"${escapeHtml(key)}"</span>: ${renderTree(obj[key], indent + 1)}`;
      html += i < keys.length - 1 ? ",\n" : "\n";
    });
    html += `${pad}<span class="tree-bracket">}</span>`;
    return html;
  }

  return String(obj);
}

// ============================================
// Sections
// ============================================
const SECTIONS = [
  {
    id: "welcome",
    title: "Bienvenue",
    category: "intro",
    isWelcome: true,
  },
  {
    id: "cest-quoi-json",
    title: "C'est quoi JSON ?",
    category: "json",
    description:
      "JSON (JavaScript Object Notation) est LE format standard pour echanger des donnees sur le web. Quand ton app communique avec une API (Supabase, Stripe, OpenAI...), les donnees transitent en JSON. C'est lisible par les humains ET par les machines.",
    tips: [
      "JSON = JavaScript Object Notation",
      "C'est un format <code>texte</code> pour structurer des donnees",
      "Utilise dans les APIs, fichiers de config (<code>package.json</code>, <code>tsconfig.json</code>)",
      "Les donnees sont organisees en paires <code>cle: valeur</code>",
      "Toujours entre accolades <code>{}</code> ou crochets <code>[]</code>",
    ],
    format: "json",
    code: '{\n  "message": "Hello JSON !",\n  "auteur": "LE LABO IA",\n  "annee": 2026,\n  "gratuit": true\n}',
  },
  {
    id: "types-json",
    title: "Types de donnees JSON",
    category: "json",
    description:
      "JSON supporte 6 types de donnees. Pas plus, pas moins. C'est cette simplicite qui le rend universel. Les <code>string</code> sont entre guillemets doubles, les <code>number</code> sans guillemets, et <code>null</code> represente l'absence de valeur.",
    tips: [
      '<code>"texte"</code> : string (TOUJOURS guillemets doubles)',
      "<code>42</code>, <code>3.14</code>, <code>-7</code> : number (entier ou decimal)",
      "<code>true</code> / <code>false</code> : boolean",
      "<code>null</code> : absence de valeur",
      "<code>{}</code> : objet (collection de paires cle/valeur)",
      "<code>[]</code> : tableau (liste ordonnee de valeurs)",
    ],
    format: "json",
    code: '{\n  "nom": "Alice",\n  "age": 28,\n  "prix": 19.99,\n  "actif": true,\n  "supprime": false,\n  "adresse": null,\n  "tags": ["dev", "design"],\n  "profil": {\n    "bio": "Developpeuse web",\n    "niveau": "senior"\n  }\n}',
  },
  {
    id: "objets-json",
    title: "Objets JSON",
    category: "json",
    description:
      "Un objet JSON est une collection de paires <code>cle: valeur</code> entre accolades <code>{}</code>. Les cles sont TOUJOURS des strings entre guillemets doubles. Les valeurs peuvent etre n'importe quel type JSON.",
    tips: [
      "Les cles sont TOUJOURS entre <code>guillemets doubles</code>",
      "Chaque paire est separee par une <code>virgule</code>",
      "PAS de virgule apres le dernier element (erreur courante !)",
      "L'ordre des cles n'a pas d'importance",
      "Les cles doivent etre uniques dans un objet",
    ],
    format: "json",
    code: '{\n  "utilisateur": {\n    "id": 1,\n    "nom": "Bob Dupont",\n    "email": "bob@email.com",\n    "role": "admin",\n    "preferences": {\n      "theme": "dark",\n      "langue": "fr",\n      "notifications": true\n    }\n  }\n}',
  },
  {
    id: "tableaux-json",
    title: "Tableaux JSON",
    category: "json",
    description:
      "Un tableau JSON est une liste ordonnee de valeurs entre crochets <code>[]</code>. Les elements peuvent etre de n'importe quel type, meme des objets ou d'autres tableaux. C'est comme ca que les APIs retournent des listes de resultats.",
    tips: [
      "Les elements sont entre <code>crochets []</code>",
      "Separes par des <code>virgules</code>",
      "Peuvent contenir n'importe quel type JSON",
      "Les tableaux d'objets sont le format le plus courant des APIs",
      "L'ordre des elements est preserve",
    ],
    format: "json",
    code: '{\n  "produits": [\n    {\n      "id": 1,\n      "nom": "MacBook Pro",\n      "prix": 2499.99,\n      "en_stock": true\n    },\n    {\n      "id": 2,\n      "nom": "iPhone 15",\n      "prix": 999.99,\n      "en_stock": true\n    },\n    {\n      "id": 3,\n      "nom": "Vision Pro",\n      "prix": 3499.99,\n      "en_stock": false\n    }\n  ],\n  "total": 3\n}',
  },
  {
    id: "json-imbrique",
    title: "JSON imbrique",
    category: "json",
    description:
      "La puissance de JSON vient de l'imbrication : des objets dans des objets, des tableaux dans des objets, des objets dans des tableaux... C'est comme ca que sont structurees les reponses d'API complexes.",
    tips: [
      "Tu peux imbriquer autant de niveaux que necessaire",
      "Chaque niveau doit etre correctement <code>indente</code> pour la lisibilite",
      "Les APIs retournent souvent 3-4 niveaux d'imbrication",
      "Garde la structure aussi plate que possible pour la lisibilite",
    ],
    format: "json",
    code: '{\n  "api_response": {\n    "status": 200,\n    "data": {\n      "users": [\n        {\n          "id": "usr_001",\n          "name": "Alice",\n          "posts": [\n            {\n              "title": "Mon premier post",\n              "tags": ["intro", "hello"],\n              "stats": {\n                "likes": 42,\n                "comments": 7\n              }\n            }\n          ]\n        }\n      ],\n      "pagination": {\n        "page": 1,\n        "per_page": 10,\n        "total": 1\n      }\n    }\n  }\n}',
  },
  {
    id: "erreurs-json",
    title: "Erreurs courantes JSON",
    category: "json",
    description:
      "JSON est strict sur la syntaxe. Une seule erreur et tout le parsing echoue. Voici les erreurs les plus frequentes. Essaie de corriger le JSON ci-dessous !",
    tips: [
      "Guillemets simples <code>'</code> au lieu de doubles <code>\"</code> = ERREUR",
      "Virgule apres le dernier element = ERREUR",
      "Commentaires <code>// ou /* */</code> = ERREUR (JSON ne les supporte pas)",
      "Cle sans guillemets = ERREUR",
      "Valeurs <code>undefined</code>, <code>NaN</code>, <code>Infinity</code> = ERREUR",
      "Utilise le bouton Valider pour trouver les erreurs !",
    ],
    format: "json",
    code: '{\n  nom: "Alice",\n  \'age\': 28,\n  "actif": true,\n  "tags": ["dev", "design",],\n  // Ceci est un commentaire\n  "score": undefined\n}',
  },
  {
    id: "cest-quoi-yaml",
    title: "C'est quoi YAML ?",
    category: "yaml",
    description:
      "YAML (YAML Ain't Markup Language) est un format de donnees concu pour etre lisible par les humains. Pas d'accolades, pas de crochets, pas de guillemets obligatoires. Juste de l'indentation. Tres utilise pour les fichiers de configuration (Docker, GitHub Actions, Kubernetes...).",
    tips: [
      "YAML utilise l'<code>indentation</code> (espaces) au lieu des accolades",
      "Pas de guillemets obligatoires pour les strings",
      "Les <code>commentaires</code> sont supportes avec <code>#</code>",
      "Plus lisible que JSON pour les humains",
      "Utilise dans : Docker Compose, GitHub Actions, Kubernetes, Ansible",
    ],
    format: "yaml",
    code: "# Mon premier fichier YAML\nmessage: Hello YAML !\nauteur: LE LABO IA\nannee: 2026\ngratuit: true",
  },
  {
    id: "syntaxe-yaml",
    title: "Syntaxe YAML de base",
    category: "yaml",
    description:
      "En YAML, les donnees sont structurees par <code>indentation</code> (2 espaces recommandes). Les cles et valeurs sont separees par <code>:</code> suivi d'un espace. Les types sont detectes automatiquement.",
    tips: [
      "<code>cle: valeur</code> : paire cle/valeur (espace apres les deux-points !)",
      "Indentation : <code>2 espaces</code> (JAMAIS de tabulations)",
      "<code>#</code> : commentaire (ignore par le parser)",
      "Les strings n'ont pas besoin de guillemets (sauf cas speciaux)",
      "Les nombres et booleens sont auto-detectes",
      "Guillemets necessaires si la valeur contient <code>:</code> ou commence par <code>{</code> ou <code>[</code>",
    ],
    format: "yaml",
    code: "# Types de donnees en YAML\nnom: Alice Martin          # string (auto-detecte)\nage: 28                    # nombre (auto-detecte)\nprix: 19.99                # decimal\nactif: true                # boolean\nsupprime: false             # boolean\nadresse: null              # null (ou ~)\ndate: 2024-01-15           # string (pas de type date natif)\n\n# String avec caracteres speciaux\nmessage: \"Bonjour: comment ca va ?\"\nchemin: '/usr/local/bin'",
  },
  {
    id: "listes-objets-yaml",
    title: "Listes et objets YAML",
    category: "yaml",
    description:
      "Les listes utilisent un <code>-</code> (tiret + espace) devant chaque element. Les objets imbriques utilisent l'indentation. Tu peux combiner les deux pour des structures complexes.",
    tips: [
      "<code>- element</code> : un element de liste",
      "Les listes peuvent contenir des objets, des strings, des nombres...",
      "L'imbrication se fait par indentation (2 espaces)",
      "Un objet dans une liste : le <code>-</code> est suivi de la premiere cle",
      "Flow syntax possible : <code>[a, b, c]</code> et <code>{x: 1, y: 2}</code>",
    ],
    format: "yaml",
    code: "# Liste simple\nfruits:\n  - pomme\n  - banane\n  - orange\n\n# Liste d'objets\nutilisateurs:\n  - nom: Alice\n    email: alice@email.com\n    role: admin\n  - nom: Bob\n    email: bob@email.com\n    role: user\n\n# Objet imbrique\nserveur:\n  host: localhost\n  port: 3000\n  database:\n    nom: myapp\n    user: postgres\n    password: secret123\n\n# Flow syntax (compact)\ntags: [dev, prod, staging]\nconfig: {debug: true, verbose: false}",
  },
  {
    id: "yaml-avance",
    title: "YAML avance",
    category: "yaml",
    description:
      "YAML a des fonctionnalites avancees : texte multi-lignes, ancres (variables reutilisables), et merge keys. Tres utile dans les fichiers Docker Compose et GitHub Actions.",
    tips: [
      "<code>|</code> : texte multi-ligne (preserve les sauts de ligne)",
      "<code>></code> : texte multi-ligne (fusionne en une seule ligne)",
      "<code>&nom</code> : ancre (definit une variable reutilisable)",
      "<code>*nom</code> : alias (reference une ancre)",
      "<code>&lt;&lt;: *nom</code> : merge key (fusionne un objet ancre)",
    ],
    format: "yaml",
    code: "# Multi-ligne avec | (preserve les retours)\ndescription: |\n  Ceci est un texte\n  sur plusieurs lignes.\n  Chaque saut de ligne est preserve.\n\n# Multi-ligne avec > (fusionne en une ligne)\nresume: >\n  Ceci sera fusionne\n  en une seule ligne\n  continue.\n\n# Ancres et alias (DRY)\ndefaults: &default_config\n  timeout: 30\n  retries: 3\n  log_level: info\n\nproduction:\n  <<: *default_config\n  log_level: error\n  timeout: 60\n\nstaging:\n  <<: *default_config\n  log_level: debug",
  },
  {
    id: "json-vs-yaml",
    title: "JSON vs YAML",
    category: "comparaison",
    description:
      "JSON et YAML representent les memes donnees differemment. JSON est plus strict et universel (APIs, JavaScript). YAML est plus lisible et flexible (config, DevOps). Voici le meme contenu dans les deux formats.",
    tips: [
      "JSON : standard pour les APIs et l'echange de donnees",
      "YAML : prefere pour les fichiers de configuration",
      "JSON : pas de commentaires, strict sur la syntaxe",
      "YAML : commentaires, multi-ligne, ancres",
      "JSON : supporte par TOUS les langages nativement",
      "YAML : necessite une librairie de parsing",
    ],
    format: "dual",
    jsonCode:
      '{\n  "name": "mon-projet",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start"\n  },\n  "dependencies": {\n    "next": "14.0.0",\n    "react": "18.2.0",\n    "typescript": "5.3.0"\n  },\n  "settings": {\n    "theme": "dark",\n    "features": [\n      "auth",\n      "storage",\n      "realtime"\n    ]\n  }\n}',
    yamlCode:
      '# Meme contenu en YAML\nname: mon-projet\nversion: "1.0.0"\n\nscripts:\n  dev: next dev\n  build: next build\n  start: next start\n\ndependencies:\n  next: "14.0.0"\n  react: "18.2.0"\n  typescript: "5.3.0"\n\nsettings:\n  theme: dark\n  features:\n    - auth\n    - storage\n    - realtime',
  },
  {
    id: "convertir",
    title: "Convertir JSON et YAML",
    category: "comparaison",
    description:
      "Tape du JSON ou du YAML dans l'editeur et convertis-le dans l'autre format. C'est un outil que tu peux utiliser au quotidien quand tu travailles avec des configs ou des APIs.",
    tips: [
      "Tape du JSON et clique 'Convertir en YAML'",
      "Ou tape du YAML et clique 'Convertir en JSON'",
      "Le format est auto-detecte",
      "Utile pour transformer un <code>package.json</code> en YAML ou inversement",
    ],
    format: "converter",
    code: '{\n  "name": "Deploy to production",\n  "on": {\n    "push": {\n      "branches": ["main"]\n    }\n  },\n  "jobs": {\n    "deploy": {\n      "runs-on": "ubuntu-latest",\n      "steps": [\n        {\n          "uses": "actions/checkout@v4"\n        },\n        {\n          "name": "Deploy",\n          "run": "npm run deploy"\n        }\n      ]\n    }\n  }\n}',
  },
  {
    id: "cas-pratiques",
    title: "Cas pratiques",
    category: "pratique",
    description:
      "Voici des exemples reels que tu rencontreras dans tes projets : package.json, docker-compose.yml, reponse API Supabase, config n8n. Modifie-les et valide-les !",
    tips: [
      "Change les valeurs et re-valide pour experimenter",
      "Essaie d'ajouter des champs ou de modifier la structure",
      "Les erreurs de syntaxe sont les plus frequentes en pratique",
    ],
    format: "json",
    code: '{\n  "name": "mon-app-supabase",\n  "version": "1.0.0",\n  "private": true,\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start",\n    "lint": "next lint",\n    "test": "vitest"\n  },\n  "dependencies": {\n    "@supabase/supabase-js": "^2.39.0",\n    "next": "^14.0.0",\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "devDependencies": {\n    "@types/react": "^18.2.0",\n    "typescript": "^5.3.0",\n    "tailwindcss": "^3.4.0",\n    "vitest": "^1.0.0"\n  }\n}',
  },
];

// ============================================
// Progress
// ============================================
function loadProgress() {
  try {
    const saved = localStorage.getItem("labo-ia-json-yaml-progress");
    if (saved) completedSections = new Set(JSON.parse(saved));
  } catch (e) {
    completedSections = new Set();
  }
}

function saveProgress() {
  localStorage.setItem(
    "labo-ia-json-yaml-progress",
    JSON.stringify([...completedSections]),
  );
}

// ============================================
// Rendering
// ============================================
function renderSidebar() {
  const nav = document.getElementById("sidebar-nav");
  let html = "";
  let currentCategory = "";

  const categoryLabels = {
    intro: "Introduction",
    json: "JSON",
    yaml: "YAML",
    comparaison: "Comparaison",
    pratique: "Pratique",
  };

  SECTIONS.forEach((section, index) => {
    if (section.category !== currentCategory) {
      currentCategory = section.category;
      html += `<li class="sidebar-section-title">${categoryLabels[currentCategory]}</li>`;
    }

    const isActive = index === currentSectionIndex;
    const isCompleted = completedSections.has(section.id);
    const classes = [
      "sidebar-item",
      isActive ? "active" : "",
      isCompleted ? "completed" : "",
    ]
      .filter(Boolean)
      .join(" ");

    html += `
      <li class="${classes}" data-index="${index}" onclick="navigateTo(${index})">
        <span class="sidebar-check">${isCompleted ? "\u2713" : ""}</span>
        <span class="sidebar-item-number">${index === 0 ? "" : index}</span>
        <span class="sidebar-item-text">${section.title}</span>
      </li>
    `;
  });

  nav.innerHTML = html;
}

function renderSection() {
  const container = document.getElementById("sections-container");
  const section = SECTIONS[currentSectionIndex];

  if (section.isWelcome) {
    container.innerHTML = renderWelcome();
  } else if (section.format === "dual") {
    container.innerHTML = renderDualLesson(section);
    initDualEditor(section);
  } else if (section.format === "converter") {
    container.innerHTML = renderConverterLesson(section);
    initConverterEditor(section);
  } else {
    container.innerHTML = renderLesson(section);
    initEditor(section);
  }

  updateProgress();
  renderSidebar();
}

function renderWelcome() {
  const completed = completedSections.size;
  const total = SECTIONS.length - 1;

  return `
    <div class="section active">
      <div class="welcome-hero">
        <h1>Apprendre JSON & YAML</h1>
        <p>13 lecons interactives pour maitriser les deux formats de donnees les plus utilises du web.</p>
      </div>

      <div class="welcome-cards">
        <div class="welcome-card">
          <div class="welcome-card-icon">&#123;&#125;</div>
          <h3>JSON</h3>
          <p>Le format standard des APIs web et des fichiers de config JavaScript</p>
        </div>
        <div class="welcome-card">
          <div class="welcome-card-icon">&#128196;</div>
          <h3>YAML</h3>
          <p>Le format lisible pour Docker, GitHub Actions, Kubernetes</p>
        </div>
        <div class="welcome-card">
          <div class="welcome-card-icon">&#9989;</div>
          <h3>Validateur live</h3>
          <p>Tape du code, valide-le et vois les erreurs en temps reel</p>
        </div>
        <div class="welcome-card">
          <div class="welcome-card-icon">&#128260;</div>
          <h3>Convertisseur</h3>
          <p>Convertis entre JSON et YAML en un clic</p>
        </div>
      </div>

      ${completed > 0 ? `<p style="text-align:center;color:#10B981;font-weight:600;margin-bottom:8px;">${completed}/${total} sections completees !</p>` : ""}

      <div style="text-align:center;">
        <button class="btn-start" onclick="navigateTo(1)">
          ${completed > 0 ? "Reprendre" : "Commencer"} &#8594;
        </button>
      </div>
    </div>
  `;
}

function renderLesson(section) {
  const isCompleted = completedSections.has(section.id);
  const hasPrev = currentSectionIndex > 0;
  const hasNext = currentSectionIndex < SECTIONS.length - 1;
  const isYaml = section.format === "yaml";
  const badgeClass = isYaml ? "section-badge yaml-badge" : "section-badge";
  const badgeIcon = isYaml ? "&#128196; YAML" : "&#123;&#125; JSON";
  const dotClass = isYaml ? "dot-yaml" : "dot-json";
  const editorLabel = isYaml ? "Editeur YAML" : "Editeur JSON";

  let tipsHtml = "";
  if (section.tips) {
    tipsHtml = `
      <div class="info-card">
        <h3>A retenir</h3>
        <ul>${section.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
      </div>
    `;
  }

  const showConvert = true;
  const convertLabel = isYaml ? "JSON" : "YAML";

  return `
    <div class="section active">
      <div class="section-header">
        <div class="${badgeClass}">
          ${badgeIcon} &mdash; Lecon ${currentSectionIndex}/${SECTIONS.length - 1}
        </div>
        <h1 class="section-title">${section.title}</h1>
        <p class="section-description">${section.description}</p>
      </div>

      ${tipsHtml}

      <div class="editor-container">
        <div class="editor-header">
          <div class="editor-header-label">
            <span class="dot ${dotClass}"></span> ${editorLabel}
          </div>
          <div class="editor-actions">
            <button class="btn-editor" onclick="resetCode()">&#8634; Reset</button>
          </div>
        </div>
        <textarea class="editor-textarea" id="code-editor" spellcheck="false" placeholder="Ecris du ${isYaml ? "YAML" : "JSON"} ici...">${escapeHtml(section.code || "")}</textarea>
        <div class="editor-run-bar">
          <div class="editor-run-bar-left">
            <button class="btn-run" onclick="handleValidate()">&#9654; Valider</button>
            <button class="btn-format" onclick="handleFormat()">&#9998; Formater</button>
            ${showConvert ? `<button class="btn-convert" onclick="handleConvert()">&#128260; Convertir en ${convertLabel}</button>` : ""}
          </div>
          <div class="editor-run-bar-right">
            <span class="run-shortcut">Ctrl+Enter</span>
          </div>
        </div>
      </div>

      <div class="results-panel" id="results-panel">
        <div class="results-header">
          <span class="dot dot-result"></span> Resultat
        </div>
        <div class="results-body" id="results-body">
          <div class="results-placeholder">Clique sur "Valider" pour analyser ton code.</div>
        </div>
      </div>

      <div class="completion-row ${isCompleted ? "completed" : ""}" id="completion-row">
        <label class="completion-label">
          <input type="checkbox" class="completion-checkbox" id="completion-check"
            ${isCompleted ? "checked" : ""}
            onchange="toggleCompletion('${section.id}')">
          J'ai compris cette lecon
        </label>
        <div class="completion-nav">
          ${hasPrev ? `<button class="btn-nav" onclick="navigateTo(${currentSectionIndex - 1})">&#8592; Precedent</button>` : ""}
          ${hasNext ? `<button class="btn-nav btn-nav-next" onclick="navigateTo(${currentSectionIndex + 1})">Suivant &#8594;</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

function renderDualLesson(section) {
  const isCompleted = completedSections.has(section.id);
  const hasPrev = currentSectionIndex > 0;
  const hasNext = currentSectionIndex < SECTIONS.length - 1;

  let tipsHtml = "";
  if (section.tips) {
    tipsHtml = `<div class="info-card"><h3>A retenir</h3><ul>${section.tips.map((t) => `<li>${t}</li>`).join("")}</ul></div>`;
  }

  return `
    <div class="section active">
      <div class="section-header">
        <div class="section-badge">&#128260; Comparaison &mdash; Lecon ${currentSectionIndex}/${SECTIONS.length - 1}</div>
        <h1 class="section-title">${section.title}</h1>
        <p class="section-description">${section.description}</p>
      </div>
      ${tipsHtml}

      <div class="dual-editor">
        <div class="editor-container">
          <div class="editor-header">
            <div class="editor-header-label"><span class="dot dot-json"></span> JSON</div>
            <button class="btn-run" onclick="handleValidateDual('json')" style="padding:5px 12px;font-size:0.75rem;">&#9654; Valider</button>
          </div>
          <textarea class="editor-textarea" id="json-dual-editor" spellcheck="false" style="min-height:300px;">${escapeHtml(section.jsonCode)}</textarea>
        </div>
        <div class="editor-container">
          <div class="editor-header">
            <div class="editor-header-label"><span class="dot dot-yaml"></span> YAML</div>
            <button class="btn-run" onclick="handleValidateDual('yaml')" style="padding:5px 12px;font-size:0.75rem;">&#9654; Valider</button>
          </div>
          <textarea class="editor-textarea" id="yaml-dual-editor" spellcheck="false" style="min-height:300px;">${escapeHtml(section.yamlCode)}</textarea>
        </div>
      </div>

      <div class="results-panel" id="results-panel">
        <div class="results-header"><span class="dot dot-result"></span> Resultat</div>
        <div class="results-body" id="results-body">
          <div class="results-placeholder">Clique sur "Valider" dans l'un des editeurs.</div>
        </div>
      </div>

      <div class="completion-row ${isCompleted ? "completed" : ""}" id="completion-row">
        <label class="completion-label">
          <input type="checkbox" class="completion-checkbox" id="completion-check"
            ${isCompleted ? "checked" : ""} onchange="toggleCompletion('${section.id}')">
          J'ai compris cette lecon
        </label>
        <div class="completion-nav">
          ${hasPrev ? `<button class="btn-nav" onclick="navigateTo(${currentSectionIndex - 1})">&#8592; Precedent</button>` : ""}
          ${hasNext ? `<button class="btn-nav btn-nav-next" onclick="navigateTo(${currentSectionIndex + 1})">Suivant &#8594;</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

function renderConverterLesson(section) {
  const isCompleted = completedSections.has(section.id);
  const hasPrev = currentSectionIndex > 0;
  const hasNext = currentSectionIndex < SECTIONS.length - 1;

  let tipsHtml = "";
  if (section.tips) {
    tipsHtml = `<div class="info-card"><h3>A retenir</h3><ul>${section.tips.map((t) => `<li>${t}</li>`).join("")}</ul></div>`;
  }

  return `
    <div class="section active">
      <div class="section-header">
        <div class="section-badge">&#128260; Outil &mdash; Lecon ${currentSectionIndex}/${SECTIONS.length - 1}</div>
        <h1 class="section-title">${section.title}</h1>
        <p class="section-description">${section.description}</p>
      </div>
      ${tipsHtml}

      <div class="editor-container">
        <div class="editor-header">
          <div class="editor-header-label"><span class="dot dot-json"></span> Entree (JSON ou YAML)</div>
          <button class="btn-editor" onclick="resetCode()">&#8634; Reset</button>
        </div>
        <textarea class="editor-textarea" id="code-editor" spellcheck="false" style="min-height:250px;">${escapeHtml(section.code)}</textarea>
        <div class="editor-run-bar">
          <div class="editor-run-bar-left">
            <button class="btn-convert" onclick="handleConvertTo('yaml')">&#128260; Convertir en YAML</button>
            <button class="btn-convert" onclick="handleConvertTo('json')" style="background:var(--orange);">&#128260; Convertir en JSON</button>
          </div>
          <div class="editor-run-bar-right">
            <button class="btn-format" onclick="handleFormat()">&#9998; Formater</button>
          </div>
        </div>
      </div>

      <div class="results-panel" id="results-panel">
        <div class="results-header"><span class="dot dot-result"></span> Resultat</div>
        <div class="results-body" id="results-body">
          <div class="results-placeholder">Clique sur un bouton de conversion.</div>
        </div>
      </div>

      <div class="completion-row ${isCompleted ? "completed" : ""}" id="completion-row">
        <label class="completion-label">
          <input type="checkbox" class="completion-checkbox" id="completion-check"
            ${isCompleted ? "checked" : ""} onchange="toggleCompletion('${section.id}')">
          J'ai compris cette lecon
        </label>
        <div class="completion-nav">
          ${hasPrev ? `<button class="btn-nav" onclick="navigateTo(${currentSectionIndex - 1})">&#8592; Precedent</button>` : ""}
          ${hasNext ? `<button class="btn-nav btn-nav-next" onclick="navigateTo(${currentSectionIndex + 1})">Suivant &#8594;</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Editor Logic
// ============================================
function setupEditorKeys(editor) {
  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value =
        editor.value.substring(0, start) + "  " + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleValidate();
    }
  });
}

function initEditor(section) {
  const editor = document.getElementById("code-editor");
  if (editor) setupEditorKeys(editor);
}

function initDualEditor(section) {
  const jsonEditor = document.getElementById("json-dual-editor");
  const yamlEditor = document.getElementById("yaml-dual-editor");
  if (jsonEditor) setupEditorKeys(jsonEditor);
  if (yamlEditor) setupEditorKeys(yamlEditor);
}

function initConverterEditor(section) {
  const editor = document.getElementById("code-editor");
  if (editor) setupEditorKeys(editor);
}

function handleValidate() {
  const editor = document.getElementById("code-editor");
  if (!editor) return;

  const code = editor.value;
  const section = SECTIONS[currentSectionIndex];
  const isYaml = section.format === "yaml";

  const result = isYaml ? validateYaml(code) : validateJson(code);
  showResult(result, isYaml ? "YAML" : "JSON");
}

function handleValidateDual(format) {
  const editorId = format === "json" ? "json-dual-editor" : "yaml-dual-editor";
  const editor = document.getElementById(editorId);
  if (!editor) return;

  const result =
    format === "json" ? validateJson(editor.value) : validateYaml(editor.value);
  showResult(result, format.toUpperCase());
}

function showResult(result, format) {
  const body = document.getElementById("results-body");
  if (!body) return;

  if (result.valid) {
    const tree = renderTree(result.parsed);
    body.innerHTML = `
      <div class="results-success">&#9989; ${format} valide !</div>
      <div class="tree-view">${tree}</div>
    `;
  } else {
    body.innerHTML = `
      <div class="results-error">
        <div class="results-error-title">&#10060; Erreur ${format}${result.line ? ` (ligne ${result.line})` : ""}</div>
        <div class="results-error-message">${escapeHtml(result.error)}</div>
      </div>
    `;
  }
}

function handleFormat() {
  const editor = document.getElementById("code-editor");
  if (!editor) return;

  const code = editor.value.trim();
  const section = SECTIONS[currentSectionIndex];
  const isYaml = section.format === "yaml";

  if (isYaml) {
    const result = validateYaml(code);
    if (result.valid) {
      editor.value = jsyaml.dump(result.parsed, { indent: 2, lineWidth: -1 });
      showResult(result, "YAML");
    } else {
      showResult(result, "YAML");
    }
  } else {
    const formatted = formatJson(code);
    if (formatted) {
      editor.value = formatted;
      handleValidate();
    } else {
      showResult(validateJson(code), "JSON");
    }
  }
}

function handleConvert() {
  const editor = document.getElementById("code-editor");
  if (!editor) return;

  const code = editor.value.trim();
  const section = SECTIONS[currentSectionIndex];
  const isYaml = section.format === "yaml";
  const body = document.getElementById("results-body");

  if (isYaml) {
    const json = yamlToJson(code);
    if (json) {
      body.innerHTML = `
        <div class="results-success">&#9989; Converti en JSON :</div>
        <div class="tree-view"><pre style="margin:0;font-family:var(--font-mono);font-size:0.82rem;color:var(--text-primary);">${escapeHtml(json)}</pre></div>
      `;
    } else {
      showResult(validateYaml(code), "YAML");
    }
  } else {
    const yaml = jsonToYaml(code);
    if (yaml) {
      body.innerHTML = `
        <div class="results-success">&#9989; Converti en YAML :</div>
        <div class="tree-view"><pre style="margin:0;font-family:var(--font-mono);font-size:0.82rem;color:var(--text-primary);">${escapeHtml(yaml)}</pre></div>
      `;
    } else {
      showResult(validateJson(code), "JSON");
    }
  }
}

function handleConvertTo(targetFormat) {
  const editor = document.getElementById("code-editor");
  if (!editor) return;

  const code = editor.value.trim();
  const body = document.getElementById("results-body");

  if (targetFormat === "yaml") {
    let yaml = jsonToYaml(code);
    if (!yaml) {
      const yamlResult = validateYaml(code);
      if (yamlResult.valid) {
        yaml = jsyaml.dump(yamlResult.parsed, { indent: 2, lineWidth: -1 });
      }
    }
    if (yaml) {
      body.innerHTML = `
        <div class="results-success">&#9989; Converti en YAML :</div>
        <div class="tree-view"><pre style="margin:0;font-family:var(--font-mono);font-size:0.82rem;color:var(--text-primary);">${escapeHtml(yaml)}</pre></div>
      `;
    } else {
      body.innerHTML = `<div class="results-error"><div class="results-error-title">&#10060; Impossible de convertir</div><div class="results-error-message">Le contenu n'est ni du JSON ni du YAML valide.</div></div>`;
    }
  } else {
    let json = yamlToJson(code);
    if (!json) {
      const jsonResult = validateJson(code);
      if (jsonResult.valid) {
        json = JSON.stringify(jsonResult.parsed, null, 2);
      }
    }
    if (json) {
      body.innerHTML = `
        <div class="results-success">&#9989; Converti en JSON :</div>
        <div class="tree-view"><pre style="margin:0;font-family:var(--font-mono);font-size:0.82rem;color:var(--text-primary);">${escapeHtml(json)}</pre></div>
      `;
    } else {
      body.innerHTML = `<div class="results-error"><div class="results-error-title">&#10060; Impossible de convertir</div><div class="results-error-message">Le contenu n'est ni du JSON ni du YAML valide.</div></div>`;
    }
  }
}

function resetCode() {
  const section = SECTIONS[currentSectionIndex];
  const editor = document.getElementById("code-editor");
  if (editor) editor.value = section.code || "";
  const body = document.getElementById("results-body");
  if (body)
    body.innerHTML = `<div class="results-placeholder">Clique sur "Valider" pour analyser ton code.</div>`;
}

// ============================================
// Navigation & Progress
// ============================================
function navigateTo(index) {
  if (index < 0 || index >= SECTIONS.length) return;
  currentSectionIndex = index;
  renderSection();
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector(".sidebar").classList.remove("open");
  document.querySelector(".sidebar-overlay").classList.remove("visible");
}

function toggleCompletion(sectionId) {
  const row = document.getElementById("completion-row");
  if (completedSections.has(sectionId)) {
    completedSections.delete(sectionId);
    row.classList.remove("completed");
  } else {
    completedSections.add(sectionId);
    row.classList.add("completed");
    const sidebarItem = document.querySelector(
      `.sidebar-item[data-index="${currentSectionIndex}"]`,
    );
    if (sidebarItem) {
      sidebarItem.classList.add("just-completed");
      setTimeout(() => sidebarItem.classList.remove("just-completed"), 500);
    }
    if (completedSections.size === SECTIONS.length - 1) showCelebration();
  }
  saveProgress();
  updateProgress();
  renderSidebar();
}

function updateProgress() {
  const total = SECTIONS.length - 1;
  const completed = completedSections.size;
  const percent = Math.round((completed / total) * 100);

  const fill = document.getElementById("progress-fill");
  const count = document.getElementById("progress-count");
  const label = document.getElementById("progress-label");

  if (fill) fill.style.width = percent + "%";
  if (count) count.textContent = `${completed}/${total}`;
  if (label) {
    if (percent === 0) label.textContent = "Progression";
    else if (percent < 50) label.textContent = "En cours...";
    else if (percent < 100) label.textContent = "Presque !";
    else label.textContent = "Termine !";
  }
}

function showCelebration() {
  const overlay = document.getElementById("celebration");
  if (overlay) overlay.classList.add("visible");
}

function closeCelebration() {
  const overlay = document.getElementById("celebration");
  if (overlay) overlay.classList.remove("visible");
}

function resetAllProgress() {
  if (confirm("Tu es sur de vouloir reinitialiser toute ta progression ?")) {
    completedSections.clear();
    saveProgress();
    updateProgress();
    renderSidebar();
    renderSection();
  }
}

function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("open");
  document.querySelector(".sidebar-overlay").classList.toggle("visible");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ============================================
// Init
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  loadProgress();
  renderSidebar();
  renderSection();
  document
    .querySelector(".sidebar-overlay")
    .addEventListener("click", toggleSidebar);
});

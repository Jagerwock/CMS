const SECTION_CATEGORIES = {
  hero: "informativa",
  about: "informativa",
  services: "comercial",
  features: "comercial",
  gallery: "visual",
  testimonials: "soporte/confianza",
  faq: "soporte/confianza",
  cta: "conversión",
  contact: "conversión",
  blogPreview: "informativa",
  team: "soporte/confianza",
  pricing: "comercial",
  custom: "visual"
};

const BLOCK_CATEGORIES = {
  heading: "texto",
  paragraph: "texto",
  button: "acción",
  image: "visual",
  iconText: "compuesto",
  card: "compuesto",
  testimonialItem: "datos",
  faqItem: "datos",
  pricingCard: "datos",
  statItem: "datos",
  divider: "visual",
  spacer: "visual",
  form: "acción",
  galleryItem: "visual"
};

const PAGE_STATUSES = ["draft", "review", "published", "archived"];

const state = {
  tab: "dashboard",
  statsPeriod: "weekly",
  selectedPageId: "home",
  selectedSectionId: "hero_1",
  data: {
    site: { id: "site_nova", name: "NovaBuilder Demo Site", plan: "Pro", status: "active", createdAt: "2026-01-14" },
    pages: [
      {
        id: "home",
        title: "Inicio",
        slug: "/",
        status: "published",
        updatedAt: "2026-03-05",
        sections: [
          {
            id: "hero_1",
            type: "hero",
            name: "Hero principal",
            blocks: [
              { id: "heading_1", type: "heading", content: { text: "Crea sitios profesionales con bloques reutilizables" } },
              { id: "paragraph_1", type: "paragraph", content: { text: "Construye páginas, administra contenido y publica más rápido desde un builder visual escalable." } },
              { id: "button_1", type: "button", content: { text: "Comenzar ahora", href: "#" } },
              { id: "stat_1", type: "statItem", content: { label: "Sitios publicados", value: "1,240+" } }
            ]
          },
          {
            id: "services_1",
            type: "services",
            name: "Servicios",
            blocks: [
              { id: "heading_2", type: "heading", content: { text: "Todo lo necesario para un CMS visual moderno" } },
              { id: "card_1", type: "card", content: { title: "Page manager", description: "Controla títulos, slugs y estados." } },
              { id: "card_2", type: "card", content: { title: "Builder estructural", description: "Gestiona secciones y bloques por tipo." } },
              { id: "card_3", type: "card", content: { title: "SEO integrado", description: "Optimiza title, description, robots y canonical." } }
            ]
          },
          {
            id: "faq_1",
            type: "faq",
            name: "FAQ",
            blocks: [
              { id: "faq_item_1", type: "faqItem", content: { question: "¿Puedo reutilizar bloques?", answer: "Sí, la librería permite reutilización modular en múltiples secciones." } },
              { id: "faq_item_2", type: "faqItem", content: { question: "¿Está preparado para backend?", answer: "La estructura JSON y la separación por módulos está lista para APIs." } }
            ]
          },
          {
            id: "cta_1",
            type: "cta",
            name: "CTA final",
            blocks: [
              { id: "heading_3", type: "heading", content: { text: "Transforma tu flujo de creación web" } },
              { id: "button_2", type: "button", content: { text: "Activar trial", href: "#" } }
            ]
          }
        ]
      },
      {
        id: "about",
        title: "Nosotros",
        slug: "/nosotros",
        status: "review",
        updatedAt: "2026-03-03",
        sections: [
          {
            id: "about_1",
            type: "about",
            name: "Introducción",
            blocks: [
              { id: "heading_4", type: "heading", content: { text: "Equipo experto en producto y arquitectura CMS" } },
              { id: "paragraph_2", type: "paragraph", content: { text: "Diseñamos experiencias SaaS para escalar operaciones de contenido." } },
              { id: "image_1", type: "image", content: { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900", alt: "Equipo" } }
            ]
          }
        ]
      },
      {
        id: "pricing",
        title: "Precios",
        slug: "/pricing",
        status: "draft",
        updatedAt: "2026-03-02",
        sections: [
          {
            id: "pricing_1",
            type: "pricing",
            name: "Pricing",
            blocks: [
              { id: "pricing_card_1", type: "pricingCard", content: { plan: "Starter", price: "$19", details: "1 sitio + editor básico" } },
              { id: "pricing_card_2", type: "pricingCard", content: { plan: "Pro", price: "$49", details: "5 sitios + bloques avanzados" } },
              { id: "pricing_card_3", type: "pricingCard", content: { plan: "Scale", price: "$99", details: "sitios ilimitados + colaboración" } }
            ]
          }
        ]
      }
    ],
    media: [
      { id: "media_1", type: "image", name: "team.jpg", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900" },
      { id: "media_2", type: "image", name: "hero.jpg", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900" }
    ],
    settings: {
      branding: { logo: "NB", primaryColor: "#4655ff", accentColor: "#0f172a" },
      contact: { email: "hola@novabuilder.io", phone: "+34 600 123 456" },
      social: { linkedin: "https://linkedin.com", x: "https://x.com", instagram: "https://instagram.com" }
    },
    seo: {
      title: "NovaBuilder | Plataforma CMS visual",
      description: "Crea y administra páginas web con arquitectura modular y renderizado dinámico.",
      keywords: "cms,website builder,page builder,saas",
      ogImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200",
      robots: "index,follow",
      canonical: "https://novabuilder.io"
    }
  }
};

const sectionRegistry = {
  hero: { label: "Hero", description: "Encabezado principal y propuesta de valor." },
  about: { label: "About / Introducción", description: "Contexto y narrativa del proyecto." },
  services: { label: "Servicios", description: "Oferta principal de servicios o soluciones." },
  features: { label: "Features / Beneficios", description: "Beneficios y diferenciadores." },
  gallery: { label: "Galería", description: "Muestra visual de trabajos o producto." },
  testimonials: { label: "Testimonios", description: "Prueba social y confianza." },
  faq: { label: "FAQ", description: "Preguntas frecuentes para soporte." },
  cta: { label: "CTA final", description: "Sección de conversión con acción principal." },
  contact: { label: "Contacto", description: "Datos y formulario de contacto." },
  blogPreview: { label: "Blog preview", description: "Vista rápida de artículos recientes." },
  team: { label: "Equipo", description: "Presentación de integrantes y roles." },
  pricing: { label: "Pricing", description: "Planes y tarjetas de precios." },
  custom: { label: "Custom section", description: "Sección personalizada extensible." }
};

const blockRegistry = {
  heading: (content) => `<h3>${content.text || "Heading"}</h3>`,
  paragraph: (content) => `<p>${content.text || "Paragraph"}</p>`,
  button: (content) => `<a class="preview-btn" href="${content.href || "#"}">${content.text || "Button"}</a>`,
  image: (content) => `<img class="preview-image" src="${content.src || ""}" alt="${content.alt || "image"}" />`,
  iconText: (content) => `<div class="icon-text"><span>${content.icon || "•"}</span><p>${content.text || "Icon text"}</p></div>`,
  card: (content) => `<article class="mini-card"><h4>${content.title || "Card"}</h4><p>${content.description || "Descripción"}</p></article>`,
  testimonialItem: (content) => `<blockquote class="testimonial">“${content.quote || "Testimonio"}”<span>${content.author || "Cliente"}</span></blockquote>`,
  faqItem: (content) => `<details class="faq-item" open><summary>${content.question || "Pregunta"}</summary><p>${content.answer || "Respuesta"}</p></details>`,
  pricingCard: (content) => `<article class="pricing-card"><h4>${content.plan || "Plan"}</h4><p class="price">${content.price || "$0"}</p><p>${content.details || "Detalles"}</p></article>`,
  statItem: (content) => `<div class="stat-item"><p>${content.label || "Métrica"}</p><strong>${content.value || "0"}</strong></div>`,
  divider: () => `<hr class="preview-divider" />`,
  spacer: () => `<div class="preview-spacer"></div>`,
  form: (content) => `<form class="preview-form"><input placeholder="${content.placeholder || "Email"}" /><button type="button">${content.cta || "Enviar"}</button></form>`,
  galleryItem: (content) => `<figure class="gallery-item"><img src="${content.src || ""}" alt="${content.alt || "galería"}" /><figcaption>${content.caption || "Item"}</figcaption></figure>`
};

const els = {
  menu: document.getElementById("mainMenu"),
  siteStatusChip: document.getElementById("siteStatusChip"),
  pagesChip: document.getElementById("pagesChip"),
  tabs: {
    dashboard: document.getElementById("dashboardTab"),
    pages: document.getElementById("pagesTab"),
    builder: document.getElementById("builderTab"),
    library: document.getElementById("libraryTab"),
    settings: document.getElementById("settingsTab"),
    seo: document.getElementById("seoTab")
  }
};

bootstrap();

function bootstrap() {
  bindEvents();
  render();
}

function bindEvents() {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.tab = button.dataset.tab;
      render();
    });
  });
}

function render() {
  renderMenuState();
  renderTopbar();
  renderDashboard();
  renderPagesManager();
  renderBuilder();
  renderLibrary();
  renderSettings();
  renderSEO();
}

function renderMenuState() {
  [...els.menu.querySelectorAll(".menu-item")].forEach((item) => {
    item.classList.toggle("active", item.dataset.tab === state.tab);
  });

  Object.entries(els.tabs).forEach(([key, node]) => {
    node.classList.toggle("hidden", key !== state.tab);
  });
}

function renderTopbar() {
  els.siteStatusChip.textContent = state.data.site.status;
  els.pagesChip.textContent = `Páginas: ${state.data.pages.length}`;
}

function renderDashboard() {
  const totalBlocks = state.data.pages.reduce((sum, page) => sum + page.sections.reduce((acc, sec) => acc + sec.blocks.length, 0), 0);
  const publishedPages = state.data.pages.filter((p) => p.status === "published").length;
  const period = state.statsPeriod === "monthly" ? "monthly" : "weekly";

  const dashboardStats = {
    weekly: { visits: "180", uniqueUsers: "22", clicks: "219", avgVisitTime: "2min" },
    monthly: { visits: "760", uniqueUsers: "94", clicks: "903", avgVisitTime: "3.4min" }
  };

  const metrics = dashboardStats[period];

  els.tabs.dashboard.innerHTML = `
    <section class="dashboard-layout">
      <div class="dashboard-left">
        <article class="card hierarchy-card">
          <h3>Jerarquía</h3>
          <div class="hierarchy-flow">
            <span class="hierarchy-step">Site</span>
            <span class="hierarchy-arrow" aria-hidden="true">›</span>
            <span class="hierarchy-step">Pages</span>
            <span class="hierarchy-arrow" aria-hidden="true">›</span>
            <span class="hierarchy-step">Sections</span>
            <span class="hierarchy-arrow" aria-hidden="true">›</span>
            <span class="hierarchy-step">Blocks</span>
            <span class="hierarchy-arrow" aria-hidden="true">›</span>
            <span class="hierarchy-step">Publish</span>
          </div>
        </article>

        <div class="metrics-row">
          <article class="card metric-card"><p>Páginas</p><h3>${state.data.pages.length}</h3></article>
          <article class="card metric-card"><p>Publicadas</p><h3>${publishedPages}</h3></article>
          <article class="card metric-card"><p>Bloques</p><h3>${totalBlocks}</h3></article>
        </div>
      </div>

      <article class="stats-card">
        <div class="stats-head">
          <h3>Estadísticas</h3>
          <div class="stats-tabs" role="group" aria-label="Cambiar período de estadísticas">
            <button class="stats-tab ${period === "weekly" ? "active" : ""}" data-period="weekly" type="button">Semanal</button>
            <button class="stats-tab ${period === "monthly" ? "active" : ""}" data-period="monthly" type="button">Mensual</button>
          </div>
        </div>
        <div class="stats-grid">
          <article><p>Visitas</p><strong>${metrics.visits}</strong></article>
          <article><p>Usuarios únicos</p><strong class="small-value">${metrics.uniqueUsers}</strong></article>
          <article><p>Clicks</p><strong>${metrics.clicks}</strong></article>
          <article><p>Tiempo por visita</p><strong class="small-value">${metrics.avgVisitTime}</strong></article>
        </div>
      </article>
    </section>

    <h3 class="content-title">Contenido del sitio</h3>

    <section class="layout-2">
      <article class="card">
        <h3>Páginas recientes</h3>
        <ul class="stack-list">
          ${state.data.pages
            .slice()
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .map((page) => `<li><strong>${page.title}</strong><span>${page.slug}</span><span class="badge status-${page.status}">${page.status}</span></li>`)
            .join("")}
        </ul>
      </article>

      <article class="card">
        <h3>Secciones disponibles (${Object.keys(sectionRegistry).length})</h3>
        <ul class="stack-list">
          ${Object.entries(sectionRegistry)
            .map(([type, section]) => `<li><strong>${section.label}</strong><span>/${type}</span><span class="badge category-badge">${SECTION_CATEGORIES[type]}</span></li>`)
            .join("")}
        </ul>
      </article>
    </section>
  `;

  els.tabs.dashboard.querySelectorAll(".stats-tab").forEach((button) => {
    button.onclick = () => {
      const selectedPeriod = button.dataset.period;
      if (!selectedPeriod) return;

      state.statsPeriod = selectedPeriod;
      renderDashboard();
    };
  });
}

function renderPagesManager() {
  els.tabs.pages.innerHTML = `
    <article class="card">
      <div class="row between wrap">
        <div>
          <h3>Gestor de páginas</h3>
          <p class="muted">Crear, editar, organizar y publicar páginas desde un panel unificado.</p>
        </div>
        <button class="btn primary" id="createPageBtn">+ Nueva página</button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Slug</th>
              <th>Estado</th>
              <th>Secciones</th>
              <th>Actualizado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${state.data.pages
              .map(
                (page) => `
                <tr>
                  <td>${page.title}</td>
                  <td>${page.slug}</td>
                  <td><span class="badge status-${page.status}">${page.status}</span></td>
                  <td>${page.sections.length}</td>
                  <td>${page.updatedAt}</td>
                  <td class="action-row">
                    <button class="btn ghost small" data-action="edit-page" data-page-id="${page.id}">Editar</button>
                    <button class="btn ghost small" data-action="open-builder" data-page-id="${page.id}">Builder</button>
                    <button class="btn ghost small" data-action="change-status" data-page-id="${page.id}">Estado</button>
                  </td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </article>
  `;

  document.getElementById("createPageBtn").onclick = () => createPage();

  els.tabs.pages.querySelectorAll("button[data-action='open-builder']").forEach((button) => {
    button.onclick = () => {
      state.selectedPageId = button.dataset.pageId;
      state.tab = "builder";
      render();
    };
  });

  els.tabs.pages.querySelectorAll("button[data-action='edit-page']").forEach((button) => {
    button.onclick = () => {
      const page = getPage(button.dataset.pageId);
      if (!page) return;
      const title = window.prompt("Nuevo título de página", page.title);
      if (!title) return;
      page.title = title;
      page.slug = `/${slugify(title)}`;
      page.updatedAt = getToday();
      render();
    };
  });

  els.tabs.pages.querySelectorAll("button[data-action='change-status']").forEach((button) => {
    button.onclick = () => {
      const page = getPage(button.dataset.pageId);
      if (!page) return;
      const nextStatus = window.prompt(`Estado (${PAGE_STATUSES.join(", ")})`, page.status);
      if (!nextStatus || !PAGE_STATUSES.includes(nextStatus)) return;
      page.status = nextStatus;
      page.updatedAt = getToday();
      render();
    };
  });
}

function createPage() {
  const title = window.prompt("Título de la nueva página", "Nueva página");
  if (!title) return;
  state.data.pages.push({
    id: `page_${crypto.randomUUID().slice(0, 8)}`,
    title,
    slug: `/${slugify(title)}`,
    status: "draft",
    updatedAt: getToday(),
    sections: []
  });
  render();
}

function renderBuilder() {
  const page = getPage(state.selectedPageId) || state.data.pages[0];
  if (!page) return;
  state.selectedPageId = page.id;

  const section = page.sections.find((item) => item.id === state.selectedSectionId) || page.sections[0];
  state.selectedSectionId = section?.id || "";

  els.tabs.builder.innerHTML = `
    <div class="builder-grid">
      <article class="card">
        <div class="row between align-start wrap">
          <div>
            <h3>Constructor estructural</h3>
            <p class="muted">Página: <strong>${page.title}</strong> (${page.slug})</p>
            <p class="muted">Estado: <span class="badge status-${page.status}">${page.status}</span></p>
          </div>
          <select id="builderPageSelect">
            ${state.data.pages.map((item) => `<option value="${item.id}" ${item.id === page.id ? "selected" : ""}>${item.title}</option>`).join("")}
          </select>
        </div>

        <div class="actions">
          <button class="btn ghost small" id="publishPageBtn">Publicar página</button>
          <button class="btn ghost small" id="archivePageBtn">Archivar</button>
        </div>

        <div class="section-list">
          ${page.sections
            .map(
              (item, index) => `
                <div class="section-row ${item.id === section?.id ? "active" : ""}">
                  <button class="section-item" data-section-id="${item.id}">
                    <span>#${index + 1} ${item.name}</span>
                    <small>${item.type} · ${SECTION_CATEGORIES[item.type] || "sin categoría"}</small>
                  </button>
                  <div class="mini-actions">
                    <button class="btn ghost tiny" data-action="up" data-section-id="${item.id}">↑</button>
                    <button class="btn ghost tiny" data-action="down" data-section-id="${item.id}">↓</button>
                    <button class="btn ghost tiny" data-action="edit" data-section-id="${item.id}">✎</button>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
        <button class="btn ghost" id="addSectionBtn">+ Añadir sección</button>
      </article>

      <article class="card preview-card">
        <h3>Preview dinámico</h3>
        <div class="preview-canvas">${renderPagePreview(page)}</div>
      </article>

      <article class="card">
        <h3>Panel de configuración</h3>
        ${section ? renderSectionConfig(section) : `<p class="muted">Esta página aún no tiene secciones.</p>`}
      </article>
    </div>
  `;

  document.getElementById("builderPageSelect").onchange = (event) => {
    state.selectedPageId = event.target.value;
    state.selectedSectionId = "";
    render();
  };

  document.getElementById("addSectionBtn").onclick = () => addSection(page);
  document.getElementById("publishPageBtn").onclick = () => updatePageStatus(page, "published");
  document.getElementById("archivePageBtn").onclick = () => updatePageStatus(page, "archived");

  els.tabs.builder.querySelectorAll(".section-item").forEach((button) => {
    button.onclick = () => {
      state.selectedSectionId = button.dataset.sectionId;
      render();
    };
  });

  els.tabs.builder.querySelectorAll("button[data-action='up']").forEach((button) => {
    button.onclick = () => moveSection(page, button.dataset.sectionId, -1);
  });

  els.tabs.builder.querySelectorAll("button[data-action='down']").forEach((button) => {
    button.onclick = () => moveSection(page, button.dataset.sectionId, 1);
  });

  els.tabs.builder.querySelectorAll("button[data-action='edit']").forEach((button) => {
    button.onclick = () => editSectionTitle(page, button.dataset.sectionId);
  });

  els.tabs.builder.querySelectorAll("button[data-action='edit-block']").forEach((button) => {
    button.onclick = () => editBlockContent(page, section, button.dataset.blockId);
  });
}

function renderSectionConfig(section) {
  return `
    <p class="muted">Sección seleccionada: <strong>${section.name}</strong></p>
    <p class="muted">Tipo: ${section.type} · categoría: ${SECTION_CATEGORIES[section.type] || "sin categoría"}</p>
    <ul class="stack-list compact">
      ${section.blocks
        .map(
          (block) => `
          <li>
            <strong>${block.type}</strong>
            <span>${BLOCK_CATEGORIES[block.type] || "sin categoría"}</span>
            <button class="btn ghost tiny" data-action="edit-block" data-block-id="${block.id}">Editar contenido</button>
          </li>`
        )
        .join("")}
    </ul>
  `;
}

function addSection(page) {
  const type = window.prompt("Type de sección", "custom");
  if (!type) return;

  page.sections.push({
    id: `section_${crypto.randomUUID().slice(0, 8)}`,
    type,
    name: sectionRegistry[type]?.label || "Custom section",
    blocks: [{ id: `heading_${crypto.randomUUID().slice(0, 6)}`, type: "heading", content: { text: `Nueva sección ${type}` } }]
  });

  page.updatedAt = getToday();
  render();
}

function moveSection(page, sectionId, step) {
  const index = page.sections.findIndex((item) => item.id === sectionId);
  const targetIndex = index + step;
  if (index < 0 || targetIndex < 0 || targetIndex >= page.sections.length) return;
  [page.sections[index], page.sections[targetIndex]] = [page.sections[targetIndex], page.sections[index]];
  page.updatedAt = getToday();
  render();
}

function editSectionTitle(page, sectionId) {
  const section = page.sections.find((item) => item.id === sectionId);
  if (!section) return;
  const name = window.prompt("Nuevo nombre de sección", section.name);
  if (!name) return;
  section.name = name;
  page.updatedAt = getToday();
  render();
}

function editBlockContent(page, section, blockId) {
  const block = section?.blocks.find((item) => item.id === blockId);
  if (!block) return;
  const raw = window.prompt("Contenido JSON del bloque", JSON.stringify(block.content || {}, null, 2));
  if (!raw) return;
  try {
    block.content = JSON.parse(raw);
    page.updatedAt = getToday();
    render();
  } catch {
    window.alert("JSON inválido. No se aplicaron cambios.");
  }
}

function updatePageStatus(page, status) {
  page.status = status;
  page.updatedAt = getToday();
  render();
}

function renderPagePreview(page) {
  return page.sections
    .map((section) => {
      const sectionMeta = sectionRegistry[section.type] || { label: "Unknown", description: "No definido" };
      const blocks = section.blocks.map((block) => renderBlock(block)).join("");
      return `
        <section class="preview-section">
          <header>
            <p class="eyebrow">${sectionMeta.label}</p>
            <h4>${section.name}</h4>
            <p class="muted small">${sectionMeta.description}</p>
          </header>
          <div class="preview-blocks">${blocks}</div>
        </section>
      `;
    })
    .join("");
}

function renderBlock(block) {
  const renderer = blockRegistry[block.type];
  if (!renderer) {
    return `<article class="unknown-block">Bloque no soportado: ${block.type}</article>`;
  }
  return `<article class="preview-block" data-type="${block.type}">${renderer(block.content || {})}</article>`;
}

function renderLibrary() {
  els.tabs.library.innerHTML = `
    <div class="layout-2">
      <article class="card">
        <h3>Biblioteca de secciones</h3>
        <div class="catalog-grid">
          ${Object.entries(sectionRegistry)
            .map(
              ([type, info]) => `
              <article class="catalog-item">
                <h4>${info.label}</h4>
                <p>${info.description}</p>
                <span class="badge">${type}</span>
                <span class="badge subtle">${SECTION_CATEGORIES[type]}</span>
              </article>`
            )
            .join("")}
        </div>
      </article>

      <article class="card">
        <h3>Biblioteca de bloques</h3>
        <div class="catalog-grid">
          ${Object.keys(blockRegistry)
            .map(
              (type) => `
              <article class="catalog-item">
                <h4>${type}</h4>
                <p>Bloque reutilizable para múltiples secciones.</p>
                <span class="badge">${BLOCK_CATEGORIES[type]}</span>
              </article>`
            )
            .join("")}
        </div>
      </article>
    </div>
  `;
}

function renderSettings() {
  const { site, settings } = state.data;
  const apiModules = [
    {
      name: "Auth",
      description: "Gestiona el acceso al panel y la sesión activa del usuario.",
      endpoints: ["POST /api/auth/login", "POST /api/auth/logout", "GET /api/auth/me"]
    },
    {
      name: "Pages",
      description: "Permite crear, editar, publicar y organizar las páginas del sitio.",
      endpoints: ["GET /api/pages", "POST /api/pages", "PATCH /api/pages/:id"]
    },
    {
      name: "Sections",
      description: "Define la estructura interna de cada página mediante bloques ordenables.",
      endpoints: ["POST /api/pages/:id/sections", "PATCH /api/sections/:id", "DELETE /api/sections/:id"]
    },
    {
      name: "Blocks",
      description: "Controla las piezas modulares de contenido que forman cada sección.",
      endpoints: ["POST /api/sections/:id/blocks", "PATCH /api/blocks/:id", "PATCH /api/blocks/:id/toggle"]
    },
    {
      name: "Media",
      description: "Centraliza imágenes y archivos reutilizables del sistema.",
      endpoints: ["GET /api/media", "POST /api/media/upload", "DELETE /api/media/:id"]
    },
    {
      name: "Render / Preview",
      description: "Entrega el contenido publicado al frontend y permite revisar borradores antes de publicarlos.",
      endpoints: ["GET /api/render/page/:slug", "GET /api/preview/page/:slug"]
    }
  ];

  const apiExamples = [
    {
      title: "Inicio de sesión",
      endpoint: "POST /api/auth/login",
      request: `{
  "email": "admin@novabuilder.io",
  "password": "••••••••"
}`,
      response: `{
  "success": true,
  "data": { "token": "jwt_token", "role": "admin" },
  "error": null
}`
    },
    {
      title: "Listado de páginas",
      endpoint: "GET /api/pages",
      request: `Headers: Authorization: Bearer <token>`,
      response: `{
  "success": true,
  "data": [{ "id": "pg_home", "title": "Home", "status": "published" }],
  "error": null
}`
    },
    {
      title: "Render de página",
      endpoint: "GET /api/render/page/:slug",
      request: `GET /api/render/page/home`,
      response: `{
  "success": true,
  "data": { "slug": "home", "sections": [...] },
  "error": null
}`
    }
  ];

  const systemRules = [
    "Cada página debe tener un slug único.",
    "Solo una página puede estar marcada como homepage.",
    "Una página archivada no aparece en el frontend público.",
    "Sections y blocks se ordenan por order_index.",
    "Preview requiere permisos (admin o editor).",
    "Los bloques pueden activarse o desactivarse sin eliminarse."
  ];

  els.tabs.settings.innerHTML = `
    <article class="card">
      <h3>Settings del sitio</h3>
      <form id="settingsForm" class="form-grid">
        <label>Nombre del sitio<input name="siteName" value="${site.name}" /></label>
        <label>Logo / iniciales<input name="logo" value="${settings.branding.logo}" /></label>
        <label>Color primario<input name="primaryColor" value="${settings.branding.primaryColor}" /></label>
        <label>Color acento<input name="accentColor" value="${settings.branding.accentColor}" /></label>
        <label>Email de contacto<input name="email" value="${settings.contact.email}" /></label>
        <label>Teléfono<input name="phone" value="${settings.contact.phone}" /></label>
        <label>LinkedIn<input name="linkedin" value="${settings.social.linkedin}" /></label>
        <label>X<input name="x" value="${settings.social.x}" /></label>
        <label>Instagram<input name="instagram" value="${settings.social.instagram}" /></label>
        <button class="btn primary" type="submit">Guardar settings</button>
      </form>
    </article>

    <article class="card api-card">
      <div class="row between wrap align-start">
        <div>
          <p class="eyebrow">API interna del CMS</p>
          <h3>Arquitectura operativa, clara y fácil de seguir</h3>
          <p class="muted">Esta capa organiza cómo el CMS autentica usuarios, administra páginas, gestiona bloques y entrega contenido publicado o en preview.</p>
        </div>
        <div class="chip-row">
          <span class="chip">Roles: admin / editor / viewer</span>
          <span class="chip">Respuesta estándar: success / data / error</span>
        </div>
      </div>

      <div class="api-module-grid">
        ${apiModules
          .map(
            (module) => `
            <article class="api-module-item">
              <h4>${module.name}</h4>
              <p>${module.description}</p>
              <ul>
                ${module.endpoints.map((endpoint) => `<li><code>${endpoint}</code></li>`).join("")}
              </ul>
            </article>
          `
          )
          .join("")}
      </div>
    </article>

    <article class="card">
      <h3>Ejemplos clave de requests y responses</h3>
      <p class="muted">Solo los flujos más importantes para entender cómo se conecta el CMS con el frontend.</p>
      <div class="api-examples-grid">
        ${apiExamples
          .map(
            (example) => `
            <article class="api-example-item">
              <div class="row between wrap">
                <h4>${example.title}</h4>
                <span class="badge subtle">${example.endpoint}</span>
              </div>
              <p class="eyebrow">Request</p>
              <pre>${escapeHtml(example.request)}</pre>
              <p class="eyebrow">Response</p>
              <pre>${escapeHtml(example.response)}</pre>
            </article>
          `
          )
          .join("")}
      </div>
    </article>

    <article class="card">
      <h3>Reglas del sistema</h3>
      <p class="muted">Guía rápida para mantener una operación consistente entre contenido, permisos y publicación.</p>
      <ul class="system-rules-list">
        ${systemRules.map((rule) => `<li>${rule}</li>`).join("")}
      </ul>
    </article>
  `;

  document.getElementById("settingsForm").onsubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    state.data.site.name = String(form.get("siteName") || state.data.site.name);
    state.data.settings.branding.logo = String(form.get("logo") || "");
    state.data.settings.branding.primaryColor = String(form.get("primaryColor") || "");
    state.data.settings.branding.accentColor = String(form.get("accentColor") || "");
    state.data.settings.contact.email = String(form.get("email") || "");
    state.data.settings.contact.phone = String(form.get("phone") || "");
    state.data.settings.social.linkedin = String(form.get("linkedin") || "");
    state.data.settings.social.x = String(form.get("x") || "");
    state.data.settings.social.instagram = String(form.get("instagram") || "");
    render();
  };
}

function renderSEO() {
  const { seo } = state.data;
  els.tabs.seo.innerHTML = `
    <article class="card">
      <h3>SEO básico</h3>
      <form id="seoForm" class="form-grid">
        <label>Title<input name="title" value="${seo.title}" /></label>
        <button class="btn primary" type="submit">Guardar SEO</button>
      </form>
    </article>

    <article class="card">
      <h3>JSON estructural (preview)</h3>
      <pre class="json-view">${escapeHtml(JSON.stringify(state.data, null, 2))}</pre>
    </article>
  `;

  document.getElementById("seoForm").onsubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    state.data.seo.title = String(form.get("title") || "");
    state.data.seo.description = String(form.get("description") || "");
    state.data.seo.keywords = String(form.get("keywords") || "");
    state.data.seo.ogImage = String(form.get("ogImage") || "");
    state.data.seo.robots = String(form.get("robots") || "");
    state.data.seo.canonical = String(form.get("canonical") || "");
    render();
  };
}

function getPage(id) {
  return state.data.pages.find((page) => page.id === id);
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

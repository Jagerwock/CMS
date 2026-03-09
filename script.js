const APP_KEY = "dealtracker::session";
const USERS_KEY = "dealtracker::users";
const USER_DATA_KEY = (email) => `dealtracker::data::${email}`;

const initialDemo = {
  clients: [
    { id: crypto.randomUUID(), name: "Aurora Studio", company: "Aurora Studio", email: "hello@aurorastudio.io", phone: "+51 981 112 932", notes: "Monthly retainer client" },
    { id: crypto.randomUUID(), name: "Mateo Rivas", company: "Freelance Founder", email: "mateo@rivas.pe", phone: "+51 965 778 441", notes: "Needs fast iterations" }
  ],
  projects: [
    { id: crypto.randomUUID(), name: "Landing Page Redesign", clientId: "", total: 1200, startDate: "2026-02-02", dueDate: "2026-03-10", description: "Conversion-focused redesign", status: "In Progress" }
  ],
  payments: []
};
initialDemo.projects[0].clientId = initialDemo.clients[0].id;

const state = {
  mode: "guest",
  user: { name: "Guest Freelancer", email: null },
  data: structuredClone(initialDemo),
  pendingGuestData: null,
  tab: "dashboard"
};

const els = {
  authView: document.getElementById("authView"),
  appView: document.getElementById("appView"),
  toast: document.getElementById("toast"),
  guestBanner: document.getElementById("guestBanner"),
  accountChip: document.getElementById("accountChip"),
  authPortalBtn: document.getElementById("authPortalBtn"),
  signOutBtn: document.getElementById("signOutBtn")
};

init();

function init() {
  restoreSession();
  wireGlobalEvents();
  render();
}

function restoreSession() {
  const session = JSON.parse(localStorage.getItem(APP_KEY) || "null");
  if (!session) {
    persistSession();
    return;
  }
  state.mode = session.mode || "guest";
  state.user = session.user || { name: "Guest Freelancer", email: null };

  if (state.mode === "account" && state.user?.email) {
    state.data = JSON.parse(localStorage.getItem(USER_DATA_KEY(state.user.email)) || "null") || structuredClone(initialDemo);
    return;
  }

  state.mode = "guest";
  state.user = { name: "Guest Freelancer", email: null };
  state.data = structuredClone(initialDemo);
  persistSession();
}

function persistSession() {
  localStorage.setItem(APP_KEY, JSON.stringify({ mode: state.mode, user: state.user }));
  if (state.mode === "account" && state.user?.email) {
    localStorage.setItem(USER_DATA_KEY(state.user.email), JSON.stringify(state.data));
  }
}

function wireGlobalEvents() {
  els.authPortalBtn.addEventListener("click", () => {
    if (state.mode === "account") return;
    state.pendingGuestData = structuredClone(state.data);
    state.mode = null;
    render();
  });

  els.signOutBtn.addEventListener("click", () => {
    if (state.mode === "guest" && !confirm("You are in guest mode. If you leave now, your data will be lost. Continue?")) return;
    localStorage.removeItem(APP_KEY);
    state.mode = "guest";
    state.user = { name: "Guest Freelancer", email: null };
    state.data = structuredClone(initialDemo);
    state.pendingGuestData = null;
    persistSession();
    render();
  });

  window.addEventListener("beforeunload", (event) => {
    if (state.mode === "guest") {
      event.preventDefault();
      event.returnValue = "Your guest data won’t be saved.";
    }
  });
}

function render() {
  if (!state.mode) {
    renderAuth();
    return;
  }

  els.authView.classList.add("hidden");
  els.appView.classList.remove("hidden");

  els.accountChip.textContent = state.mode === "guest" ? "Guest Mode" : state.user.name;
  els.authPortalBtn.classList.toggle("hidden", state.mode === "account");
  els.signOutBtn.textContent = state.mode === "guest" ? "Exit guest" : "Sign out";

  renderGuestBanner();
  renderMenu();
  renderDashboard();
  renderClients();
  renderProjects();
  renderPayments();
  renderExports();
}

function renderAuth() {
  els.authView.classList.remove("hidden");
  els.appView.classList.add("hidden");
  els.authView.innerHTML = `
    <div class="auth-card">
      <aside class="auth-info">
        <p class="eyebrow">DealTracker</p>
        <h2>Keep your freelance progress safe</h2>
        <p>Create an account or sign in to save your clients, projects, and payments.</p>
        <ul>
          <li>Your guest version is already active by default.</li>
          <li>Login unlocks persistent data across sessions.</li>
          <li>You can still go back to guest mode instantly.</li>
        </ul>
      </aside>
      <div class="auth-form-wrap">
        <div class="auth-toggle">
          <button class="btn ghost" data-auth="signin">Sign in</button>
          <button class="btn ghost" data-auth="signup">Create account</button>
          <button class="btn primary" id="backToGuest">Back to guest app</button>
        </div>
        <form id="accountForm" class="card">
          <h3 id="authTitle">Sign in to your account</h3>
          <label>Full name<input name="name" placeholder="e.g. Valeria Torres" /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Password<input name="password" type="password" minlength="6" required /></label>
          <p class="muted" id="authHint">Use your account credentials to access saved data.</p>
          <div class="actions"><button class="btn primary" type="submit">Continue</button></div>
        </form>
      </div>
    </div>
  `;

  let authMode = "signin";
  const form = document.getElementById("accountForm");
  const title = document.getElementById("authTitle");
  const hint = document.getElementById("authHint");
  const nameInput = form.elements.name;
  nameInput.closest("label").classList.add("hidden");

  els.authView.querySelectorAll("[data-auth]").forEach((btn) => {
    btn.addEventListener("click", () => {
      authMode = btn.dataset.auth;
      const signUp = authMode === "signup";
      title.textContent = signUp ? "Create your DealTracker account" : "Sign in to your account";
      hint.textContent = signUp
        ? "Create an account to save your clients, projects, and payments."
        : "Use your account credentials to access saved data.";
      nameInput.closest("label").classList.toggle("hidden", !signUp);
    });
  });

  document.getElementById("backToGuest").addEventListener("click", () => {
    state.mode = "guest";
    state.user = { name: "Guest Freelancer", email: null };
    state.data = state.pendingGuestData ? structuredClone(state.pendingGuestData) : structuredClone(initialDemo);
    state.pendingGuestData = null;
    persistSession();
    render();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(form));
    if (!payload.email || !payload.password || (authMode === "signup" && !payload.name)) {
      notify("Please complete all required fields.");
      return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    if (authMode === "signup") {
      if (users.some((u) => u.email === payload.email)) {
        notify("An account with this email already exists.");
        return;
      }

      users.push({ name: payload.name, email: payload.email, password: payload.password });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      const seedData = state.pendingGuestData || structuredClone(initialDemo);
      localStorage.setItem(USER_DATA_KEY(payload.email), JSON.stringify(seedData));

      state.user = { name: payload.name, email: payload.email };
      state.mode = "account";
      state.data = seedData;
      state.pendingGuestData = null;
      persistSession();
      notify("Account created. Your workspace is ready.");
      render();
      return;
    }

    const account = users.find((u) => u.email === payload.email && u.password === payload.password);
    if (!account) {
      notify("Invalid email or password.");
      return;
    }

    state.mode = "account";
    state.user = { name: account.name, email: account.email };
    state.data = JSON.parse(localStorage.getItem(USER_DATA_KEY(account.email)) || "null") || structuredClone(initialDemo);
    state.pendingGuestData = null;
    persistSession();
    render();
  });
}

function renderMenu() {
  document.querySelectorAll(".menu-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === state.tab);
    btn.onclick = () => {
      state.tab = btn.dataset.tab;
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.add("hidden"));
      document.getElementById(`${state.tab}Tab`).classList.remove("hidden");
      render();
    };
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.add("hidden"));
  document.getElementById(`${state.tab}Tab`).classList.remove("hidden");
}

function renderGuestBanner() {
  if (state.mode !== "guest") {
    els.guestBanner.innerHTML = "";
    return;
  }

  els.guestBanner.innerHTML = `
    <div class="banner">
      <div>
        <strong>You’re currently using DealTracker in guest mode.</strong>
        <p class="muted">Your data won’t be saved unless you create an account. Create an account to save your clients, projects, and payments.</p>
      </div>
      <button id="saveWorkBtn" class="btn primary">Save your work</button>
    </div>`;

  document.getElementById("saveWorkBtn").onclick = () => {
    state.pendingGuestData = structuredClone(state.data);
    state.mode = null;
    render();
  };
}

function renderDashboard() {
  const monthIncome = getPaidThisMonth();
  const pending = getPendingAmount();
  const activeProjects = state.data.projects.filter((p) => paymentStatus(p.id) !== "Paid").length;
  const container = document.getElementById("dashboardTab");
  container.innerHTML = `
    <div class="grid-4">
      <article class="card metric"><p class="muted">Income this month</p><h3>${money(monthIncome)}</h3></article>
      <article class="card metric"><p class="muted">Pending amount</p><h3>${money(pending)}</h3></article>
      <article class="card metric"><p class="muted">Active projects</p><h3>${activeProjects}</h3></article>
      <article class="card metric"><p class="muted">Active clients</p><h3>${state.data.clients.length}</h3></article>
    </div>
    <div class="card">
      <h3>Recent projects</h3>
      ${state.data.projects.length ? `<div class="table-wrap"><table><thead><tr><th>Project</th><th>Client</th><th>Status</th><th>Paid / Total</th></tr></thead><tbody>
      ${state.data.projects.slice(-5).reverse().map((p) => `<tr><td>${p.name}</td><td>${clientName(p.clientId)}</td><td><span class="badge ${badgeClass(paymentStatus(p.id))}">${paymentStatus(p.id)}</span></td><td>${money(totalPaidByProject(p.id))} / ${money(Number(p.total))}</td></tr>`).join("")}
      </tbody></table></div>` : `<p class="muted">No projects yet. Create your first project to track income.</p>`}
    </div>
  `;
}

function renderClients() {
  const container = document.getElementById("clientsTab");
  container.innerHTML = `
    <div class="layout-2">
      <form id="clientForm" class="card">
        <h3>Add client</h3>
        <label>Name<input name="name" required /></label>
        <label>Company<input name="company" required /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Phone<input name="phone" required /></label>
        <label>Notes<textarea name="notes"></textarea></label>
        <button class="btn primary" type="submit">Save client</button>
      </form>
      <article class="card">
        <h3>Clients</h3>
        ${state.data.clients.length ? `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Phone</th></tr></thead><tbody>${state.data.clients.map((c) => `<tr><td>${c.name}</td><td>${c.company}</td><td>${c.email}</td><td>${c.phone}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">No clients yet. Create your first client to get started.</p>`}
      </article>
    </div>`;

  document.getElementById("clientForm").onsubmit = (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.target));
    state.data.clients.push({ ...payload, id: crypto.randomUUID() });
    afterMutation("Client saved.");
  };
}

function renderProjects() {
  const container = document.getElementById("projectsTab");
  const clientOptions = state.data.clients.map((c) => `<option value="${c.id}">${c.name} · ${c.company}</option>`).join("");

  container.innerHTML = `
    <div class="layout-2">
      <form id="projectForm" class="card">
        <h3>Create project</h3>
        <label>Project name<input name="name" required /></label>
        <label>Associated client<select name="clientId" required><option value="">Select a client</option>${clientOptions}</select></label>
        <label>Total price<input type="number" min="0" step="0.01" name="total" required /></label>
        <label>Start date<input type="date" name="startDate" required /></label>
        <label>Delivery date<input type="date" name="dueDate" required /></label>
        <label>Description<textarea name="description" required></textarea></label>
        <label>Status<select name="status"><option>In Progress</option><option>On Hold</option><option>Completed</option></select></label>
        <button class="btn primary" type="submit">Save project</button>
      </form>
      <article class="card">
        <h3>Projects</h3>
        ${state.data.projects.length ? `<div class="table-wrap"><table><thead><tr><th>Project</th><th>Client</th><th>Status</th><th>Total</th><th>Paid</th><th>Pending</th></tr></thead><tbody>${state.data.projects.map((p) => `<tr><td>${p.name}</td><td>${clientName(p.clientId)}</td><td>${p.status}</td><td>${money(Number(p.total))}</td><td>${money(totalPaidByProject(p.id))}</td><td>${money(Math.max(Number(p.total) - totalPaidByProject(p.id), 0))}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">No projects yet. Link projects to clients to track delivery and revenue.</p>`}
      </article>
    </div>`;

  document.getElementById("projectForm").onsubmit = (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.target));
    if (!payload.clientId) {
      notify("Please select a client before creating a project.");
      return;
    }
    state.data.projects.push({ ...payload, id: crypto.randomUUID(), total: Number(payload.total) });
    afterMutation("Project created successfully.");
  };
}

function renderPayments() {
  const container = document.getElementById("paymentsTab");
  const projects = state.data.projects.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
  container.innerHTML = `
    <div class="layout-2">
      <form id="paymentForm" class="card">
        <h3>Record payment</h3>
        <label>Project<select name="projectId" required><option value="">Select project</option>${projects}</select></label>
        <label>Amount<input name="amount" type="number" min="0" step="0.01" required /></label>
        <label>Date<input name="date" type="date" required /></label>
        <label>Payment method<select name="method"><option>Bank Transfer</option><option>PayPal</option><option>Yape</option><option>Stripe</option></select></label>
        <label>Reference<input name="reference" placeholder="TRX-2026-005" /></label>
        <label>Notes<textarea name="notes"></textarea></label>
        <button class="btn primary" type="submit">Save payment</button>
      </form>
      <article class="card">
        <h3>Payments history</h3>
        ${state.data.payments.length ? `<div class="table-wrap"><table><thead><tr><th>Project</th><th>Amount</th><th>Date</th><th>Method</th><th>Status</th></tr></thead><tbody>${state.data.payments.slice().reverse().map((p) => `<tr><td>${projectName(p.projectId)}</td><td>${money(Number(p.amount))}</td><td>${p.date}</td><td>${p.method}</td><td><span class="badge ${badgeClass(paymentStatus(p.projectId))}">${paymentStatus(p.projectId)}</span></td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">No payments yet. Record the first payment to track cash flow.</p>`}
      </article>
    </div>`;

  document.getElementById("paymentForm").onsubmit = (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.target));
    state.data.payments.push({ ...payload, id: crypto.randomUUID(), amount: Number(payload.amount) });
    afterMutation("Payment recorded successfully.");
  };
}

function renderExports() {
  const container = document.getElementById("exportsTab");
  container.innerHTML = `
    <article class="card">
      <h3>Export reports</h3>
      <p class="muted">Download your records as CSV files for accounting, reports, or backups.</p>
      <div class="actions">
        <button class="btn ghost" data-export="clients">Export clients</button>
        <button class="btn ghost" data-export="projects">Export projects</button>
        <button class="btn ghost" data-export="payments">Export payments</button>
      </div>
    </article>`;

  container.querySelectorAll("[data-export]").forEach((btn) => {
    btn.onclick = () => {
      const key = btn.dataset.export;
      exportCsv(key, state.data[key]);
      notify(`${key[0].toUpperCase() + key.slice(1)} exported.`);
    };
  });
}

function afterMutation(message) {
  persistSession();
  notify(message);
  render();
}

function totalPaidByProject(projectId) {
  return state.data.payments.filter((pay) => pay.projectId === projectId).reduce((acc, p) => acc + Number(p.amount), 0);
}

function paymentStatus(projectId) {
  const project = state.data.projects.find((p) => p.id === projectId);
  if (!project) return "Pending";
  const paid = totalPaidByProject(projectId);
  if (paid <= 0) return "Pending";
  if (paid < Number(project.total)) return "Partially Paid";
  return "Paid";
}

function badgeClass(status) {
  if (status === "Paid") return "paid";
  if (status === "Partially Paid") return "partial";
  return "pending";
}

function getPaidThisMonth() {
  const now = new Date();
  return state.data.payments.reduce((sum, pay) => {
    const d = new Date(pay.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() ? sum + Number(pay.amount) : sum;
  }, 0);
}

function getPendingAmount() {
  return state.data.projects.reduce((sum, p) => sum + Math.max(Number(p.total) - totalPaidByProject(p.id), 0), 0);
}

function clientName(id) {
  return state.data.clients.find((c) => c.id === id)?.name || "Unknown client";
}

function projectName(id) {
  return state.data.projects.find((p) => p.id === id)?.name || "Unknown project";
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
}

function notify(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 1600);
}

function exportCsv(fileName, rows) {
  if (!rows.length) {
    notify(`No ${fileName} to export yet.`);
    return;
  }
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => JSON.stringify(row[h] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}-report.csv`;
  link.click();
}

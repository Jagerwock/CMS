const STORAGE_KEYS = {
  session: "dealtracker::session",
  users: "dealtracker::users"
};

const userDataKey = (userId) => `dealtracker::user_data::${userId}`;

const state = {
  session: null,
  tab: "dashboard",
  authMode: "landing",
  authFormMode: "signin",
  editingClientId: null,
  data: createBlankWorkspace()
};

const els = {
  authView: document.getElementById("authView"),
  appView: document.getElementById("appView"),
  toast: document.getElementById("toast"),
  guestBanner: document.getElementById("guestBanner"),
  accountChip: document.getElementById("accountChip"),
  switchAccountBtn: document.getElementById("switchAccountBtn"),
  signOutBtn: document.getElementById("signOutBtn")
};

bootstrap();

function bootstrap() {
  hydrateSession();
  bindGlobalEvents();
  render();
}

function createBlankWorkspace() {
  return {
    users: [],
    clients: [],
    projects: [],
    payments: [],
    activityLogs: []
  };
}

function createGuestWorkspace() {
  const clientId = crypto.randomUUID();
  const projectId = crypto.randomUUID();
  return {
    users: [],
    clients: [
      {
        id: clientId,
        user_id: "guest",
        name: "Aurora Studio",
        email: "team@aurora.studio",
        phone: "+1 415 555 0147",
        company: "Aurora Studio"
      }
    ],
    projects: [
      {
        id: projectId,
        client_id: clientId,
        name: "Website Revamp",
        description: "Modern redesign focused on conversion and lead capture.",
        status: "activo",
        price: 3400,
        start_date: isoDate(-12),
        end_date: isoDate(18)
      }
    ],
    payments: [
      {
        id: crypto.randomUUID(),
        project_id: projectId,
        amount: 1200,
        status: "pagado",
        due_date: isoDate(-5),
        paid_date: isoDate(-3)
      }
    ],
    activityLogs: [
      {
        id: crypto.randomUUID(),
        user_id: "guest",
        action: "created project",
        created_at: new Date().toISOString()
      }
    ]
  };
}

function isoDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function hydrateSession() {
  const rawSession = localStorage.getItem(STORAGE_KEYS.session);
  if (!rawSession) {
    state.session = null;
    state.data = createGuestWorkspace();
    return;
  }

  const session = JSON.parse(rawSession);
  if (session.mode === "account" && session.user?.id) {
    const persistedData = JSON.parse(localStorage.getItem(userDataKey(session.user.id)) || "null");
    state.session = session;
    state.data = persistedData || createBlankWorkspace();
    return;
  }

  if (session.mode === "guest") {
    state.session = session;
    state.data = createGuestWorkspace();
    return;
  }

  state.session = null;
  state.data = createGuestWorkspace();
}

function bindGlobalEvents() {
  els.switchAccountBtn.addEventListener("click", () => {
    if (state.session?.mode === "account") return;
    state.authMode = "form";
    state.authFormMode = "signin";
    render();
  });

  els.signOutBtn.addEventListener("click", () => {
    if (!state.session) return;
    localStorage.removeItem(STORAGE_KEYS.session);
    state.session = null;
    state.authMode = "landing";
    state.data = createGuestWorkspace();
    render();
  });
}

function persistWorkspace() {
  if (state.session?.mode === "account") {
    localStorage.setItem(userDataKey(state.session.user.id), JSON.stringify(state.data));
  }
}

function persistSession() {
  if (state.session) {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(state.session));
  }
}

function render() {
  if (!state.session) {
    renderAuth();
    return;
  }

  els.authView.classList.add("hidden");
  els.appView.classList.remove("hidden");

  els.accountChip.textContent =
    state.session.mode === "guest" ? "Guest mode" : `${state.session.user.name}`;
  els.switchAccountBtn.classList.toggle("hidden", state.session.mode === "account");
  els.signOutBtn.textContent = state.session.mode === "guest" ? "Exit guest" : "Sign out";

  renderGuestBanner();
  renderMenu();
  renderDashboard();
  renderClients();
  renderProjects();
  renderPayments();
  renderReports();
}

function renderAuth() {
  els.authView.classList.remove("hidden");
  els.appView.classList.add("hidden");

  if (state.authMode === "landing") {
    els.authView.innerHTML = `
      <article class="auth-card auth-landing">
        <div class="auth-info">
          <p class="eyebrow">DealTracker</p>
          <h2>The freelance command center for your clients and revenue</h2>
          <p>Create clients, manage projects, register payments, and export clean reports in a single web dashboard.</p>
        </div>
        <div class="auth-actions">
          <button class="btn primary" id="continueGuest">Continue as guest</button>
          <button class="btn ghost" id="signInCta">Sign in</button>
          <button class="btn ghost" id="createAccountCta">Create account</button>
          <p class="muted">Your guest data won’t be saved. Create an account to keep your work safe.</p>
        </div>
      </article>
    `;

    document.getElementById("continueGuest").onclick = () => {
      state.session = {
        mode: "guest",
        user: {
          id: "guest",
          name: "Guest Freelancer",
          email: null,
          created_at: new Date().toISOString()
        }
      };
      state.data = createGuestWorkspace();
      persistSession();
      render();
    };

    document.getElementById("signInCta").onclick = () => {
      state.authMode = "form";
      state.authFormMode = "signin";
      renderAuth();
    };

    document.getElementById("createAccountCta").onclick = () => {
      state.authMode = "form";
      state.authFormMode = "signup";
      renderAuth();
    };

    return;
  }

  const signup = state.authFormMode === "signup";
  els.authView.innerHTML = `
    <article class="auth-card">
      <div class="auth-info">
        <p class="eyebrow">DealTracker</p>
        <h2>${signup ? "Create your account" : "Welcome back"}</h2>
        <p>${signup ? "Create an account to keep your work safe and available whenever you come back." : "Sign in to continue with your saved clients, projects, and payment history."}</p>
      </div>
      <form id="authForm" class="card auth-form">
        <h3>${signup ? "Create account" : "Sign in"}</h3>
        ${signup ? '<label>Full name<input name="name" required /></label>' : ""}
        <label>Email<input name="email" type="email" required /></label>
        <label>Password<input name="password" type="password" minlength="6" required /></label>
        <div class="actions">
          <button class="btn primary" type="submit">${signup ? "Create account" : "Sign in"}</button>
          <button class="btn ghost" type="button" id="backLanding">Back</button>
          <button class="btn ghost" type="button" id="switchMode">${signup ? "I already have an account" : "Need an account?"}</button>
        </div>
      </form>
    </article>
  `;

  document.getElementById("backLanding").onclick = () => {
    state.authMode = "landing";
    renderAuth();
  };

  document.getElementById("switchMode").onclick = () => {
    state.authFormMode = signup ? "signin" : "signup";
    renderAuth();
  };

  document.getElementById("authForm").onsubmit = (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.target));
    signup ? createAccount(payload) : signIn(payload);
  };
}

function createAccount(payload) {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || "[]");
  if (users.some((entry) => entry.email.toLowerCase() === payload.email.toLowerCase())) {
    notify("An account with this email already exists.");
    return;
  }

  const user = {
    id: crypto.randomUUID(),
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    password_hash: hashPassword(payload.password),
    created_at: new Date().toISOString()
  };

  users.push(user);
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));

  state.session = { mode: "account", user };
  state.data = createBlankWorkspace();
  persistSession();
  persistWorkspace();
  logActivity("created account");
  notify("Account created successfully.");
  render();
}

function signIn(payload) {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || "[]");
  const user = users.find(
    (entry) =>
      entry.email.toLowerCase() === payload.email.toLowerCase() &&
      entry.password_hash === hashPassword(payload.password)
  );

  if (!user) {
    notify("Invalid email or password.");
    return;
  }

  state.session = { mode: "account", user };
  state.data = JSON.parse(localStorage.getItem(userDataKey(user.id)) || "null") || createBlankWorkspace();
  persistSession();
  notify("Welcome back.");
  render();
}

function hashPassword(password) {
  return btoa(password);
}

function renderMenu() {
  document.querySelectorAll(".menu-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === state.tab);
    btn.onclick = () => {
      state.tab = btn.dataset.tab;
      render();
    };
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.add("hidden"));
  document.getElementById(`${state.tab}Tab`).classList.remove("hidden");
}

function renderGuestBanner() {
  if (state.session.mode !== "guest") {
    els.guestBanner.innerHTML = "";
    return;
  }

  els.guestBanner.innerHTML = `
    <article class="banner">
      <div>
        <strong>You’re browsing in guest mode.</strong>
        <p class="muted">Your guest data won’t be saved. Create an account to keep your work safe.</p>
      </div>
      <button class="btn primary" id="guestToAccount">Create account</button>
    </article>
  `;

  document.getElementById("guestToAccount").onclick = () => {
    state.session = null;
    state.authMode = "form";
    state.authFormMode = "signup";
    render();
  };
}

function renderDashboard() {
  const dashboard = document.getElementById("dashboardTab");
  const monthlyIncome = getIncomeForCurrentMonth();
  const activeProjects = state.data.projects.filter((item) => item.status === "activo").length;
  const pendingPayments = state.data.payments.filter((item) => computePaymentStatus(item) !== "pagado").length;
  const activeClients = getActiveClients().length;

  dashboard.innerHTML = `
    <section class="grid-4">
      <article class="card metric"><p class="muted">Monthly income</p><h3>${money(monthlyIncome)}</h3></article>
      <article class="card metric"><p class="muted">Active projects</p><h3>${activeProjects}</h3></article>
      <article class="card metric"><p class="muted">Pending payments</p><h3>${pendingPayments}</h3></article>
      <article class="card metric"><p class="muted">Active clients</p><h3>${activeClients}</h3></article>
    </section>

    <section class="layout-2">
      <article class="card">
        <h3>Revenue by client</h3>
        ${renderRevenueByClient()}
      </article>
      <article class="card">
        <h3>Recent activity</h3>
        ${renderActivity()}
      </article>
    </section>
  `;
}

function renderClients() {
  const clientsTab = document.getElementById("clientsTab");
  const editingClient = state.data.clients.find((item) => item.id === state.editingClientId);

  clientsTab.innerHTML = `
    <section class="layout-2">
      <form id="clientForm" class="card">
        <h3>${editingClient ? "Edit client" : "Create client"}</h3>
        <label>Name<input name="name" value="${editingClient?.name || ""}" required /></label>
        <label>Email<input name="email" type="email" value="${editingClient?.email || ""}" required /></label>
        <label>Phone<input name="phone" value="${editingClient?.phone || ""}" required /></label>
        <label>Company<input name="company" value="${editingClient?.company || ""}" required /></label>
        <div class="actions">
          <button class="btn primary" type="submit">${editingClient ? "Update client" : "Save client"}</button>
          ${editingClient ? '<button class="btn ghost" type="button" id="cancelEditClient">Cancel</button>' : ""}
        </div>
      </form>
      <article class="card">
        <h3>Clients</h3>
        ${state.data.clients.length ? `
          <div class="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th></th></tr></thead>
              <tbody>
                ${state.data.clients
                  .map(
                    (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.company}</td>
                      <td>${item.email}</td>
                      <td>${item.phone}</td>
                      <td><button class="btn ghost js-edit-client" data-client-id="${item.id}">Edit</button></td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        ` : '<p class="muted">No clients yet. Create your first client to get started.</p>'}
      </article>
    </section>
  `;

  document.getElementById("clientForm").onsubmit = (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.target));
    if (editingClient) {
      Object.assign(editingClient, payload);
      logActivity("updated client");
      state.editingClientId = null;
      commitMutation("Client updated successfully.");
      return;
    }

    state.data.clients.push({
      id: crypto.randomUUID(),
      user_id: state.session.user.id,
      ...payload
    });
    logActivity("created client");
    commitMutation("Client created successfully.");
  };

  if (editingClient) {
    document.getElementById("cancelEditClient").onclick = () => {
      state.editingClientId = null;
      renderClients();
    };
  }

  clientsTab.querySelectorAll(".js-edit-client").forEach((button) => {
    button.onclick = () => {
      state.editingClientId = button.dataset.clientId;
      renderClients();
    };
  });
}

function renderProjects() {
  const projectsTab = document.getElementById("projectsTab");
  const clientOptions = state.data.clients
    .map((client) => `<option value="${client.id}">${client.name} — ${client.company}</option>`)
    .join("");

  projectsTab.innerHTML = `
    <section class="layout-2">
      <form id="projectForm" class="card">
        <h3>Create project</h3>
        <label>Project name<input name="name" required /></label>
        <label>Client<select name="client_id" required><option value="">Select client</option>${clientOptions}</select></label>
        <label>Status<select name="status" required><option value="activo">activo</option><option value="completado">completado</option><option value="cancelado">cancelado</option></select></label>
        <label>Price<input name="price" type="number" min="0" step="0.01" required /></label>
        <label>Start date<input name="start_date" type="date" required /></label>
        <label>End date<input name="end_date" type="date" required /></label>
        <label>Description<textarea name="description" required></textarea></label>
        <button class="btn primary" type="submit">Save project</button>
      </form>
      <article class="card">
        <h3>Projects</h3>
        ${state.data.projects.length ? `
          <div class="table-wrap">
            <table>
              <thead><tr><th>Project</th><th>Client</th><th>Status</th><th>Price</th><th>Timeline</th><th>Balance</th></tr></thead>
              <tbody>
                ${state.data.projects
                  .map((project) => {
                    const paid = getProjectPaid(project.id);
                    const balance = Math.max(Number(project.price) - paid, 0);
                    return `
                      <tr>
                        <td>
                          <strong>${project.name}</strong>
                          <div class="muted">${project.description}</div>
                        </td>
                        <td>${clientName(project.client_id)}</td>
                        <td><span class="badge status-${project.status}">${project.status}</span></td>
                        <td>${money(project.price)}</td>
                        <td>${project.start_date} → ${project.end_date}</td>
                        <td>${money(balance)}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        ` : '<p class="muted">No projects yet. Create your first project after adding at least one client.</p>'}
      </article>
    </section>
  `;

  document.getElementById("projectForm").onsubmit = (event) => {
    event.preventDefault();
    if (!state.data.clients.length) {
      notify("Please create a client before creating a project.");
      return;
    }

    const payload = Object.fromEntries(new FormData(event.target));
    state.data.projects.push({
      id: crypto.randomUUID(),
      ...payload,
      price: Number(payload.price)
    });
    logActivity("created project");
    commitMutation("Project created successfully.");
  };
}

function renderPayments() {
  const paymentsTab = document.getElementById("paymentsTab");
  const projectOptions = state.data.projects
    .map((project) => `<option value="${project.id}">${project.name}</option>`)
    .join("");

  paymentsTab.innerHTML = `
    <section class="layout-2">
      <form id="paymentForm" class="card">
        <h3>Register payment</h3>
        <label>Project<select name="project_id" required><option value="">Select project</option>${projectOptions}</select></label>
        <label>Amount<input name="amount" type="number" min="0" step="0.01" required /></label>
        <label>Status<select name="status" required><option value="pendiente">pendiente</option><option value="pagado">pagado</option><option value="retrasado">retrasado</option></select></label>
        <label>Due date<input name="due_date" type="date" required /></label>
        <label>Paid date<input name="paid_date" type="date" /></label>
        <button class="btn primary" type="submit">Save payment</button>
      </form>
      <article class="card">
        <h3>Payment history</h3>
        ${state.data.payments.length ? `
          <div class="table-wrap">
            <table>
              <thead><tr><th>Project</th><th>Amount</th><th>Status</th><th>Due</th><th>Paid</th></tr></thead>
              <tbody>
                ${state.data.payments
                  .slice()
                  .reverse()
                  .map((payment) => {
                    const status = computePaymentStatus(payment);
                    return `
                      <tr>
                        <td>${projectName(payment.project_id)}</td>
                        <td>${money(payment.amount)}</td>
                        <td><span class="badge payment-${status}">${status}</span></td>
                        <td>${payment.due_date || "—"}</td>
                        <td>${payment.paid_date || "—"}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
          <p><strong>Total paid:</strong> ${money(getTotalPaid())} · <strong>Pending balance:</strong> ${money(getPendingBalance())}</p>
        ` : '<p class="muted">No payments yet. Register your first payment to track incoming cash.</p>'}
      </article>
    </section>
  `;

  document.getElementById("paymentForm").onsubmit = (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.target));
    state.data.payments.push({
      id: crypto.randomUUID(),
      ...payload,
      amount: Number(payload.amount)
    });
    logActivity("registered payment");
    commitMutation("Payment recorded successfully.");
  };
}

function renderReports() {
  const reportsTab = document.getElementById("reportsTab");
  reportsTab.innerHTML = `
    <article class="card">
      <h3>Export reports</h3>
      <p class="muted">Download your records in CSV format for accounting, backups, and external analysis.</p>
      <div class="actions">
        <button class="btn ghost" data-export="clients">Export clients</button>
        <button class="btn ghost" data-export="projects">Export projects</button>
        <button class="btn ghost" data-export="payments">Export payments</button>
      </div>
    </article>
  `;

  reportsTab.querySelectorAll("[data-export]").forEach((button) => {
    button.onclick = () => {
      const tableName = button.dataset.export;
      exportTable(tableName, state.data[tableName]);
    };
  });
}

function renderRevenueByClient() {
  if (!state.data.clients.length) {
    return '<p class="muted">No clients yet. Create your first client to start tracking revenue by client.</p>';
  }

  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Client</th><th>Paid revenue</th></tr></thead>
        <tbody>
          ${state.data.clients
            .map((client) => {
              const revenue = state.data.projects
                .filter((project) => project.client_id === client.id)
                .reduce((sum, project) => sum + getProjectPaid(project.id), 0);

              return `<tr><td>${client.name}</td><td>${money(revenue)}</td></tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderActivity() {
  if (!state.data.activityLogs.length) {
    return '<p class="muted">No activity yet. Start by adding a client or creating a project.</p>';
  }

  return `
    <ul class="activity-list">
      ${state.data.activityLogs
        .slice()
        .reverse()
        .slice(0, 8)
        .map(
          (log) =>
            `<li><strong>${log.action}</strong><span class="muted">${new Date(log.created_at).toLocaleString()}</span></li>`
        )
        .join("")}
    </ul>
  `;
}

function commitMutation(message) {
  persistWorkspace();
  notify(message);
  render();
}

function logActivity(action) {
  state.data.activityLogs.push({
    id: crypto.randomUUID(),
    user_id: state.session.user.id,
    action,
    created_at: new Date().toISOString()
  });
}

function computePaymentStatus(payment) {
  if (payment.status === "pagado") return "pagado";
  if (payment.paid_date) return "pagado";
  if (payment.due_date && new Date(payment.due_date) < new Date()) return "retrasado";
  return payment.status || "pendiente";
}

function clientName(clientId) {
  return state.data.clients.find((client) => client.id === clientId)?.name || "Unknown client";
}

function projectName(projectId) {
  return state.data.projects.find((project) => project.id === projectId)?.name || "Unknown project";
}

function getProjectPaid(projectId) {
  return state.data.payments
    .filter((payment) => payment.project_id === projectId && computePaymentStatus(payment) === "pagado")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
}

function getTotalPaid() {
  return state.data.payments
    .filter((payment) => computePaymentStatus(payment) === "pagado")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
}

function getPendingBalance() {
  return state.data.projects.reduce((sum, project) => {
    const pending = Math.max(Number(project.price) - getProjectPaid(project.id), 0);
    return sum + pending;
  }, 0);
}

function getIncomeForCurrentMonth() {
  const now = new Date();
  return state.data.payments
    .filter((payment) => computePaymentStatus(payment) === "pagado" && payment.paid_date)
    .filter((payment) => {
      const paidDate = new Date(payment.paid_date);
      return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
}

function getActiveClients() {
  const activeClientIds = new Set(state.data.projects.filter((project) => project.status === "activo").map((project) => project.client_id));
  return state.data.clients.filter((client) => activeClientIds.has(client.id));
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);
}

function notify(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function exportTable(tableName, rows) {
  if (!rows.length) {
    notify(`No ${tableName} to export.`);
    return;
  }

  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) => headers.map((key) => JSON.stringify(row[key] ?? "")).join(","));
  const csv = [headers.join(","), ...lines].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${tableName}-report.csv`;
  link.click();
  URL.revokeObjectURL(url);
  notify(`${tableName[0].toUpperCase() + tableName.slice(1)} exported successfully.`);
}

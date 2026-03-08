const STORAGE_KEY = "pulsefreelance-data-v1";

const state = {
  clients: [],
  projects: [],
  payments: [],
  filters: {
    clientId: "",
    projectStatus: "",
    paymentStatus: "",
    from: "",
    to: ""
  }
};

const els = {
  navButtons: document.querySelectorAll(".nav-btn"),
  panels: {
    dashboard: document.getElementById("dashboardPanel"),
    clientes: document.getElementById("clientesPanel"),
    proyectos: document.getElementById("proyectosPanel"),
    pagos: document.getElementById("pagosPanel"),
    exportacion: document.getElementById("exportacionPanel"),
    filtros: document.getElementById("filtrosPanel")
  },
  metricMonthIncome: document.getElementById("metricMonthIncome"),
  metricYearIncome: document.getElementById("metricYearIncome"),
  metricPendingPayments: document.getElementById("metricPendingPayments"),
  metricActiveProjects: document.getElementById("metricActiveProjects"),
  financialSummary: document.getElementById("financialSummary"),
  incomeChart: document.getElementById("incomeChart"),
  clientSearch: document.getElementById("clientSearch"),
  clientsTable: document.getElementById("clientsTable"),
  projectsTable: document.getElementById("projectsTable"),
  paymentsTable: document.getElementById("paymentsTable"),
  clientForm: document.getElementById("clientForm"),
  projectForm: document.getElementById("projectForm"),
  paymentForm: document.getElementById("paymentForm"),
  clientFormTitle: document.getElementById("clientFormTitle"),
  projectFormTitle: document.getElementById("projectFormTitle"),
  paymentFormTitle: document.getElementById("paymentFormTitle"),
  resetClientForm: document.getElementById("resetClientForm"),
  resetProjectForm: document.getElementById("resetProjectForm"),
  resetPaymentForm: document.getElementById("resetPaymentForm"),
  projectClientSelect: document.getElementById("projectClient"),
  paymentProjectSelect: document.getElementById("paymentProject"),
  globalFilterClient: document.getElementById("globalFilterClient"),
  globalFilterProjectStatus: document.getElementById("globalFilterProjectStatus"),
  globalFilterPaymentStatus: document.getElementById("globalFilterPaymentStatus"),
  globalFilterFrom: document.getElementById("globalFilterFrom"),
  globalFilterTo: document.getElementById("globalFilterTo"),
  clearFilters: document.getElementById("clearFilters"),
  exportButtons: document.querySelectorAll("[data-export]")
};

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("es-ES", { style: "currency", currency: "USD" });
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    seedInitialData();
    return;
  }

  const parsed = JSON.parse(raw);
  state.clients = parsed.clients || [];
  state.projects = parsed.projects || [];
  state.payments = parsed.payments || [];
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ clients: state.clients, projects: state.projects, payments: state.payments })
  );
}

function seedInitialData() {
  const clientA = { id: uid("cli"), nombre: "María Torres", empresa: "Studio Nova", email: "maria@studionova.com", telefono: "+34 611 223 998" };
  const clientB = { id: uid("cli"), nombre: "Carlos Peña", empresa: "Peña Digital", email: "carlos@penadigital.com", telefono: "+34 677 901 332" };
  state.clients = [clientA, clientB];

  const projectA = {
    id: uid("pro"),
    nombre: "Portal SaaS UX",
    descripcion: "Rediseño de flujo de onboarding",
    clientId: clientA.id,
    precioTotal: 5400,
    fechaInicio: "2026-01-05",
    fechaFinal: "2026-03-20",
    estado: "Activo"
  };
  const projectB = {
    id: uid("pro"),
    nombre: "Landing Fintech",
    descripcion: "Construcción web y sistema de lead capture",
    clientId: clientB.id,
    precioTotal: 3200,
    fechaInicio: "2026-02-01",
    fechaFinal: "2026-02-28",
    estado: "Completado"
  };
  state.projects = [projectA, projectB];

  state.payments = [
    { id: uid("pay"), projectId: projectA.id, amount: 2400, dueDate: "2026-03-04", status: "Pendiente", paidDate: "" },
    { id: uid("pay"), projectId: projectB.id, amount: 3200, dueDate: "2026-02-28", status: "Pagado", paidDate: "2026-02-27" }
  ];

  saveState();
}

function switchPanel(route) {
  Object.entries(els.panels).forEach(([key, panel]) => {
    panel.classList.toggle("is-visible", key === route);
  });
  els.navButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.route === route));
}

function getClientById(id) {
  return state.clients.find((item) => item.id === id);
}

function getProjectById(id) {
  return state.projects.find((item) => item.id === id);
}

function inferPaymentStatus(payment) {
  if (payment.status === "Pagado") {
    return "Pagado";
  }
  const today = new Date().toISOString().slice(0, 10);
  if (payment.dueDate < today) {
    return "Retrasado";
  }
  return "Pendiente";
}

function matchesDateRange(dateValue, from, to) {
  if (!dateValue) {
    return false;
  }
  if (from && dateValue < from) {
    return false;
  }
  if (to && dateValue > to) {
    return false;
  }
  return true;
}

function getFilteredProjects() {
  return state.projects.filter((project) => {
    const { clientId, projectStatus, from, to } = state.filters;
    const byClient = !clientId || project.clientId === clientId;
    const byStatus = !projectStatus || project.estado === projectStatus;
    const byDate = (!from && !to) || matchesDateRange(project.fechaInicio, from, to);
    return byClient && byStatus && byDate;
  });
}

function getFilteredPayments() {
  return state.payments.filter((payment) => {
    const project = getProjectById(payment.projectId);
    const computedStatus = inferPaymentStatus(payment);
    const { clientId, paymentStatus, from, to } = state.filters;
    const byClient = !clientId || (project && project.clientId === clientId);
    const byStatus = !paymentStatus || computedStatus === paymentStatus;
    const byDate = (!from && !to) || matchesDateRange(payment.dueDate, from, to);
    return byClient && byStatus && byDate;
  });
}

function renderClientOptions() {
  const options = state.clients
    .map((client) => `<option value="${client.id}">${client.nombre} · ${client.empresa}</option>`)
    .join("");

  els.projectClientSelect.innerHTML = `<option value="">Selecciona cliente</option>${options}`;
  els.globalFilterClient.innerHTML = `<option value="">Todos</option>${options}`;
  els.globalFilterClient.value = state.filters.clientId;
}

function renderProjectOptions() {
  const options = state.projects
    .map((project) => `<option value="${project.id}">${project.nombre}</option>`)
    .join("");
  els.paymentProjectSelect.innerHTML = `<option value="">Selecciona proyecto</option>${options}`;
}

function renderClientsTable() {
  const term = (els.clientSearch.value || "").toLowerCase().trim();
  const rows = state.clients
    .filter((client) => {
      if (!term) {
        return true;
      }
      return [client.nombre, client.empresa, client.email, client.telefono]
        .join(" ")
        .toLowerCase()
        .includes(term);
    })
    .map(
      (client) => `
      <tr>
        <td>${client.nombre}</td>
        <td>${client.empresa}</td>
        <td>${client.email}</td>
        <td>${client.telefono}</td>
        <td>
          <button class="btn-ghost" data-action="edit-client" data-id="${client.id}">Editar</button>
          <button class="btn-ghost" data-action="delete-client" data-id="${client.id}">Eliminar</button>
        </td>
      </tr>
    `
    )
    .join("");

  els.clientsTable.innerHTML = rows || `<tr><td colspan="5">No hay clientes para mostrar.</td></tr>`;
}

function renderProjectsTable() {
  const rows = getFilteredProjects()
    .map((project) => {
      const client = getClientById(project.clientId);
      return `
      <tr>
        <td>${project.nombre}<br /><small>${project.descripcion}</small></td>
        <td>${client ? client.nombre : "Cliente eliminado"}</td>
        <td><span class="badge ${project.estado === "Activo" ? "pendiente" : "pagado"}">${project.estado}</span></td>
        <td>${formatCurrency(project.precioTotal)}</td>
        <td>${project.fechaInicio} → ${project.fechaFinal}</td>
        <td>
          <button class="btn-ghost" data-action="edit-project" data-id="${project.id}">Editar</button>
          <button class="btn-ghost" data-action="delete-project" data-id="${project.id}">Eliminar</button>
        </td>
      </tr>
      `;
    })
    .join("");

  els.projectsTable.innerHTML = rows || `<tr><td colspan="6">No hay proyectos con los filtros actuales.</td></tr>`;
}

function renderPaymentsTable() {
  const rows = getFilteredPayments()
    .map((payment) => {
      const project = getProjectById(payment.projectId);
      const computedStatus = inferPaymentStatus(payment);
      return `
      <tr>
        <td>${project ? project.nombre : "Proyecto eliminado"}</td>
        <td>${formatCurrency(payment.amount)}</td>
        <td>${payment.dueDate}</td>
        <td><span class="badge ${computedStatus.toLowerCase()}">${computedStatus}</span></td>
        <td>
          <button class="btn-ghost" data-action="edit-payment" data-id="${payment.id}">Editar</button>
          <button class="btn-ghost" data-action="toggle-paid" data-id="${payment.id}">${payment.status === "Pagado" ? "Marcar pendiente" : "Marcar pagado"}</button>
          <button class="btn-ghost" data-action="delete-payment" data-id="${payment.id}">Eliminar</button>
        </td>
      </tr>
      `;
    })
    .join("");

  els.paymentsTable.innerHTML = rows || `<tr><td colspan="5">No hay pagos para mostrar.</td></tr>`;
}

function renderDashboard() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const paidPayments = state.payments.filter((payment) => inferPaymentStatus(payment) === "Pagado");

  const monthIncome = paidPayments
    .filter((payment) => {
      const date = new Date(payment.paidDate || payment.dueDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  const yearIncome = paidPayments
    .filter((payment) => new Date(payment.paidDate || payment.dueDate).getFullYear() === currentYear)
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  const pendingCount = state.payments.filter((payment) => inferPaymentStatus(payment) !== "Pagado").length;
  const activeProjects = state.projects.filter((project) => project.estado === "Activo").length;

  els.metricMonthIncome.textContent = formatCurrency(monthIncome);
  els.metricYearIncome.textContent = formatCurrency(yearIncome);
  els.metricPendingPayments.textContent = String(pendingCount);
  els.metricActiveProjects.textContent = String(activeProjects);

  const monthlyTotals = Array.from({ length: 12 }, (_, monthIndex) => {
    return paidPayments
      .filter((payment) => {
        const date = new Date(payment.paidDate || payment.dueDate);
        return date.getFullYear() === currentYear && date.getMonth() === monthIndex;
      })
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
  });

  const max = Math.max(...monthlyTotals, 1);
  els.incomeChart.innerHTML = monthlyTotals
    .map((value, idx) => {
      const ratio = Math.max((value / max) * 100, 2);
      const label = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][idx];
      return `<div class="bar-item" style="height:${ratio}%"><span>${label}</span></div>`;
    })
    .join("");

  const completedProjects = state.projects.filter((project) => project.estado === "Completado").length;
  els.financialSummary.innerHTML = `
    <li>Total clientes registrados: <strong>${state.clients.length}</strong></li>
    <li>Proyectos activos: <strong>${activeProjects}</strong> · completados: <strong>${completedProjects}</strong></li>
    <li>Pagos pendientes + retrasados: <strong>${pendingCount}</strong></li>
    <li>Flujo cobrado anual: <strong>${formatCurrency(yearIncome)}</strong></li>
  `;
}

function renderAll() {
  renderClientOptions();
  renderProjectOptions();
  renderClientsTable();
  renderProjectsTable();
  renderPaymentsTable();
  renderDashboard();
  saveState();
}

function resetClientForm() {
  els.clientForm.reset();
  document.getElementById("clientId").value = "";
  els.clientFormTitle.textContent = "Crear cliente";
}

function resetProjectForm() {
  els.projectForm.reset();
  document.getElementById("projectId").value = "";
  els.projectFormTitle.textContent = "Crear proyecto";
}

function resetPaymentForm() {
  els.paymentForm.reset();
  document.getElementById("paymentId").value = "";
  els.paymentFormTitle.textContent = "Registrar pago";
}

function handleClientSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("clientId").value;
  const payload = {
    id: id || uid("cli"),
    nombre: document.getElementById("clientName").value.trim(),
    empresa: document.getElementById("clientCompany").value.trim(),
    email: document.getElementById("clientEmail").value.trim(),
    telefono: document.getElementById("clientPhone").value.trim()
  };

  if (id) {
    state.clients = state.clients.map((client) => (client.id === id ? payload : client));
  } else {
    state.clients.push(payload);
  }

  resetClientForm();
  renderAll();
}

function handleProjectSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("projectId").value;
  const payload = {
    id: id || uid("pro"),
    nombre: document.getElementById("projectName").value.trim(),
    descripcion: document.getElementById("projectDescription").value.trim(),
    clientId: document.getElementById("projectClient").value,
    precioTotal: Number(document.getElementById("projectTotal").value),
    fechaInicio: document.getElementById("projectStart").value,
    fechaFinal: document.getElementById("projectEnd").value,
    estado: document.getElementById("projectStatus").value
  };

  if (payload.fechaFinal < payload.fechaInicio) {
    alert("La fecha final del proyecto no puede ser anterior a la fecha de inicio.");
    return;
  }

  if (id) {
    state.projects = state.projects.map((project) => (project.id === id ? payload : project));
  } else {
    state.projects.push(payload);
  }

  resetProjectForm();
  renderAll();
}

function handlePaymentSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("paymentId").value;
  const status = document.getElementById("paymentStatus").value;
  const payload = {
    id: id || uid("pay"),
    projectId: document.getElementById("paymentProject").value,
    amount: Number(document.getElementById("paymentAmount").value),
    dueDate: document.getElementById("paymentDueDate").value,
    status,
    paidDate: status === "Pagado" ? new Date().toISOString().slice(0, 10) : ""
  };

  if (id) {
    state.payments = state.payments.map((payment) => (payment.id === id ? payload : payment));
  } else {
    state.payments.push(payload);
  }

  resetPaymentForm();
  renderAll();
}

function handleTableActions(event) {
  const target = event.target.closest("button[data-action]");
  if (!target) {
    return;
  }

  const { action, id } = target.dataset;

  if (action === "edit-client") {
    const client = getClientById(id);
    if (!client) return;
    document.getElementById("clientId").value = client.id;
    document.getElementById("clientName").value = client.nombre;
    document.getElementById("clientCompany").value = client.empresa;
    document.getElementById("clientEmail").value = client.email;
    document.getElementById("clientPhone").value = client.telefono;
    els.clientFormTitle.textContent = "Editar cliente";
    switchPanel("clientes");
  }

  if (action === "delete-client") {
    state.clients = state.clients.filter((item) => item.id !== id);
    state.projects = state.projects.filter((project) => project.clientId !== id);
    const projectIds = new Set(state.projects.map((project) => project.id));
    state.payments = state.payments.filter((payment) => projectIds.has(payment.projectId));
    renderAll();
  }

  if (action === "edit-project") {
    const project = getProjectById(id);
    if (!project) return;
    document.getElementById("projectId").value = project.id;
    document.getElementById("projectName").value = project.nombre;
    document.getElementById("projectDescription").value = project.descripcion;
    document.getElementById("projectClient").value = project.clientId;
    document.getElementById("projectTotal").value = project.precioTotal;
    document.getElementById("projectStart").value = project.fechaInicio;
    document.getElementById("projectEnd").value = project.fechaFinal;
    document.getElementById("projectStatus").value = project.estado;
    els.projectFormTitle.textContent = "Editar proyecto";
    switchPanel("proyectos");
  }

  if (action === "delete-project") {
    state.projects = state.projects.filter((item) => item.id !== id);
    state.payments = state.payments.filter((payment) => payment.projectId !== id);
    renderAll();
  }

  if (action === "edit-payment") {
    const payment = state.payments.find((item) => item.id === id);
    if (!payment) return;
    document.getElementById("paymentId").value = payment.id;
    document.getElementById("paymentProject").value = payment.projectId;
    document.getElementById("paymentAmount").value = payment.amount;
    document.getElementById("paymentDueDate").value = payment.dueDate;
    document.getElementById("paymentStatus").value = payment.status;
    els.paymentFormTitle.textContent = "Editar pago";
    switchPanel("pagos");
  }

  if (action === "toggle-paid") {
    state.payments = state.payments.map((payment) => {
      if (payment.id !== id) {
        return payment;
      }
      const paid = payment.status === "Pagado";
      return {
        ...payment,
        status: paid ? "Pendiente" : "Pagado",
        paidDate: paid ? "" : new Date().toISOString().slice(0, 10)
      };
    });
    renderAll();
  }

  if (action === "delete-payment") {
    state.payments = state.payments.filter((item) => item.id !== id);
    renderAll();
  }
}

function setupFilters() {
  const syncFilters = () => {
    state.filters.clientId = els.globalFilterClient.value;
    state.filters.projectStatus = els.globalFilterProjectStatus.value;
    state.filters.paymentStatus = els.globalFilterPaymentStatus.value;
    state.filters.from = els.globalFilterFrom.value;
    state.filters.to = els.globalFilterTo.value;
    renderProjectsTable();
    renderPaymentsTable();
  };

  [
    els.globalFilterClient,
    els.globalFilterProjectStatus,
    els.globalFilterPaymentStatus,
    els.globalFilterFrom,
    els.globalFilterTo
  ].forEach((input) => input.addEventListener("change", syncFilters));

  els.clearFilters.addEventListener("click", () => {
    state.filters = { clientId: "", projectStatus: "", paymentStatus: "", from: "", to: "" };
    els.globalFilterClient.value = "";
    els.globalFilterProjectStatus.value = "";
    els.globalFilterPaymentStatus.value = "";
    els.globalFilterFrom.value = "";
    els.globalFilterTo.value = "";
    renderProjectsTable();
    renderPaymentsTable();
  });
}

function exportCsv(type) {
  const headersByType = {
    clients: ["nombre", "empresa", "email", "telefono"],
    projects: ["nombre", "descripcion", "clientId", "precioTotal", "fechaInicio", "fechaFinal", "estado"],
    payments: ["projectId", "amount", "dueDate", "status", "paidDate"]
  };

  const sourceByType = {
    clients: state.clients,
    projects: state.projects,
    payments: state.payments.map((payment) => ({ ...payment, status: inferPaymentStatus(payment) }))
  };

  const headers = headersByType[type];
  const rows = sourceByType[type];
  const csv = [headers.join(",")]
    .concat(
      rows.map((row) => headers.map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`).join(","))
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${type}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function setupEvents() {
  els.navButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchPanel(btn.dataset.route));
  });

  els.clientForm.addEventListener("submit", handleClientSubmit);
  els.projectForm.addEventListener("submit", handleProjectSubmit);
  els.paymentForm.addEventListener("submit", handlePaymentSubmit);

  els.resetClientForm.addEventListener("click", resetClientForm);
  els.resetProjectForm.addEventListener("click", resetProjectForm);
  els.resetPaymentForm.addEventListener("click", resetPaymentForm);

  els.clientSearch.addEventListener("input", renderClientsTable);

  document.addEventListener("click", handleTableActions);

  els.exportButtons.forEach((button) => {
    button.addEventListener("click", () => exportCsv(button.dataset.export));
  });

  setupFilters();
}

loadState();
setupEvents();
renderAll();
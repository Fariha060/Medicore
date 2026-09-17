/**
 * MEDICORE ROUTER AND DASHBOARD CONTROLLER
 */

function router(view) {
  const viewport = document.getElementById("app-viewport");
  
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const activeNav = document.getElementById(`nav-${view}`);
  if (activeNav) activeNav.classList.add('active');

  const titleEl = document.getElementById("page-title");

  switch (view) {
    case 'overview':
      if (titleEl) titleEl.innerText = "Admin Command Center";
      viewport.innerHTML = renderOverviewUI();
      initCharts();
      break;
    case 'patients':
      if (titleEl) titleEl.innerText = "Patient Directory (EHR)";
      viewport.innerHTML = renderPatientsUI();
      break;
    case 'doctors':
      if (titleEl) titleEl.innerText = "Medical Staff & Duty Roster";
      viewport.innerHTML = renderDoctorsUI();
      break;
    case 'appointments':
      if (titleEl) titleEl.innerText = "OPD Live Queue & Appointments";
      viewport.innerHTML = renderAppointmentsUI();
      break;
    case 'billing':
      if (titleEl) titleEl.innerText = "Billing POS & Revenue Counter";
      viewport.innerHTML = renderBillingUI();
      break;
    case 'pharmacy':
      if (titleEl) titleEl.innerText = "Pharmacy Stock & Inventory";
      viewport.innerHTML = renderPharmacyUI();
      break;
    case 'beds':
      if (titleEl) titleEl.innerText = "Emergency Ward & Bed Allocation";
      viewport.innerHTML = renderBedsUI();
      break;
    case 'diagnostics':
      if (titleEl) titleEl.innerText = "Lab Testing & Diagnostics";
      viewport.innerHTML = renderDiagnosticsUI();
      break;
    default:
      if (titleEl) titleEl.innerText = "Admin Command Center";
      viewport.innerHTML = renderOverviewUI();
      initCharts();
  }
  
  if (window.lucide) lucide.createIcons();
}

// --- 1. ADMIN OVERVIEW VIEW ---
function renderOverviewUI() {
  const totalRevenue = store.state.invoices.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const criticalPatients = store.state.patients.filter(p => p.status === 'Critical').length;

  return `
    <!-- Top Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Inpatients</span>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${store.state.patients.length}</h2>
        <p class="text-[11px] text-rose-500 font-semibold mt-1">${criticalPatients} Critical Ward Cases</p>
      </div>
      <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Active Duty Doctors</span>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${store.state.doctors.length}</h2>
        <p class="text-[11px] text-emerald-600 font-semibold mt-1">Full Shift Coverage</p>
      </div>
      <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Billing Revenue</span>
        <h2 class="text-2xl font-extrabold text-emerald-600 mt-1">$${totalRevenue.toLocaleString()}</h2>
        <p class="text-[11px] text-slate-500 mt-1">${store.state.invoices.length} Settled Transactions</p>
      </div>
      <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">System Load</span>
        <h2 class="text-2xl font-extrabold text-medicore-600 mt-1">99.8% Optimal</h2>
        <p class="text-[11px] text-slate-500 mt-1">Latency: 14ms</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-80">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-2">Hospital Operational Analytics</h3>
        <div class="h-64"><canvas id="overviewChart"></canvas></div>
      </div>

      <!-- Admin System Audit Trail -->
      <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-3">Admin Audit Trail Log</h3>
          <div class="space-y-3 overflow-y-auto max-h-56 pr-1">
            ${store.state.logs.map(log => `
              <div class="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-2 text-xs">
                <div>
                  <p class="font-semibold text-slate-800 dark:text-slate-200">${log.action}</p>
                  <span class="text-[10px] text-slate-400">By: ${log.user}</span>
                </div>
                <span class="font-mono text-[10px] text-medicore-600 font-bold">${log.time}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- 2. PATIENTS DIRECTORY ---
function renderPatientsUI() {
  return `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="font-bold text-base text-slate-900 dark:text-white">Inpatient Records (EHR)</h2>
        <p class="text-xs text-slate-500">Live admission data and clinical tracking</p>
      </div>
      <button onclick="UIController.openModal('modal-patient')" class="bg-medicore-600 hover:bg-medicore-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
        <i data-lucide="user-plus" class="w-4 h-4"></i> Admit Patient
      </button>
    </div>
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b dark:border-slate-800">
          <tr>
            <th class="p-3">MRN ID</th>
            <th class="p-3">Patient Name</th>
            <th class="p-3">Age / Gender</th>
            <th class="p-3">Department</th>
            <th class="p-3">Status</th>
            <th class="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 dark:text-slate-200">
          ${store.state.patients.map(p => `
            <tr>
              <td class="p-3 font-mono font-bold text-slate-400">${p.id}</td>
              <td class="p-3 font-bold text-slate-900 dark:text-white">${p.name}</td>
              <td class="p-3">${p.age} Y / ${p.gender}</td>
              <td class="p-3">${p.dept}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'Critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}">
                  ${p.status}
                </span>
              </td>
              <td class="p-3 text-right">
                <button onclick="PatientController.delete('${p.id}')" class="text-xs text-rose-600 hover:text-rose-800 font-bold">Discharge</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// --- 3. MEDICAL STAFF ---
function renderDoctorsUI() {
  return `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="font-bold text-base text-slate-900 dark:text-white">Medical Roster</h2>
        <p class="text-xs text-slate-500">Physicians, consultants, and duty schedules</p>
      </div>
      <button onclick="UIController.openModal('modal-doctor')" class="bg-medicore-600 hover:bg-medicore-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
        <i data-lucide="plus" class="w-4 h-4"></i> Add Doctor
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      ${store.state.doctors.map(d => `
        <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">${d.name}</h3>
              <p class="text-xs text-slate-500">${d.spec}</p>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${d.status === 'On Duty' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}">
              ${d.status}
            </span>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
            <span>Clinic: <b>${d.room}</b></span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// --- 4. BILLING & POS INVOICING ---
function renderBillingUI() {
  return `
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="font-bold text-slate-900 dark:text-white">Patient Billing & Counter Cash POS</h2>
        <p class="text-xs text-slate-500">Live fee collection and automated receipts</p>
      </div>
      <button onclick="UIController.openModal('modal-billing')" class="bg-medicore-600 hover:bg-medicore-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5">
        <i data-lucide="receipt" class="w-4 h-4"></i> Create Invoice
      </button>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b dark:border-slate-800">
          <tr>
            <th class="p-3">Invoice #</th>
            <th class="p-3">Patient Name</th>
            <th class="p-3">Category</th>
            <th class="p-3">Amount ($)</th>
            <th class="p-3">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 dark:text-slate-200">
          ${store.state.invoices.map(inv => `
            <tr>
              <td class="p-3 font-mono font-bold text-slate-400">${inv.id}</td>
              <td class="p-3 font-bold text-slate-900 dark:text-white">${inv.patient}</td>
              <td class="p-3">${inv.dept}</td>
              <td class="p-3 font-bold text-medicore-600">$${inv.amount}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}">
                  ${inv.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// --- 5. PHARMACY STOCK MANAGER ---
function renderPharmacyUI() {
  return `
    <div class="mb-4">
      <h2 class="font-bold text-slate-900 dark:text-white">Pharmacy Stock & Inventory</h2>
      <p class="text-xs text-slate-500">Pharmaceutical inventory tracking and restock controls</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      ${store.state.pharmacy.map(item => `
        <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start">
              <span class="text-[10px] uppercase font-bold text-slate-400">${item.category}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Critical' ? 'bg-rose-100 text-rose-700' : item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}">${item.status}</span>
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white mt-1">${item.name}</h3>
            <h4 class="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">${item.stock} <span class="text-xs font-normal text-slate-400">units</span></h4>
          </div>
          <button onclick="PharmacyController.restock('${item.id}')" class="mt-4 w-full bg-slate-100 dark:bg-slate-800 hover:bg-medicore-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold py-1.5 rounded transition-all">
            + Restock (100 Units)
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// --- OTHER VIEWS ---
function renderAppointmentsUI() {
  return `<div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"><h3 class="font-bold mb-2">Live OPD Token Queue</h3><p class="text-xs text-slate-400">42 Patient Consultations scheduled today across 4 clinics.</p></div>`;
}

function renderBedsUI() {
  return `<div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"><h3 class="font-bold mb-2">Emergency Ward Bed Map</h3><p class="text-xs text-slate-400">8 Vacant Emergency Beds / 4 Occupied Critical Units.</p></div>`;
}

function renderDiagnosticsUI() {
  return `<div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"><h3 class="font-bold mb-2">Laboratory & Radiology Worklist</h3><p class="text-xs text-slate-400">18 Pending MRI/Blood Test requisitions processing.</p></div>`;
}

// --- CONTROLLERS ---
const PatientController = {
  add: (e) => {
    e.preventDefault();
    store.addPatient({
      id: `MRN-${Math.floor(800 + Math.random() * 200)}`,
      name: document.getElementById("p-name").value,
      age: document.getElementById("p-age").value,
      gender: document.getElementById("p-gender").value,
      dept: document.getElementById("p-dept").value,
      status: document.getElementById("p-status").value
    });
    UIController.closeModal('modal-patient');
    document.getElementById("form-patient").reset();
  },
  delete: (id) => store.removePatient(id)
};

const DoctorController = {
  add: (e) => {
    e.preventDefault();
    store.addDoctor({
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      name: document.getElementById("d-name").value,
      spec: document.getElementById("d-spec").value,
      room: document.getElementById("d-room").value,
      status: document.getElementById("d-status").value
    });
    UIController.closeModal('modal-doctor');
    document.getElementById("form-doctor").reset();
  }
};

const BillingController = {
  add: (e) => {
    e.preventDefault();
    const now = new Date();
    store.addInvoice({
      id: `INV-${Math.floor(9000 + Math.random() * 1000)}`,
      patient: document.getElementById("b-patient").value,
      amount: document.getElementById("b-amount").value,
      dept: document.getElementById("b-dept").value,
      date: now.toISOString().split('T')[0],
      status: "Paid"
    });
    UIController.closeModal('modal-billing');
    document.getElementById("form-billing").reset();
  }
};

const PharmacyController = {
  restock: (id) => store.restockMedicine(id, 100)
};

const UIController = {
  openModal: (id) => document.getElementById(id).classList.replace('hidden', 'flex'),
  closeModal: (id) => document.getElementById(id).classList.replace('flex', 'hidden')
};

const ThemeController = {
  toggle: () => {
    const next = store.state.theme === 'light' ? 'dark' : 'light';
    store.setTheme(next);
  },
  apply: (theme) => {
    const root = document.getElementById("html-root");
    const icon = document.getElementById("theme-icon");
    if (theme === 'dark') {
      root.classList.add('dark');
      if (icon) icon.setAttribute('data-lucide', 'sun');
    } else {
      root.classList.remove('dark');
      if (icon) icon.setAttribute('data-lucide', 'moon');
    }
    if (window.lucide) lucide.createIcons();
  }
};

// --- CHART INITIALIZER ---
function initCharts() {
  const ctx = document.getElementById('overviewChart');
  if (!ctx) return;
  
  new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Inpatient Admissions',
          data: [14, 22, 18, 27, 31, 19, 12],
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Emergency Cases',
          data: [8, 12, 6, 15, 18, 14, 9],
          borderColor: '#e11d48',
          backgroundColor: 'transparent',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

// --- STATE SUBSCRIBER ---
store.subscribe((state) => {
  const badgeP = document.getElementById("badge-patients");
  const badgeD = document.getElementById("badge-doctors");
  if (badgeP) badgeP.innerText = state.patients.length;
  if (badgeD) badgeD.innerText = state.doctors.length;
  
  ThemeController.apply(state.theme);
  
  const activeNav = document.querySelector('.nav-btn.active');
  if (activeNav) {
    const viewName = activeNav.id.replace('nav-', '');
    router(viewName);
  }
});

// INITIAL BOOTSTRAP
document.addEventListener("DOMContentLoaded", () => {
  ThemeController.apply(store.state.theme);
  router('overview');
});
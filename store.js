/**
 * MEDICORE REACTIVE ENTERPRISE STORE
 * Pre-loaded with comprehensive clinical data.
 */
class Store {
  constructor() {
    this.state = {
      patients: JSON.parse(localStorage.getItem('mc_patients')) || [
        { id: "MRN-801", name: "Muhammad Tariq", age: 54, gender: "Male", dept: "Cardiology", status: "Critical" },
        { id: "MRN-802", name: "Fatima Noor", age: 32, gender: "Female", dept: "Neurology", status: "Stable" },
        { id: "MRN-803", name: "Chaudhry Rashid", age: 67, gender: "Male", dept: "Orthopedics", status: "Critical" },
        { id: "MRN-804", name: "Saima Parveen", age: 29, gender: "Female", dept: "Pediatrics", status: "Stable" },
        { id: "MRN-805", name: "Zubair Ahmed", age: 45, gender: "Male", dept: "Pulmonology", status: "Stable" },
        { id: "MRN-806", name: "Ayesha Malik", age: 38, gender: "Female", dept: "Gastroenterology", status: "Critical" },
        { id: "MRN-807", name: "Usman Ghani", age: 61, gender: "Male", dept: "Nephrology", status: "Stable" },
        { id: "MRN-808", name: "Zainab Bibi", age: 24, gender: "Female", dept: "Dermatology", status: "Stable" }
      ],
      doctors: JSON.parse(localStorage.getItem('mc_doctors')) || [
        { id: "DOC-101", name: "Dr. Kamran Malik", spec: "Cardiology", room: "OPD-12", status: "On Duty" },
        { id: "DOC-102", name: "Dr. Ayesha Siddiqui", spec: "Neurology", room: "OPD-04", status: "In Surgery" },
        { id: "DOC-103", name: "Dr. Hamza Ali", spec: "Orthopedics", room: "OPD-09", status: "On Duty" },
        { id: "DOC-104", name: "Dr. Rabia Usman", spec: "Pediatrics", room: "OPD-02", status: "Off Duty" },
        { id: "DOC-105", name: "Dr. Bilal Tanveer", spec: "Nephrology", room: "OPD-07", status: "On Duty" },
        { id: "DOC-106", name: "Dr. Maryam Imran", spec: "General Surgery", room: "OT Room 1", status: "In Surgery" }
      ],
      invoices: JSON.parse(localStorage.getItem('mc_invoices')) || [
        { id: "INV-9001", patient: "Muhammad Tariq", amount: 1450, dept: "Emergency ICU", date: "2026-09-16", status: "Paid" },
        { id: "INV-9002", patient: "Fatima Noor", amount: 120, dept: "OPD Consultation", date: "2026-09-16", status: "Pending" },
        { id: "INV-9003", patient: "Chaudhry Rashid", amount: 3200, dept: "Orthopedic Surgery", date: "2026-09-15", status: "Paid" },
        { id: "INV-9004", patient: "Saima Parveen", amount: 450, dept: "Pediatric Ward", date: "2026-09-15", status: "Paid" },
        { id: "INV-9005", patient: "Zubair Ahmed", amount: 230, dept: "Pharmacy Checkout", date: "2026-09-14", status: "Paid" }
      ],
      pharmacy: JSON.parse(localStorage.getItem('mc_pharmacy')) || [
        { id: "MED-101", name: "Paracetamol 500mg", stock: 3400, category: "Analgesic", status: "Adequate" },
        { id: "MED-102", name: "Amoxicillin 250mg", stock: 180, category: "Antibiotic", status: "Low Stock" },
        { id: "MED-103", name: "Insulin Regular 100IU", stock: 45, category: "Diabetes", status: "Critical" },
        { id: "MED-104", name: "Lipitor 20mg", stock: 1200, category: "Cardiovascular", status: "Adequate" },
        { id: "MED-105", name: "Ciprofloxacin 500mg", stock: 85, category: "Antibiotic", status: "Low Stock" },
        { id: "MED-106", name: "IV Normal Saline 1000ml", stock: 650, category: "Emergency IV", status: "Adequate" }
      ],
      logs: JSON.parse(localStorage.getItem('mc_logs')) || [
        { time: "11:15", action: "System Health Audit Executed", user: "Admin" },
        { time: "10:45", action: "Admitted Patient MRN-808 (Zainab Bibi)", user: "Dr. Hamza Ali" },
        { time: "09:30", action: "Settled Invoice INV-9001 ($1,450)", user: "Counter POS" }
      ],
      theme: localStorage.getItem('mc_theme') || 'light'
    };
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    localStorage.setItem('mc_patients', JSON.stringify(this.state.patients));
    localStorage.setItem('mc_doctors', JSON.stringify(this.state.doctors));
    localStorage.setItem('mc_invoices', JSON.stringify(this.state.invoices));
    localStorage.setItem('mc_pharmacy', JSON.stringify(this.state.pharmacy));
    localStorage.setItem('mc_logs', JSON.stringify(this.state.logs));
    localStorage.setItem('mc_theme', this.state.theme);
    this.listeners.forEach(fn => fn(this.state));
  }

  addPatient(patient) {
    this.state.patients = [patient, ...this.state.patients];
    this.addLog(`Admitted patient: ${patient.name}`);
    this.notify();
  }

  removePatient(id) {
    const patient = this.state.patients.find(p => p.id === id);
    this.state.patients = this.state.patients.filter(p => p.id !== id);
    if (patient) this.addLog(`Discharged patient: ${patient.name}`);
    this.notify();
  }

  addDoctor(doctor) {
    this.state.doctors = [doctor, ...this.state.doctors];
    this.addLog(`Added doctor: ${doctor.name}`);
    this.notify();
  }

  addInvoice(invoice) {
    this.state.invoices = [invoice, ...this.state.invoices];
    this.addLog(`Issued invoice ${invoice.id} ($${invoice.amount})`);
    this.notify();
  }

  restockMedicine(id, qty) {
    this.state.pharmacy = this.state.pharmacy.map(item => {
      if (item.id === id) {
        const newStock = item.stock + qty;
        return { 
          ...item, 
          stock: newStock,
          status: newStock < 100 ? "Critical" : newStock < 500 ? "Low Stock" : "Adequate"
        };
      }
      return item;
    });
    this.addLog(`Restocked supply ${id} (+${qty} units)`);
    this.notify();
  }

  addLog(action) {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.state.logs = [{ time: timeStr, action, user: "System Admin" }, ...this.state.logs.slice(0, 15)];
  }

  setTheme(theme) {
    this.state.theme = theme;
    this.notify();
  }
}

const store = new Store();
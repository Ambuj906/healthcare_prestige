// Security Check
if (sessionStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

var patients = JSON.parse(localStorage.getItem("patients")) || [];

const tableBody = document.querySelector("tbody");
const form = document.getElementById("patientForm");
function mapRisk(risk) {
  if (risk === "Red" || risk === "High") return "High";
  if (risk === "Yellow" || risk === "Medium") return "Medium";
  return "Low";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const patient = {
    token: token.value,
    name: name.value,
    age: age.value,
    symptoms: symptoms.value,
    risk: risk.value,
    doctor: assignDoctor(symptoms.value),
    time: new Date().toLocaleTimeString(),
    status: "Waiting"
  };

  const editIndex = document.getElementById("editIndex").value;

  if (editIndex === "") {
    patients.push(patient);
  } else {
    patients[editIndex] = patient;
    document.getElementById("editIndex").value = "";
  }

  localStorage.setItem("patients", JSON.stringify(patients));
  form.reset();
  renderTable();
});

function assignDoctor(symptoms) {
  const s = symptoms.toLowerCase();

  if (
    s.includes("chest pain") ||
    s.includes("breathlessness") ||
    s.includes("breathless")
  ) {
    return "Cardiologist / Pulmonologist";
  }

  if (
    s.includes("fever") ||
    s.includes("cough") ||
    s.includes("fatigue")
  ) {
    return "General Physician";
  }

  return "General Physician";
}

function renderTable() {
  // 1. Automatic Priority Sorting: High/Red first
  patients.sort((a, b) => {
    const priority = { "Red": 0, "High": 0, "Yellow": 1, "Medium": 1, "Green": 2, "Low": 2 };
    // Default to low priority (2) if undefined
    const pA = priority[a.risk] !== undefined ? priority[a.risk] : 2;
    const pB = priority[b.risk] !== undefined ? priority[b.risk] : 2;
    return pA - pB;
  });

  tableBody.innerHTML = "";

  patients.forEach((p, index) => {
    const row = document.createElement("tr");
    
    // 2. Assign Color Class
    let riskClass = "low";
    if (p.risk === "Red" || p.risk === "High") riskClass = "high";
    else if (p.risk === "Yellow" || p.risk === "Medium") riskClass = "medium";
    row.className = riskClass;

    row.innerHTML = `
      <td>${p.token}</td>
      <td><span class="patient-link" onclick="showPatientDetails(${index})">${p.name}</span></td>
      <td>${p.age}</td>
      <td>${Array.isArray(p.symptoms) ? p.symptoms.join(", ") : p.symptoms}</td>
      <td>${mapRisk(p.risk)}</td>

      <td>${p.doctor}</td>
      <td>${p.time}</td>
      <td>
        <select onchange="changeStatus(${index}, this.value)" style="padding: 5px; border-radius: 4px;">
            <option value="Waiting" ${p.status === 'Waiting' ? 'selected' : ''}>Waiting</option>
            <option value="Surgery" ${p.status === 'Surgery' ? 'selected' : ''}>Surgery</option>
            <option value="Stable" ${p.status === 'Stable' ? 'selected' : ''}>Stable</option>
            <option value="Discharge" ${p.status === 'Discharge' ? 'selected' : ''}>Discharge</option>
            <option value="Critical" ${p.status === 'Critical' ? 'selected' : ''}>Critical</option>
        </select>
      </td>
      <td>
        <button onclick="editPatient(${index})">Edit</button>
        <button onclick="markCalled(${index})">Called</button>
        <button onclick="markCompleted(${index})">Completed</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function editPatient(index) {
  const p = patients[index];

  token.value = p.token;
  name.value = p.name;
  age.value = p.age;
  symptoms.value = p.symptoms;
  risk.value = p.risk;

  document.getElementById("editIndex").value = index;
}

function markCalled(index) {
  patients[index].status = "In Progress";
  localStorage.setItem("patients", JSON.stringify(patients));
  renderTable();
}

function markCompleted(index) {
  patients[index].status = "Completed";
  localStorage.setItem("patients", JSON.stringify(patients));
  renderTable();
}
window.addEventListener("storage", () => {
  patients = JSON.parse(localStorage.getItem("patients")) || [];
  renderTable();
});

function logout() {
  sessionStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}

/* Modal Logic */
const modal = document.getElementById("patientModal");

function showPatientDetails(index) {
  const p = patients[index];
  document.getElementById("modalName").innerText = p.name;
  document.getElementById("modalToken").innerText = p.token;
  document.getElementById("modalAge").innerText = p.age;
  document.getElementById("modalPhone").innerText = p.phone || "N/A";
  document.getElementById("modalSymptoms").innerText = Array.isArray(p.symptoms) ? p.symptoms.join(", ") : p.symptoms;
  document.getElementById("modalHistory").innerText = p.history || "None";
  document.getElementById("modalDoctor").innerText = p.doctor;
  document.getElementById("modalRisk").innerText = p.risk;
  
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}

renderTable();
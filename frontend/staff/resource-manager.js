/* =========================================
   1. Database Schema (Mock Data)
   ========================================= */
let hospitalResources = [
  { resourceType: "ICU Bed", totalCapacity: 10, currentOccupancy: 8 },
  { resourceType: "General Ward", totalCapacity: 20, currentOccupancy: 5 }
];

/* =========================================
   2. The Logic Function (The Brain)
   ========================================= */
function checkBedAvailability(patientSeverity, currentOccupancy, totalCapacity) {
  // Logic: If Critical AND Full/Over capacity -> REDIRECT
  if (patientSeverity === "Critical" && currentOccupancy >= totalCapacity) {
    return { 
      status: "REDIRECT", 
      message: "CRITICAL ALERT: NO BEDS AVAILABLE. REDIRECT PATIENT." 
    };
  }
  // Otherwise -> ADMIT
  return { 
    status: "ADMIT", 
    message: "Bed Assigned" 
  };
}

/* =========================================
   3. Frontend UI Logic
   ========================================= */
function renderResources() {
  const container = document.getElementById("resourceDashboard");
  if (!container) return;

  container.innerHTML = "";

  hospitalResources.forEach(res => {
    const available = res.totalCapacity - res.currentOccupancy;
    const percentAvailable = available / res.totalCapacity;
    
    // Visual Condition Logic
    let colorClass = "bg-orange"; // Default
    if (percentAvailable < 0.20) colorClass = "bg-red";    // < 20% available
    if (percentAvailable > 0.50) colorClass = "bg-green";  // > 50% available

    const card = document.createElement("div");
    card.className = `resource-card ${colorClass}`;
    card.innerHTML = `
      <h3>${res.resourceType}</h3>
      <h1>${res.currentOccupancy} / ${res.totalCapacity}</h1>
      <p>${available} Available</p>
    `;
    container.appendChild(card);
  });
}

function simulateCriticalPatient() {
  const icu = hospitalResources.find(r => r.resourceType === "ICU Bed");
  const result = checkBedAvailability("Critical", icu.currentOccupancy, icu.totalCapacity);
  alert(`Simulation Result:\nStatus: ${result.status}\nMessage: ${result.message}`);
}

renderResources();
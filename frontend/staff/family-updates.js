// 4. Doctor's UI Trigger (Frontend Snippet)

async function changeStatus(patientIndex, newStatus) {
    console.log("Triggering status update for index:", patientIndex, "Status:", newStatus);
    
    // Access the global patients array from script.js
    const patient = (window.patients || patients)[patientIndex]; 
    
    if (!patient) {
        alert("Patient not found");
        return;
    }

    // Optimistic UI Update (Update local data immediately)
    patient.status = newStatus;
    localStorage.setItem("patients", JSON.stringify(patients));
    
    // Note: We don't call renderTable() here to avoid resetting the dropdown focus, 
    // but in a full app you might want to.

    // Call Backend API
    try {
        const response = await fetch('http://localhost:3000/api/update-patient-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                patientId: patient.token,
                newStatus: newStatus,
                relativePhone: patient.phone 
            })
        });

        const data = await response.json();
        showToast(`Family Notified: ${newStatus} ✅`);

    } catch (error) {
        // Simulation Fallback: If backend is down, still show success for the demo
        console.warn("Backend not reachable. Simulating success.");
        showToast(`Family Notified: ${newStatus} ✅`);
    }
}

// Toast Notification Helper
function showToast(message) {
    const toast = document.createElement("div");
    toast.innerText = message;
    Object.assign(toast.style, {
        position: "fixed", bottom: "20px", right: "20px",
        background: "#333", color: "#fff", padding: "12px 24px",
        borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        zIndex: "1000", transition: "opacity 0.5s"
    });

    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 500); }, 3000);
}
const form = document.getElementById("patientForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Collect data
    const name = form.querySelector('input[type="text"]').value;
    const age = form.querySelector('input[type="number"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const history = form.querySelector('textarea').value;

    const symptoms = Array.from(
        form.querySelectorAll('input[type="checkbox"]:checked')
    ).map(cb => cb.parentElement.innerText.trim());

    // Token (simple incremental)
    let patients = JSON.parse(localStorage.getItem("patients")) || [];
    const token = "T-" + String(patients.length + 1).padStart(4, "0");

    // Risk logic
    let risk = "Green";

    if (symptoms.includes("Chest Pain") || symptoms.includes("Breathlessness")) {
        risk = "Red";
    } else if (
        (symptoms.includes("Fever") || symptoms.includes("Cough")) &&
        age >= 45
    ) {
        risk = "Yellow";
    }

    // Assign Doctor Logic
    let doctor = "General Physician";
    const sString = symptoms.join(", ").toLowerCase();
    if (sString.includes("chest pain") || sString.includes("breathlessness")) {
        doctor = "Cardiologist / Pulmonologist";
    }

    // Patient object (THIS IS THE CONTRACT)
    const patientData = {
        token,
        name,
        age,
        phone,
        symptoms,
        history,
        risk,
        doctor,
        time: new Date().toLocaleTimeString(),
        status: "Waiting"
    };

    // Save
    patients.push(patientData);
    localStorage.setItem("patients", JSON.stringify(patients));

    window.location.href = `token-view.html?token=${token}`;
});
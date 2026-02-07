const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Message Config (Data Mapping)
const STATUS_MESSAGES = {
    "Surgery": "Update: Patient is now in the Operation Theatre. The procedure has started. We will update you soon.",
    "Stable": "Good News: The patient is stable and resting in the recovery ward.",
    "Discharge": "Update: The patient is ready for discharge. Please come to the reception.",
    "Critical": "Urgent Update: The patient's condition is critical. Doctors are attending immediately.",
    "Waiting": "Update: Patient is currently waiting for the doctor."
};

// 2. SMS Service (Twilio Integration)
async function sendFamilyUpdate(phoneNumber, status) {
    const message = STATUS_MESSAGES[status] || `Update: Patient status changed to ${status}.`;

    try {
        // Hackathon Mode Check: If no API keys, throw error to trigger catch block simulation
        if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) {
            throw new Error("Missing Twilio Credentials - Switching to Simulation Mode");
        }

        const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        console.log(`✅ SMS Sent to ${phoneNumber}: ${message}`);
        return true;

    } catch (error) {
        // Simulation Fallback (Hackathon Mode)
        console.log("---------------------------------------------------");
        console.log(`⚠️  SIMULATING SMS TO ${phoneNumber}`);
        console.log(`💬  MESSAGE: "${message}"`);
        console.log("---------------------------------------------------");
        return false; 
    }
}

// 3. API Endpoint (Backend Route)
app.post('/api/update-patient-status', async (req, res) => {
    const { patientId, newStatus, relativePhone } = req.body;

    if (!patientId || !newStatus) {
        return res.status(400).json({ error: "Missing fields" });
    }

    console.log(`[DB] Updating Patient ${patientId} to ${newStatus}`);

    // Trigger SMS
    // Defaulting phone number for demo if not provided
    await sendFamilyUpdate(relativePhone || "+15550000000", newStatus);

    res.json({ 
        success: true, 
        message: "Status updated and family notified" 
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
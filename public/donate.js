document.addEventListener("DOMContentLoaded", function () {
    async function sendDataToServer(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error sending data:', error);
            alert('An error occurred while submitting. Please try again.');
            return null;
        }
    }

    document.getElementById("donationForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const donorName = document.getElementById("donorName").value.trim();
        const donorContact = document.getElementById("donorContact").value.trim();
        const bloodGroup = document.getElementById("bloodGroup").value;
        const healthCondition = document.getElementById("health-condition").value.trim();

        if (healthCondition.length < 10) {
            alert("Please provide a detailed health condition (at least 10 characters).");
            return;
        }

        if (donorName && donorContact && bloodGroup && healthCondition) {
            const donationData = {
                donorName: donorName,
                donorContact: donorContact,
                bloodGroup: bloodGroup,
                healthCondition: healthCondition,
            };

            const result = await sendDataToServer('/api/donations', donationData);

            if (result) {
                alert(`Thank you, ${donorName}! Your blood donation will save lives.`);
                document.getElementById("donationForm").reset();
            }
        } else {
            alert("Please fill in all fields before submitting.");
        }
    });

    document.getElementById("assistanceForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const seekerName = document.getElementById("seekerName").value.trim();
        const seekerContact = document.getElementById("seekerContact").value.trim();
        const neededBloodGroup = document.getElementById("neededBloodGroup").value;
        const hospital = document.getElementById("hospital").value.trim();

        if (seekerName && seekerContact && neededBloodGroup && hospital) {
            const requestData = {
                seekerName: seekerName,
                seekerContact: seekerContact,
                neededBloodGroup: neededBloodGroup,
                hospital: hospital,
            };

            const result = await sendDataToServer('/api/requests', requestData);

            if (result) {
                alert(`Your request for ${neededBloodGroup} blood has been submitted. Donors will be notified.`);
                document.getElementById("assistanceForm").reset();
            }
        } else {
            alert("Please fill in all fields before submitting.");
        }
    });
});
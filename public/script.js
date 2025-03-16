// Attach event listeners to the buttons
document.addEventListener("DOMContentLoaded", () => {
    // Button references
    const bloodBankButton = document.querySelector(".card:nth-child(1) button");
    const hospitalButton = document.querySelector(".card:nth-child(2) button");
    const ambulanceButton = document.querySelector(".card:nth-child(3) button");
    const pharmacyButton = document.querySelector(".card:nth-child(4) button");
  
    // Navigate to Blood Bank Finder page
    bloodBankButton.addEventListener("click", () => {
      window.location.href = "bloodbanks.html";
    });
  
    // Navigate to Hospital Finder page
    hospitalButton.addEventListener("click", () => {
      window.location.href = "hospitalfinder.html";
    });
  
    // Navigate to Ambulance Finder page
    ambulanceButton.addEventListener("click", () => {
      window.location.href = "ambulancefinder.html";
    });
  
    // Navigate to Pharmacy Finder page
    pharmacyButton.addEventListener("click", () => {
      window.location.href = "pharmacies.html";
    });
  });
  
  
  document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const contactInfo = document.getElementById('contactInfo').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('/send-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contactInfo, message })
        });

        const result = await response.json();

        if (result.success) {
            alert('Message received and stored successfully!');
            document.getElementById('contactForm').reset();
        } else {
            alert(result.error || 'Something went wrong. Please try again.');
        }
    } catch (error) {
        alert('Failed to send the message. Please try again later.');
    }
}); 
document.addEventListener("DOMContentLoaded", function () {
  // Handle Blood Donation Form Submission
  document.getElementById("donationForm").addEventListener("submit", function (event) {
      event.preventDefault();

      // Get donor details
      let donorName = document.getElementById("donorName").value.trim();
      let donorBloodType = document.getElementById("donorBloodType").value;
      let donorLocation = document.getElementById("donorLocation").value.trim();
      let donorContact = document.getElementById("donorContact").value.trim();
      let healthCondition = document.getElementById("health-condition").value.trim();

      // Health Condition Validation
      if (healthCondition.length < 10) {
          alert("Please provide a detailed health condition (at least 10 characters).");
          return; // Stop form submission
      }

      // Ensure all fields are filled
      if (donorName && donorBloodType && donorLocation && donorContact) {
          alert(`Thank you, ${donorName}! Your blood donation will save lives.`);
          document.getElementById("donationForm").reset();
      } else {
          alert("Please fill in all fields before submitting.");
      }
  });

  // Handle Blood Request Form Submission
  document.getElementById("assistanceForm").addEventListener("submit", function (event) {
      event.preventDefault();

      // Get requestor details
      let requestorName = document.getElementById("requestorName").value.trim();
      let requestorBloodType = document.getElementById("requestorBloodType").value;
      let requestorLocation = document.getElementById("requestorLocation").value.trim();
      let requestorContact = document.getElementById("requestorContact").value.trim();

      // Ensure all fields are filled
      if (requestorName && requestorBloodType && requestorLocation && requestorContact) {
          alert(`Your request for ${requestorBloodType} blood has been submitted. Donors will be notified.`);
          document.getElementById("assistanceForm").reset();
      } else {
          alert("Please fill in all fields before submitting.");
      }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  const closeModalButton = document.querySelector(".close-modal");

  // Add click event to each button to open the modal
  document.querySelectorAll(".open-modal").forEach((button) => {
      button.addEventListener("click", () => {
          modalTitle.textContent = button.getAttribute("data-title");
          modalContent.textContent = button.getAttribute("data-content");
          modal.style.display = "flex"; // Show the modal
      });
  });

  // Close modal when clicking the close button
  closeModalButton.addEventListener("click", () => {
      modal.style.display = "none";
  });

  // Close modal when clicking outside of the modal content
  window.addEventListener("click", (event) => {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  });
});

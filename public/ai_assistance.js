document.addEventListener("DOMContentLoaded", function () {
  const chatbox = document.getElementById("chatbox");
  const userInput = document.getElementById("userInput");

  // Handle Enter key press
  userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission if it's inside a form
      sendMessage();
    }
  });
});

// Send message to AI API
async function sendMessage() {
  const userInputField = document.getElementById("userInput");
  const userInput = userInputField.value.trim();
  if (!userInput) return;

  console.log(userInput);
  displayMessage(userInput, "user");

  userInputField.value = "";

  try {
    const response = await fetch("/ai-assistance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: userInput }),
    });

    const data = await response.json();

    if (data.message) {
      displayMessage(data.message, "bot");
    } else if (data.error) {
      displayMessage(`Error: ${data.error}`, "bot");
    } else {
      displayMessage("An unexpected error occurred. Please try again.", "bot");
    }
  } catch (error) {
    console.error("Error communicating with the AI API:", error);
    displayMessage("Error communicating with the AI API. Please try again later.", "bot");
  }
}

// Display chat messages in UI
function displayMessage(message, sender) {
  const chatbox = document.getElementById("chatbox");
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-message ${sender}`;
  msgDiv.innerText = message;
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to latest message
}

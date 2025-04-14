// API-Anfrage verarbeiten
async function fetchAnswer(userInput) {
  try {
    // Verwende einen Server-Side API-Endpunkt anstatt direkter Client-Anfragen
    const response = await fetch("/api/askFriedrich", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: userInput }),
    });

    if (!response.ok) {
      throw new Error(`Server antwortete mit Status ${response.status}`);
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Fehler beim Abrufen der Antwort:", error);
    return `Entschuldigung, es gab einen Fehler: ${error.message}`;
  }
}

// Event-Listener für den Button
document.querySelector("#sendButton").addEventListener("click", async () => {
  const userInput = document.querySelector("#userInput").value;
  const responseBox = document.querySelector("#responseBox");

  if (!userInput.trim()) {
    responseBox.textContent = "Bitte gib eine Frage ein.";
    return;
  }

  responseBox.textContent = "Friedrich denkt nach...";
  const answer = await fetchAnswer(userInput);
  responseBox.textContent = answer;
});

// Enter-Taste funktioniert auch
document.querySelector("#userInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    document.querySelector("#sendButton").click();
  }
});

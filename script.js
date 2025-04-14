// Frontend-Code für die Interaktion mit dem API-Endpunkt
document.querySelector("#sendButton").addEventListener("click", async () => {
  const userInput = document.querySelector("#userInput").value;
  const responseBox = document.querySelector("#responseBox");

  if (!userInput.trim()) {
    responseBox.textContent = "Bitte gib eine Frage ein.";
    return;
  }

  responseBox.textContent = "Friedrich denkt nach...";
  
  try {
    const response = await fetch("/api/askFriedrich", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: userInput }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server antwortete mit Status ${response.status}`);
    }

    const data = await response.json();
    responseBox.textContent = data.answer;
    
  } catch (error) {
    console.error("Fehler:", error);
    responseBox.textContent = `Entschuldigung, es gab einen Fehler: ${error.message}`;
  }
});

// Enter-Taste funktioniert auch
document.querySelector("#userInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    document.querySelector("#sendButton").click();
  }
});

// Event-Listener für den Button hinzufügen
document.querySelector("#sendButton").addEventListener("click", async () => {
  const userInput = document.querySelector("#userInput").value;
  const responseBox = document.querySelector("#responseBox");

  // Prüfen, ob eine Eingabe vorhanden ist
  if (!userInput.trim()) {
    responseBox.textContent = "Bitte gib eine Frage ein.";
    return;
  }

  // Feedback, dass die Anfrage gesendet wurde
  responseBox.textContent = "Friedrich denkt nach...";
  
  try {
    // API-Anfrage senden
    const response = await fetch("/api/askFriedrich", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: userInput }),
    });

    // Antwort verarbeiten
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Serverfehler (${response.status})`);
    }

    // Antwort anzeigen
    responseBox.textContent = data.answer;
    
  } catch (error) {
    // Fehlerbehandlung
    console.error("Fehler bei der Anfrage:", error);
    responseBox.textContent = `Ein Fehler ist aufgetreten: ${error.message}`;
  }
});

// Enter-Taste als Alternative zum Button
document.querySelector("#userInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    document.querySelector("#sendButton").click();
  }
});

// Debugging-Info in der Konsole
console.log("Friedrich AI-Concierge wurde geladen.");

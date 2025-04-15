// Zähler für Anfragen, um Probleme zu identifizieren
let requestCount = 0;

// Hilfsfunktion zum Anzeigen von Fehlern
function showError(message) {
  const responseBox = document.querySelector("#responseBox");
  responseBox.innerHTML = `<span style="color: red;">⚠️ ${message}</span>`;
  console.error(message);
}

// Funktion zum Senden von Anfragen
async function askFriedrich(question) {
  const responseBox = document.querySelector("#responseBox");
  
  // Feedback während der Verarbeitung
  responseBox.textContent = "Friedrich denkt nach...";
  
  // Anfragezähler erhöhen
  const currentRequest = ++requestCount;
  console.log(`Anfrage #${currentRequest} gesendet: "${question}"`);
  
  try {
    // API-Anfrage senden
    const response = await fetch("/api/askFriedrich", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    
    // Prüfen, ob die aktuelle Anfrage noch die aktuellste ist
    if (currentRequest !== requestCount) {
      console.log(`Anfrage #${currentRequest} wurde überschrieben, Antwort wird ignoriert.`);
      return;
    }
    
    // Antwort als Text für Debugging
    const responseText = await response.text();
    
    // Versuche, die Antwort als JSON zu parsen
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Konnte Antwort nicht als JSON parsen:", responseText);
      throw new Error("Server-Antwort ist kein gültiges JSON");
    }
    
    // Prüfe auf API-Fehler
    if (!response.ok) {
      throw new Error(data.error || `Server antwortete mit Status ${response.status}`);
    }
    
    // Prüfe, ob die Antwort das erwartete Format hat
    if (!data.answer) {
      console.error("Unerwartetes Antwortformat:", data);
      throw new Error("Die Antwort enthält keine 'answer'-Eigenschaft");
    }
    
    // Anzeigen der Antwort
    responseBox.textContent = data.answer;
    console.log(`Anfrage #${currentRequest} erfolgreich beantwortet.`);
    
  } catch (error) {
    // Nur anzeigen, wenn es die aktuellste Anfrage ist
    if (currentRequest === requestCount) {
      showError(`Ein Fehler ist aufgetreten: ${error.message}`);
      console.error("Vollständiger Fehler:", error);
    }
  }
}

// Event-Listener für den Button
document.querySelector("#sendButton").addEventListener("click", () => {
  const userInput = document.querySelector("#userInput").value.trim();
  
  if (!userInput) {
    showError("Bitte gib eine Frage ein.");
    return;
  }
  
  askFriedrich(userInput);
});

// Enter-Taste zum Absenden
document.querySelector("#userInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    document.querySelector("#sendButton").click();
  }
});

// Initialer Status
document.querySelector("#responseBox").textContent = "Stelle eine Frage über Caspar David Friedrich...";
console.log("Friedrich AI-Concierge ist bereit.")

// Sicherstellen, dass der API-Key korrekt geladen wird
let API_KEY;

// Überprüfe, ob wir in einer Entwicklungsumgebung sind
if (import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) {
  API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
} else if (process.env && process.env.VITE_OPENAI_API_KEY) {
  // Fallback für bestimmte Umgebungen
  API_KEY = process.env.VITE_OPENAI_API_KEY;
} else {
  console.error("Kein API-Schlüssel gefunden. Stelle sicher, dass VITE_OPENAI_API_KEY in deiner .env-Datei definiert ist.");
}

async function fetchAnswer(userInput) {
  try {
    // Prüfe ob der API-Key existiert
    if (!API_KEY) {
      throw new Error("API-Schlüssel nicht gefunden");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Du bist ein Kunstvermittler in einer Ausstellung über Caspar David Friedrich. Antworte präzise und freundlich.",
          },
          {
            role: "user",
            content: userInput,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API-Antwort:", errorText);
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Fehler beim API-Aufruf:", error);
    return `Fehler bei der Anfrage: ${error.message}. Bitte überprüfe die Konsole für weitere Details.`;
  }
}

document.querySelector("#sendButton").addEventListener("click", async () => {
  const userInput = document.querySelector("#userInput").value;
  const responseBox = document.querySelector("#responseBox");

  if (!userInput.trim()) {
    responseBox.textContent = "Bitte gib eine Frage ein.";
    return;
  }

  responseBox.textContent = "Antwort wird geladen…";
  const answer = await fetchAnswer(userInput);
  responseBox.textContent = answer;
});

// Event-Listener für Enter-Taste
document.querySelector("#userInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    document.querySelector("#sendButton").click();
  }
});

// Debugging-Infos
console.log("Umgebung:", import.meta.env ? "Vite" : "Andere");
console.log("API-Key vorhanden:", API_KEY ? "Ja" : "Nein");

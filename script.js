// Vereinfachte Version ohne Import-Magie
const API_KEY = process.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;

async function fetchAnswer(userInput) {
  try {
    console.log("API Key verfügbar:", !!API_KEY);
    
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

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Fehler:", error);
    return "Fehler bei der Antwort. Bitte überprüfe die Konsole (F12) für Details.";
  }
}

// Rest des Codes bleibt gleich...

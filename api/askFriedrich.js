// API-Route für Vercel Serverless Functions
export default async function handler(req, res) {
  // Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen sind erlaubt' });
  }

  try {
    // API-Schlüssel aus Umgebungsvariablen
    const API_KEY = process.env.VITE_OPENAI_API_KEY;
    
    if (!API_KEY) {
      throw new Error('API-Schlüssel nicht gefunden. Bitte in Vercel-Einstellungen konfigurieren.');
    }

    // Benutzerfrage aus dem Request-Body extrahieren
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Keine Frage übermittelt' });
    }

    // OpenAI API aufrufen
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
            content: question,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error("OpenAI API-Fehler:", errorData);
      throw new Error(`OpenAI API-Fehler: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    const answer = data.choices[0].message.content;

    // Erfolgreiche Antwort zurückgeben
    return res.status(200).json({ answer });

  } catch (error) {
    console.error("Serverfehler:", error);
    return res.status(500).json({ 
      error: 'Serverfehler', 
      message: error.message 
    });
  }
}
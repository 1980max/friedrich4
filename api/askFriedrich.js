// Einfacher API-Endpunkt für Vercel
const { OpenAI } = require("openai");

module.exports = async (req, res) => {
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS-Anfragen für CORS sofort beantworten
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Nur POST-Anfragen bearbeiten
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen erlaubt' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY // Beachte: OPENAI_API_KEY anstatt VITE_OPENAI_API_KEY
    });

    // Frage aus Request-Body extrahieren
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Keine Frage übermittelt' });
    }

    // OpenAI API aufrufen
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du bist ein Kunstvermittler in einer Ausstellung über Caspar David Friedrich. Antworte präzise und freundlich."
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
    });

    // Antwort zurückgeben
    res.status(200).json({ answer: completion.choices[0].message.content });
    
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({ 
      error: 'Ein unerwarteter Fehler ist aufgetreten', 
      details: error.message 
    });
  }
};

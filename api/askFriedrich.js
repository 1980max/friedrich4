const axios = require('axios');

module.exports = async (req, res) => {
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS-Anfragen beantworten (für CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Nur POST-Anfragen akzeptieren
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen sind erlaubt' });
  }

  try {
    // API-Schlüssel prüfen
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API-Schlüssel fehlt in den Umgebungsvariablen' });
    }

    // Frage aus Request-Body extrahieren
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Keine Frage übermittelt' });
    }

    // Anfrage an OpenAI
    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
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
        temperature: 0.7
      },
      timeout: 10000 // 10 Sekunden Timeout
    });

    // Antwort zurückgeben
    const answer = response.data.choices[0].message.content;
    return res.status(200).json({ answer });

  } catch (error) {
    console.error('Fehler:', error.response?.data || error.message);
    
    // Bei Axios-Fehlern
    if (error.response) {
      // Der Server hat mit einem Fehlerstatuscode geantwortet
      return res.status(error.response.status).json({
        error: 'OpenAI API-Fehler',
        details: error.response.data
      });
    } else if (error.request) {
      // Die Anfrage wurde gestellt, aber keine Antwort erhalten
      return res.status(500).json({
        error: 'Keine Antwort von OpenAI erhalten',
        details: 'Timeout oder Netzwerkproblem'
      });
    } else {
      // Beim Einrichten der Anfrage ist ein Fehler aufgetreten
      return res.status(500).json({
        error: 'Anfrage an OpenAI konnte nicht erstellt werden',
        details: error.message
      });
    }
  }
};

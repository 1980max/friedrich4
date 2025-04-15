const axios = require('axios');

module.exports = async (req, res) => {
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS-Anfragen beantworten
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Nur POST-Anfragen akzeptieren
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen sind erlaubt' });
  }

  try {
    // API-Schlüssel abrufen
    const API_KEY = process "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";
    if (!API_KEY) {
      return res.status(500).json({ error: 'API-Schlüssel fehlt in den Umgebungsvariablen' });
    }

    // Frage aus Request-Body extrahieren
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Keine Frage übermittelt' });
    }

    // Sicherstellen, dass die Frage einen String ist
    const sanitizedQuestion = String(question).trim();
    
    // Prüfen, ob die Frage leer ist
    if (sanitizedQuestion.length === 0) {
      return res.status(400).json({ error: 'Frage darf nicht leer sein' });
    }
    
    // Prüfen, ob die Frage zu lang ist (OpenAI hat Längenbeschränkungen)
    if (sanitizedQuestion.length > 4000) {
      return res.status(400).json({ error: 'Frage ist zu lang (max. 4000 Zeichen)' });
    }

    // Anfrage an OpenAI
    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
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
            content: sanitizedQuestion
          }
        ],
        max_tokens: 500, // Verhindert zu lange Antworten
        temperature: 0.7
      },
      timeout: 15000 // 15 Sekunden Timeout
    });

    // Erfolgreiche Antwort
    const answer = response.data.choices[0].message.content;
    return res.status(200).json({ answer });

  } catch (error) {
    console.error('OpenAI API Fehler:', error.response?.data || error.message);
    
    // Spezifische Fehlermeldungen
    if (error.response?.data?.error?.message) {
      return res.status(500).json({
        error: 'Fehler von OpenAI: ' + error.response.data.error.message
      });
    } else if (error.response) {
      return res.status(error.response.status).json({
        error: `Fehler vom API-Server (${error.response.status})`
      });
    } else if (error.request) {
      return res.status(500).json({
        error: 'Keine Antwort vom API-Server erhalten'
      });
    } else {
      return res.status(500).json({
        error: 'Fehler bei der Anfrage: ' + error.message
      });
    }
  }
};

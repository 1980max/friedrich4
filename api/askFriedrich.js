// Standard-Node.js Modul für HTTP-Anfragen
const https = require('https');

module.exports = (req, res) => {
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
    const question = req.body.question;
    
    if (!question) {
      return res.status(400).json({ error: 'Keine Frage übermittelt' });
    }

    // Anfrage an OpenAI API vorbereiten
    const data = JSON.stringify({
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
    });

    // Optionen für die HTTP-Anfrage
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Length': data.length
      }
    };

    // HTTP-Anfrage senden
    const request = https.request(options, (response) => {
      let responseData = '';
      
      response.on('data', (chunk) => {
        responseData += chunk;
      });
      
      response.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          
          if (response.statusCode !== 200) {
            console.error('OpenAI API Fehler:', parsedData);
            return res.status(response.statusCode).json({ 
              error: 'Fehler bei der OpenAI API', 
              details: parsedData.error?.message || 'Unbekannter Fehler' 
            });
          }
          
          const answer = parsedData.choices[0].message.content;
          res.status(200).json({ answer });
        } catch (error) {
          console.error('Fehler beim Verarbeiten der Antwort:', error);
          res.status(500).json({ error: 'Fehler beim Verarbeiten der Antwort' });
        }
      });
    });

    // Fehlerbehandlung für die HTTP-Anfrage
    request.on('error', (error) => {
      console.error('Fehler bei der HTTP-Anfrage:', error);
      res.status(500).json({ error: 'Netzwerkfehler bei der Anfrage an OpenAI' });
    });

    // Daten senden und Anfrage abschließen
    request.write(data);
    request.end();
    
  } catch (error) {
    console.error('Serverfehler:', error);
    res.status(500).json({ error: 'Ein unerwarteter Fehler ist aufgetreten' });
  }
};

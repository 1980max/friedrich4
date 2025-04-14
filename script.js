
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

async function fetchAnswer(userInput) {
  try {
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
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Fehler:", error);
    return "Fehler bei der Antwort. Bitte probiere es später erneut.";
  }
}

document.querySelector("#sendButton").addEventListener("click", async () => {
  const userInput = document.querySelector("#userInput").value;
  const responseBox = document.querySelector("#responseBox");

  responseBox.textContent = "Antwort wird geladen…";
  const answer = await fetchAnswer(userInput);
  responseBox.textContent = answer;
});

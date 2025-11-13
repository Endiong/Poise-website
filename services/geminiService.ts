const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the GEMINI_API_KEY environment variable.")
}

export const ai = {
  chats: {
    create: () => null,
  },
}

export const getPostureTip = async (): Promise<string> => {
  if (!API_KEY) {
    return "Gemini API key not configured. Please contact support."
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Give me a single, short, actionable tip for improving my posture while sitting at a desk. The tip should be concise and easy to follow. Maximum 2 sentences.",
                },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate a tip."
    return text
  } catch (error) {
    console.error("Error fetching posture tip from Gemini:", error)
    return "Could not fetch a tip at the moment. Please try again later."
  }
}

export const sendMessage = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Gemini API key not configured. Please contact support."
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate a response."
    return text
  } catch (error) {
    console.error("Error sending message to Gemini:", error)
    throw error
  }
}

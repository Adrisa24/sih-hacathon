import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 in request body' });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ("AQ.Ab8RN6I6MbmuKQu" + "0ppTN3UKd9x5LFUxLX2u_4GuDVDeuCtjVZw");
    if (!apiKey) {
      console.error("Server is missing Gemini API key.");
      return res.status(500).json({ error: 'Server misconfiguration: Missing API Key' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a safety AI analyzing a physical H2S colorimetric test strip. 
The strip is rectangular and usually placed inside a white circular holder. It may be shown at any angle.

Analyze the surface of the strip. Use the following 7-level color scale as a loose, flexible guide. Do NOT require exact hex matches, as camera lighting, shadows, and screen glare will alter the colors. Just predict and confidently estimate the closest level based on the general visual appearance:
- Level 0 (Fresh): Yellow/Bright Yellow. 0 ppm. Status: Safe.
- Level 1 (Minimal): Yellow-orange. 5 ppm. Status: Safe.
- Level 2 (Early): Orange-yellow. 10 ppm. Status: Warning.
- Level 3 (Noticeable): Orange. 15 ppm. Status: Warning.
- Level 4 (Strong): Orange-brown. 20 ppm. Status: Warning.
- Level 5 (Severe): Brown. 50 ppm. Status: Danger.
- Level 6 (Extreme): Dark brown/Black. 100+ ppm. Status: Danger.

NOTE: The reaction may appear as a uniform color change OR as speckles/spots of these darker colors on a yellow background. Be highly forgiving of photo quality and estimate the severity based on the darkest dominant reaction colors present.

IMPORTANT INSTRUCTION: If you do NOT clearly see the rectangular strip in the image, you MUST return exactly this JSON:
{
  "ppm": null,
  "status": "No Strip Detected",
  "actions": "Please rescan with the H2S strip clearly visible in the camera frame."
}

Otherwise, output your best flexible prediction in ONLY a valid JSON object with no markdown formatting:
{
  "ppm": <number>,
  "status": "<Safe | Warning | Danger>",
  "actions": "<Precautions/Actions to take based on status>"
}`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
    ]);
    
    let text = result.response.text().trim();
    
    // Robust regex to extract JSON block even if Gemini hallucinates surrounding text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    } else {
      throw new Error("Could not find JSON block in AI response.");
    }

    const parsed = JSON.parse(text);

    // If no strip detected, pass it forward
    if (parsed.status === "No Strip Detected") {
      return res.status(200).json(parsed);
    }
    
    // Validate schema softly
    if (typeof parsed.ppm !== 'number' || !parsed.status || !parsed.actions) {
      throw new Error("AI returned malformed JSON schema.");
    }

    res.status(200).json(parsed);

  } catch (err) {
    console.error("Gemini Backend Error:", err);
    res.status(200).json({ 
      ppm: 0, 
      status: "Unknown", 
      actions: "Error analyzing strip. Camera feed unreadable or AI failure.",
      error: err.message
    });
  }
}

import openai from '../openaiClient';

export async function screenshotService(base64Image: string): Promise<{
  title: string;
  company: string;
  location: string;
  salary_range: string;
  screenshot_url: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract job details from this image. Return a raw JSON object (no markdown, no backticks) with these exact keys: Job Title, Company Name, Location, Salary Range. Use empty strings for missing fields. Example format: {\"Job Title\": \"Software Engineer\",\"Company Name\": \"Example Corp\",\"Location\": \"San Francisco, CA\",\"Salary Range\": \"$120,000-$180,000\"}"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const content = response.choices[0].message?.content || "";
    
    // Remove any markdown formatting or extra whitespace
    const jsonStr = content.replace(/```json|```|\n/g, "").trim();
    
    const result = JSON.parse(jsonStr);
    
    return {
      title: result["Job Title"] || "",
      company: result["Company Name"] || "",
      location: result["Location"] || "",
      salary_range: result["Salary Range"] || "",
      screenshot_url: base64Image // Store the original image
    };
  } catch (err) {
    console.error("Screenshot processing error:", err);
    return {
      title: "",
      company: "",
      location: "",
      salary_range: "",
      screenshot_url: ""
    };
  }
}

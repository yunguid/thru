import client from '../openaiClient';
import debug from 'debug';

const log = debug('arkon:screenshot');

export async function screenshotService(base64Image: string) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract job details from this image. Return ONLY a clean JSON object with these exact keys: Job Title, Company Name, Location, Salary Range. Use empty strings for missing fields. Return in exactly this format, with no additional text or formatting:\n{\"Job Title\": \"Software Engineer\",\"Company Name\": \"Example Corp\",\"Location\": \"San Francisco, CA\",\"Salary Range\": \"$120,000-$180,000\"}"
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
      max_tokens: 500
    });

    const text = response.choices[0].message?.content?.trim() || '{}';
    log('OpenAI Response:', text);
    
    try {
      const json = JSON.parse(text);
      return {
        title: json['Job Title'] || '',
        company: json['Company Name'] || '',
        location: json['Location'] || '',
        salary_range: json['Salary Range'] || '',
        screenshot_url: base64Image,
      };
    } catch (err) {
      log("Error parsing JSON response:", err);
      return {
        title: '',
        company: '',
        location: '',
        salary_range: '',
        screenshot_url: '',
      };
    }
  } catch (err) {
    log("Screenshot analysis error:", err);
    return {
      title: '',
      company: '',
      location: '',
      salary_range: '',
      screenshot_url: '',
    };
  }
}

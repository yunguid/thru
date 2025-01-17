import { openai } from '../openaiClient';

export async function coverLetterService(jobTitle: string, company: string, location: string): Promise<string> {
  const systemPrompt = `
You are an AI that writes a concise, professional cover letter in plain text. The user is applying for a role at ${company}, located in ${location}, with the title "${jobTitle}".
Please keep it formal, 2 paragraphs, mention some strong skill or experience in synergy with the role. Return just the raw text, no markdown or LaTeX.
`;
  try {
    const response = await openai.chat.completion.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt }
      ],
    });
    const text = completion.choices[0].message?.content || "Cover letter generation failed.";
    return text;
  } catch (err) {
    console.error("Cover letter generation error:", err);
    return "An error occurred while generating your cover letter.";
  }
}

import { groq } from '@/lib/groq/client';
import { openai } from '@/lib/openai/client';
import { ParsedResume, EvaluationResult } from '@/types/resume';

export async function parseResumeWithAI(text: string): Promise<ParsedResume> {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an expert HR assistant. Your task is to extract structured data from the provided resume text. 
        Return ONLY a JSON object that matches this exact schema:
        {
          "personalInfo": {
            "fullName": "string",
            "email": "string",
            "phone": "string",
            "location": "string"
          },
          "skills": ["string"],
          "experience": [
            {
              "company": "string",
              "role": "string",
              "duration": "string",
              "description": "string"
            }
          ],
          "education": [
            {
              "institution": "string",
              "degree": "string",
              "year": "string"
            }
          ]
        }`,
      },
      {
        role: 'user',
        content: `Extract resume data from this text: \n\n${text}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  try {
    const rawContent = response.choices[0].message.content || '{}';
    return JSON.parse(rawContent) as ParsedResume;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('AI failed to generate a valid structured resume.');
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  // Fallback for missing or placeholder API key
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key') {
    console.warn('OpenAI API Key is missing or placeholder. Using mock embedding.');
    return new Array(1536).fill(0);
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Embedding generation failed:', error);
    return new Array(1536).fill(0);
  }
}

export async function evaluateApplication(
  resumeData: ParsedResume,
  jobDescription: string
): Promise<EvaluationResult> {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an expert recruiter. Evaluate the candidate based on their resume and the job description. 
        Provide a match score (0-100), key strengths (2-3 points), key gaps (2-3 points), and a final recommendation.
        Return ONLY a JSON object:
        {
          "score": number,
          "strengths": ["string", "string"],
          "gaps": ["string", "string"],
          "recommendation": "Strong Fit" | "Moderate Fit" | "Not Fit"
        }`,
      },
      {
        role: 'user',
        content: `Job Description: ${jobDescription}\n\nResume: ${JSON.stringify(resumeData)}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  try {
    const rawContent = response.choices[0].message.content || '{}';
    return JSON.parse(rawContent) as EvaluationResult;
  } catch (error) {
    console.error('Failed to parse AI evaluation:', error);
    throw new Error('AI failed to generate a valid match analysis.');
  }
}

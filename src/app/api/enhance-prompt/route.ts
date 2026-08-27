import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { checkRateLimit, getSecondsUntilUTCMidnight } from '@/lib/rate-limit';

const ENHANCER_IP_LIMIT = parseInt(process.env.ENHANCE_DAILY_IP_LIMIT || '10', 10);
const ENHANCER_GLOBAL_LIMIT = parseInt(process.env.ENHANCE_DAILY_GLOBAL_LIMIT || '100', 10);

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // 1. Check Rate Limit
    const limitResult = await checkRateLimit({
      ip,
      endpoint: 'prompt_enhance',
      ipLimit: ENHANCER_IP_LIMIT,
      globalLimit: ENHANCER_GLOBAL_LIMIT,
    });

    if (!limitResult.allowed) {
      return new Response(
        JSON.stringify({
          error:
            limitResult.reason === 'global_limit'
              ? 'The AI enhancer is temporarily unavailable. Please try again later.'
              : "You have reached today's prompt enhancement limit. Try again tomorrow.",
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': getSecondsUntilUTCMidnight().toString(),
          },
        },
      );
    }

    // 2. Parse and Validate Request
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Prompt is required.' }), { status: 400 });
    }

    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length === 0 || trimmedPrompt.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Prompt must be between 1 and 200 characters.' }),
        { status: 400 },
      );
    }

    // 3. Enhance with Gemini
    const systemPrompt = `You are a professional prompt engineer for a text-to-image AI (Stable Diffusion/FLUX). 
Your task is to take a simple user prompt and expand it into a highly detailed, descriptive, and visually striking prompt to generate a high-quality image.

Strict Rules:
- Preserve the exact number of requested subjects. DO NOT add extra characters.
- Preserve any specified left/right composition.
- DO NOT add unsupported personal information, contact details, facts, or hallucinated achievements.
- Remove meaningless claims like "8k resolution", "masterpiece", "trending on artstation".
- Return ONLY the enhanced prompt string. Do not include quotes, conversational text, or prefixes. Keep the enhanced prompt under 400 characters.

Structure the prompt exactly as follows, separated by commas:
1. Exact number of subjects
2. Composition and position
3. Subject appearance (clothing, expression, details)
4. Lighting and environment
5. Style (e.g., cinematic, anime, realistic)
6. Negative constraints: no duplicates, no extra limbs, no text, no watermark`;

    const result = await generateText({
      model: google('gemini-3.5-flash-lite'),
      system: systemPrompt,
      prompt: trimmedPrompt,
      maxOutputTokens: 150,
      temperature: 0.7,
    });

    const enhancedPrompt = result.text.trim();

    return new Response(JSON.stringify({ enhancedPrompt }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Enhance Prompt API Error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while enhancing the prompt.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

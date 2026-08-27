import { checkRateLimit, getSecondsUntilUTCMidnight } from '@/lib/rate-limit';

const IMAGE_IP_LIMIT = 20;
const IMAGE_GLOBAL_LIMIT = parseInt(process.env.IMAGE_DAILY_GLOBAL_LIMIT || '50', 10);

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // 1. Check Rate Limit (consumes the slot before hitting the provider)
    const limitResult = await checkRateLimit({
      ip,
      endpoint: 'generate_image',
      ipLimit: IMAGE_IP_LIMIT,
      globalLimit: IMAGE_GLOBAL_LIMIT,
    });

    if (!limitResult.allowed) {
      return new Response(
        JSON.stringify({
          error:
            limitResult.reason === 'global_limit'
              ? 'The AI Image Generator is temporarily unavailable due to high global demand. Please try again later.'
              : "You have reached today's image-generation limit. Try again tomorrow.",
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
    if (trimmedPrompt.length === 0 || trimmedPrompt.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Prompt must be between 1 and 500 characters.' }),
        { status: 400 },
      );
    }

    // 3. Environment Variables Check
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const model =
      process.env.CLOUDFLARE_IMAGE_MODEL || '@cf/stabilityai/stable-diffusion-xl-base-1.0';

    if (!accountId || !apiToken) {
      console.error('Missing Cloudflare credentials');
      return new Response(JSON.stringify({ error: 'Image generation service is misconfigured.' }), {
        status: 500,
      });
    }

    // 4. Call Cloudflare Workers AI with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const cloudflareRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: trimmedPrompt, num_steps: 20 }),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!cloudflareRes.ok) {
        // Do not expose raw provider errors
        console.error('Cloudflare AI Error:', cloudflareRes.status);
        return new Response(
          JSON.stringify({
            error: 'Image provider failed to generate the image. Please try a different prompt.',
          }),
          { status: 502 },
        );
      }

      // 5. Return Image Buffer with cache headers preventing storage
      return new Response(cloudflareRes.body, {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return new Response(JSON.stringify({ error: 'Request to image provider timed out.' }), {
          status: 504,
        });
      }
      throw fetchError;
    }
  } catch (error: unknown) {
    console.error('Generate Image API Error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred while generating the image.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

import type { Context } from '@netlify/functions'

const PROMPT =
  'Da un consejo o reflexión corta (máximo 2 frases, sin comillas ni prefijos) sobre la espera, la ilusión por lo que viene, ' +
  'aprovechar el tiempo o no perder de vista las fechas importantes. ' +
  'Tono cercano y positivo, en español, sin emojis. Varíalo cada vez, no repitas frases genéricas típicas.'

export default async (req: Request, _context: Context) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'missing_api_key' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{ role: 'user', content: PROMPT }],
      }),
    })

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'upstream_error' }), {
        status: 502,
        headers: { 'content-type': 'application/json' },
      })
    }

    const data = await res.json()
    const tip = data?.content?.[0]?.text?.trim()
    if (!tip) {
      return new Response(JSON.stringify({ error: 'empty_response' }), {
        status: 502,
        headers: { 'content-type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ tip }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'request_failed' }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    })
  }
}

export const config = { path: '/api/daily-tip' }

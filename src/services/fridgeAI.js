const ENDPOINT = '/api/anthropic/v1/messages'

function buildPrompt(userText, existingItems) {
  const existing = existingItems.length > 0
    ? `\n\nItems already in the fridge: ${existingItems.map(i => `${i.emoji} ${i.name}`).join(', ')}.`
    : ''

  return `You are a fridge inventory assistant. Parse the user's message to extract food items and suggest recipes.
${existing}

User says: "${userText}"

Tasks:
1. Extract all food items mentioned by the user
2. Classify each as "sweet"fruits, desserts, sweets, honey, chocolate, jam, sugar, berries) or "savory" (meat, fish, vegetables, dairy, eggs, grains, condiments, herbs, spices, pasta, rice)
3. Assign a fitting food emoji to each item
4. Suggest 2-4 recipes using the available ingredients (new + existing if any). Make them realistic.
5. Classify each recipe as "sweet" or "savory"
6. List which ingredient names each recipe uses in "usesItems"

Return ONLY valid JSON with no markdown fences or extra text:
{
  "newItems": [
    {"name": "apple", "category": "sweet", "emoji": "🍎"},
    {"name": "chicken breast", "category": "savory", "emoji": "🍗"}
  ],
  "recipes": [
    {
      "name": "Apple Crumble",
      "category": "sweet",
      "description": "Warm baked apple dessert with a crispy oat topping",
      "usesItems": ["apple"]
    },  
    {
      "name": "Grilled Chicken",
      "category": "savory",
      "description": "Simple herb-seasoned grilled chicken breast",
      "usesItems": ["chicken breast"]
    }
  ]
}`
}

export async function analyzeFridgeInput(userText, existingItems = []) {
  const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
  const geminiModel = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-chat'
  const geminiApiPath = import.meta.env.VITE_GEMINI_API_PATH
  const geminiApiPaths = geminiApiPath
    ? [geminiApiPath.startsWith('/') ? geminiApiPath : `/${geminiApiPath}`]
    : ['/v1', '/v1beta2', '/v1alpha2']
  const provider = geminiKey ? 'gemini' : 'anthropic'
  const apiKey = geminiKey || anthropicKey

  if (!apiKey) {
    throw new Error('API key missing. Create a .env file with VITE_GEMINI_API_KEY=your_key or VITE_ANTHROPIC_API_KEY=your_key')
  }

  const useBearerToken = provider === 'gemini' && /^ya29\.|^Bearer\s+/i.test(apiKey)
  const endpoint = provider === 'gemini'
    ? `/api/gemini${geminiApiPath}/models/${geminiModel}:predict${useBearerToken ? '' : `?key=${encodeURIComponent(apiKey)}`}`
    : ENDPOINT

  const headers = provider === 'anthropic'
    ? {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    }
    : {
      'Content-Type': 'application/json',
      ...(useBearerToken ? { Authorization: apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}` } : {}),
    }

  const body = provider === 'anthropic'
    ? JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: buildPrompt(userText, existingItems) }],
    })
    : JSON.stringify({
      instances: [
        {
          content: [
            { type: 'text', text: buildPrompt(userText, existingItems) },
          ],
        },
      ],
      parameters: {
        temperature: 0.35,
        maxOutputTokens: 1024,
      },
    })
  async function sendGeminiRequest(apiPath) {
    const endpoint = `/api/gemini${apiPath}/models/${geminiModel}:predict${useBearerToken ? '' : `?key=${encodeURIComponent(apiKey)}`}`
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body,
    })
    return { res, endpoint }
  }

  let response
  if (provider === 'gemini') {
    let lastError = null
    for (const apiPath of geminiApiPaths) {
      const { res, endpoint: triedEndpoint } = await sendGeminiRequest(apiPath)
      if (res.ok) {
        response = res
        break
      }
      const msg = await res.text()
      if (res.status === 404) {
        lastError = new Error(
          `Gemini endpoint not found (404) at ${triedEndpoint}. ` +
          `Try setting VITE_GEMINI_API_PATH or using a different model path.`
        )
        continue
      }
      if (res.status === 401 || res.status === 403) {
        throw new Error(
          `Gemini authentication failed (${res.status}). ` +
          `Verify VITE_GEMINI_API_KEY and that the key has access to the Gemini API. ` +
          `Response snippet: ${msg.slice(0, 240)}`
        )
      }
      throw new Error(`AI error ${res.status}: ${msg.slice(0, 300)}`)
    }
    if (!response) {
      if (anthropicKey) {
        response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            messages: [{ role: 'user', content: buildPrompt(userText, existingItems) }],
          }),
        })
      } else {
        throw lastError || new Error('Gemini request failed and no Anthropic fallback key is configured.')
      }
    }
  } else {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers,
      body,
    })
  }

  if (!response.ok) {
    const msg = await response.text()
    throw new Error(`AI error ${response.status}: ${msg.slice(0, 300)}`)
  }

  const data = await response.json()
  const text = provider === 'anthropic'
    ? data.content?.[0]?.text ?? ''
    : data.predictions?.[0]?.content
      ? data.predictions[0].content.map(part => part.text || '').join('')
      : data.predictions?.[0]?.text ?? ''

  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Could not parse AI response as JSON')
  return JSON.parse(match[0])
}

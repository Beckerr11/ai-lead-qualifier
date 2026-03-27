export function createOpenAILeadSummaryProvider(options = {}) {
  const apiKey = String(options.apiKey || '').trim()
  const model = String(options.model || 'gpt-4.1-mini')
  const baseUrl = String(options.baseUrl || 'https://api.openai.com/v1')

  if (!apiKey) {
    return async function disabledProvider() {
      return ''
    }
  }

  return async function openAIProvider(lead) {
    const prompt = [
      `Nome: ${lead.name}`,
      `Empresa: ${lead.company || 'nao informada'}`,
      `Score: ${lead.score}`,
      `Tier: ${lead.tier}`,
      `Acao sugerida: ${lead.nextAction}`,
      'Gere um resumo comercial de 1 frase em portugues.',
    ].join('\n')

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'Voce resume leads para equipe comercial.' },
          { role: 'user', content: prompt },
        ],
      }),
    })

    if (!response.ok) {
      return ''
    }

    const payload = await response.json()
    const message = payload?.choices?.[0]?.message?.content
    if (typeof message === 'string') {
      return message.trim()
    }

    return ''
  }
}
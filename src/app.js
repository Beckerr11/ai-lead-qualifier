import { randomUUID } from 'node:crypto'

export function createStore() {
  return { leads: [] }
}

export function calculateLeadScore({ budget = 0, urgency = 'low', teamSize = 1, source = 'organic' }) {
  let score = 0

  if (budget >= 15000) score += 35
  else if (budget >= 8000) score += 25
  else if (budget >= 3000) score += 12
  else score += 5

  if (urgency === 'high') score += 30
  else if (urgency === 'medium') score += 18
  else score += 8

  if (teamSize >= 50) score += 20
  else if (teamSize >= 10) score += 12
  else score += 6

  if (source === 'referral') score += 15
  else if (source === 'linkedin') score += 10
  else if (source === 'ads') score += 8
  else score += 5

  return Math.min(score, 100)
}

export function leadTier(score) {
  if (score >= 75) return 'hot'
  if (score >= 50) return 'warm'
  return 'cold'
}

export function recommendedAction(tier) {
  if (tier === 'hot') return 'Ligar em ate 30 minutos e enviar proposta.'
  if (tier === 'warm') return 'Agendar reuniao de descoberta em 24h.'
  return 'Nutrir com conteudo e reavaliar em 7 dias.'
}

export function createLead(store, payload) {
  const name = String(payload.name || '').trim()
  const email = String(payload.email || '').trim().toLowerCase()

  if (!name || !email) {
    throw new Error('name e email sao obrigatorios')
  }

  const score = calculateLeadScore(payload)
  const tier = leadTier(score)

  const lead = {
    id: randomUUID(),
    name,
    email,
    company: String(payload.company || '').trim(),
    budget: Number(payload.budget || 0),
    urgency: String(payload.urgency || 'low'),
    teamSize: Number(payload.teamSize || 1),
    source: String(payload.source || 'organic'),
    score,
    tier,
    nextAction: recommendedAction(tier),
    createdAt: new Date().toISOString(),
  }

  store.leads.push(lead)
  return lead
}

export function topLeads(store, limit = 5) {
  return [...store.leads]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'content-type': 'application/json' })
  res.end(JSON.stringify(payload))
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      if (!chunks.length) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(new Error('JSON invalido'))
      }
    })
    req.on('error', reject)
  })
}

export function createApp(store = createStore()) {
  return async function app(req, res) {
    const url = new URL(req.url || '/', 'http://localhost')

    try {
      if (req.method === 'GET' && url.pathname === '/health') {
        sendJson(res, 200, { ok: true, service: 'ai-lead-qualifier' })
        return
      }

      if (req.method === 'POST' && url.pathname === '/leads') {
        const payload = await readJsonBody(req)
        const lead = createLead(store, payload)
        sendJson(res, 201, { lead })
        return
      }

      if (req.method === 'GET' && url.pathname === '/leads') {
        sendJson(res, 200, { leads: store.leads })
        return
      }

      if (req.method === 'GET' && url.pathname === '/leads/top') {
        sendJson(res, 200, { leads: topLeads(store) })
        return
      }

      sendJson(res, 404, { error: 'rota nao encontrada' })
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : 'erro inesperado' })
    }
  }
}
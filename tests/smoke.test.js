import test from 'node:test'
import assert from 'node:assert/strict'
import { createStore, createLead, topLeads, summarizeLead } from '../src/app.js'

test('lead scoring ranks hot leads on top', () => {
  const store = createStore()

  createLead(store, {
    name: 'Lead Frio',
    email: 'frio@example.com',
    budget: 1000,
    urgency: 'low',
    teamSize: 2,
    source: 'ads',
  })

  createLead(store, {
    name: 'Lead Quente',
    email: 'quente@example.com',
    budget: 20000,
    urgency: 'high',
    teamSize: 80,
    source: 'referral',
  })

  const [first] = topLeads(store)
  assert.equal(first.tier, 'hot')
  assert.equal(first.email, 'quente@example.com')
})

test('lead deduplication and summary generation', async () => {
  const store = createStore()
  const lead = createLead(store, {
    name: 'Lead Um',
    email: 'lead@example.com',
    budget: 6000,
    urgency: 'medium',
  })

  assert.throws(
    () => createLead(store, { name: 'Duplicado', email: 'lead@example.com' }),
    /ja existe/
  )

  const summarized = await summarizeLead(store, lead.id)
  assert.ok(summarized.summary.includes('score'))
})

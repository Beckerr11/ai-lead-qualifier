import test from 'node:test'
import assert from 'node:assert/strict'
import { createStore, createLead, topLeads } from '../src/app.js'

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
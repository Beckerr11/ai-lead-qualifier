import { createApp, createStore } from '../src/app.js'
import { createOpenAILeadSummaryProvider } from '../src/integrations/openaiProvider.js'

const store = globalThis.__leadQualifierStore || (globalThis.__leadQualifierStore = createStore())
const provider = createOpenAILeadSummaryProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL,
  baseUrl: process.env.OPENAI_BASE_URL,
})

const app = createApp(store, { provider })

export default app

import http from 'node:http'
import { createApp, createStore } from './app.js'
import { createOpenAILeadSummaryProvider } from './integrations/openaiProvider.js'

const port = Number(process.env.PORT || 3000)
const provider = createOpenAILeadSummaryProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL,
  baseUrl: process.env.OPENAI_BASE_URL,
})
const app = createApp(createStore(), { provider })

http.createServer(app).listen(port, () => {
  console.log(`ai-lead-qualifier running on port ${port}`)
})

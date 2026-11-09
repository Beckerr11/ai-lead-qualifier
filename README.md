# AI Lead Qualifier

![CI](https://github.com/Beckerr11/ai-lead-qualifier/actions/workflows/ci.yml/badge.svg)

Serviço Node.js para demonstrar um pipeline de qualificação comercial em que **o score é determinístico** e a IA é uma camada opcional de resumo — não a fonte de verdade da classificação.

Essa separação é intencional: a aplicação continua funcional e testável sem chave de API, enquanto um provider externo pode enriquecer a apresentação do lead.

## Pipeline implementado

1. recebe um lead;
2. normaliza nome/e-mail e rejeita duplicidade;
3. calcula score de `0–100` usando budget, urgência, tamanho de equipe e origem;
4. classifica o lead como `hot`, `warm` ou `cold`;
5. define uma próxima ação determinística;
6. opcionalmente gera um resumo de uma frase usando um provider;
7. usa fallback local quando o provider não existe ou não retorna conteúdo.

## Critérios do score

O score é código de negócio explícito e auditável — não um prompt oculto. Atualmente considera:

- faixa de orçamento;
- urgência;
- tamanho da equipe;
- origem (`referral`, `linkedin`, `ads` ou outras).

Isso torna a classificação reproduzível em testes e evita que uma indisponibilidade de IA altere a prioridade comercial.

## API

```text
GET  /health
POST /leads
GET  /leads
GET  /leads/top
POST /leads/:id/summarize
```

O armazenamento atual é em memória.

## Integração OpenAI opcional

O repositório possui um provider que pode chamar `POST /v1/chat/completions` quando recebe uma API key. O modelo padrão no adapter atual é `gpt-4.1-mini`, e o base URL também pode ser substituído para testes/adaptação.

Sem API key, o adapter retorna vazio e a aplicação usa um resumo local determinístico.

**Nenhuma chave deve ser commitada.** Configure credenciais apenas via ambiente/secret management no runtime.

## Executando

```bash
npm ci
npm test
npm run dev
```

## Arquitetura

```text
lead payload
   ↓
deterministic scoring
   ↓
tier + next action
   ↓
lead store
   ↓
summary request
   ├── optional provider (OpenAI adapter)
   └── deterministic local fallback
```

## Limites atuais

- armazenamento em memória;
- sem autenticação ou multi-tenant;
- sem CRM externo;
- score usa regras fixas e precisa de calibração com dados reais antes de orientar uma operação comercial;
- resumo de IA não é usado para alterar score/tier;
- não existe fila/retry/cost tracking para chamadas externas.

## Evolução natural

- persistência e histórico de mudanças;
- calibração de score por dados reais;
- auditoria de decisões;
- rate limiting e autenticação;
- fila/retry/circuit breaker do provider;
- métricas de custo/latência da IA;
- CRM/webhooks;
- avaliação de qualidade dos resumos.

## Qualidade

- testes automatizados;
- GitHub Actions CI;
- Dependabot;
- documentação de deploy, segurança e checklist de produção.

## Autor

**Becker**  
[GitHub](https://github.com/Beckerr11) · [Portfólio](https://github.com/Beckerr11)

# ai-lead-qualifier

![CI](https://github.com/Beckerr11/ai-lead-qualifier/actions/workflows/ci.yml/badge.svg)

Qualificador de leads com IA opcional.

## Objetivo
Este repositorio faz parte de uma trilha de portfolio profissional full stack, com foco em simplicidade, clareza e boas praticas.

## Stack
Node.js, lead scoring, provider OpenAI opcional

## Funcionalidades implementadas
- Score de lead por budget, urgencia e origem
- Classificacao por tier (hot/warm/cold)
- Resumo de lead com fallback local
- Provider OpenAI configuravel via env

## Como executar
~~~bash
npm ci
npm test
npm run dev
~~~

## Scripts uteis
- npm run dev, npm test

## Qualidade
- CI em .github/workflows/ci.yml
- Dependabot em .github/dependabot.yml
- Testes locais obrigatorios antes de merge

## Documentacao
- [Roadmap](docs/ROADMAP.md)
- [Checklist de producao](docs/PRODUCTION-CHECKLIST.md)
- [Contribuicao](CONTRIBUTING.md)
- [Seguranca](SECURITY.md)

## Status
- [x] Scaffold inicial
- [x] Base funcional com testes
- [ ] Deploy publico com observabilidade completa
- [ ] Versao 1.0.0 com demo publica

# ROADMAP.md

## Dia 1 — Descoberta + Arquitetura ✅ (este conjunto de documentos)
README, PRD, ARQUITETURA, DOMAIN, API, DATABASE, TESTING, ROADMAP.

## Dia 2 — Domínio + Fundação
- Estrutura de pastas do projeto Next.js.
- Configuração de ambiente (`.env`, variáveis).
- Setup do PostgreSQL + Prisma, primeira migração (schema de `DATABASE.md`).
- Entidades de domínio e interfaces de repositório.
- Configuração de lint, formatter e testes.
- CI inicial (lint + build + testes unitários).

## Dia 3 — Negócio principal
- Casos de uso: listar produtos, calcular preço de item, montar carrinho.
- Endpoints de produtos (`GET /api/products`, `GET /api/products/:id`).
- Persistência real via Prisma.
- Testes unitários e de integração cobrindo as regras do `DOMAIN.md`.

## Dia 4 — Integração
- Componente `ProductViewer3D` conectado aos dados reais do produto.
- Upload de logo (`POST /api/uploads/logo`) com validação e storage.
- Integração com Melhor Envio (`POST /api/shipping/quote`), incluindo
  tratamento de timeout, erro e indisponibilidade (diferente do rascunho
  original do processo — aqui o tratamento de erro é obrigatório, não
  opcional).
- Testes de integração do fluxo carrinho → frete.

## Dia 5 — Endurecimento
- Revisão de segurança do upload de arquivos.
- Revisão de tratamento de erros em todas as rotas de API.
- Eliminação de dados fixos/mockados que ainda restarem.
- Revisão de dependências e configuração.

## Dia 6 — Produção
- Dockerfile e (se aplicável) docker-compose para banco local.
- Variáveis de ambiente de produção, HTTPS, health check (`/api/health`).
- CI/CD para deploy.

## Dia 7 — Liberação + Validação
- Testes de fumaça e E2E completos nas jornadas do PRD.
- Deploy e validação em produção.
- Registro de limitações conhecidas e próximos passos.

## Escopo futuro (backlog, fora do MVP)

- Pagamento online (Mercado Pago/Stripe) — decisão pendente do usuário.
- Conta de cliente / login.
- Painel administrativo completo de catálogo.
- Editor gráfico avançado (reposicionar/redimensionar logo livremente).
- Identidade visual definitiva (nome, logo da empresa) — pode ser aplicada a
  qualquer momento sem impacto na arquitetura, já que o design usa paleta
  neutra e não depende de marca fixa.

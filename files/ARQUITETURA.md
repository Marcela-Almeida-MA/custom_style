# ARQUITETURA.md

## 1. Visão geral

Aplicação **Next.js** (App Router) full-stack: o mesmo projeto serve o
frontend React e as rotas de API (backend), evitando a complexidade de dois
repositórios/deploys separados no início do projeto. Banco de dados
relacional (PostgreSQL) via Prisma.

## 2. Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| Frontend | React + Next.js (App Router) | SSR/SEO para catálogo, um único projeto |
| 3D | react-three-fiber + three.js | Padrão para 3D declarativo em React |
| Estilo | Tailwind CSS | Consistência de paleta neutra, produtividade |
| Backend | Next.js API Routes / Route Handlers | Sem infraestrutura extra no MVP |
| Banco de dados | PostgreSQL | Relacional, adequado ao domínio (produtos, variações, pedidos) |
| ORM | Prisma | Migrações versionadas, tipagem forte |
| Frete | API Melhor Envio | Cobre Correios e outras transportadoras, API moderna |
| Upload de arquivos | Storage de objetos (ex.: S3-compatible) | Logos de clientes não ficam no banco |
| Testes | Vitest/Jest (unit/integração) + Playwright (E2E) | Padrão de mercado para stack Next.js |

## 3. Separação em camadas

```
src/
├── domain/            # Entidades e regras de negócio puras (sem framework)
│   ├── entities/
│   └── rules/
├── application/        # Casos de uso (orquestram domínio + infra)
│   └── use-cases/
├── infrastructure/     # Implementações concretas
│   ├── db/              # Prisma client, repositórios
│   ├── shipping/        # Cliente Melhor Envio
│   └── storage/         # Upload de logo
├── app/                # Next.js App Router (rotas, páginas, API routes)
├── components/          # React componentizado por domínio
│   ├── catalog/
│   ├── viewer3d/
│   ├── customizer/
│   └── cart/
└── tests/
```

Regra de dependência: `domain` não depende de nada. `application` depende de
`domain`. `infrastructure` implementa interfaces definidas em `application`/
`domain`. `app` e `components` consomem `application`.

## 4. Componentização do frontend

Componentes organizados por domínio, não por tipo técnico:

- `catalog/ProductCard`, `catalog/ProductList`
- `viewer3d/ProductViewer3D` — recebe `product`, `customization` (cor, textura)
  como props; troca apenas o modelo 3D conforme a categoria do produto.
- `customizer/ColorPicker`, `customizer/StampPicker`, `customizer/LogoUpload`
- `cart/CartSummary`, `cart/ShippingCalculator`

Isso permite adicionar uma nova categoria de produto (ex.: "boné") reutilizando
o mesmo `ProductViewer3D` e os mesmos componentes de customização, apenas
trocando o modelo 3D e a lista de cores/estampas disponíveis.

## 5. Decisões arquiteturais (ADR resumido)

**DECISÃO**: Usar Next.js full-stack em vez de frontend e backend separados.
**Contexto**: projeto novo, sem equipe grande, prioridade é entregar MVP rápido.
**Opções**: (a) Next.js fullstack; (b) React (Vite) + Node/Express separado.
**Escolhido**: (a).
**Razão**: menos infraestrutura para manter, SSR ajuda em SEO de e-commerce.
**Concessões**: menor flexibilidade se o backend precisar escalar
independente do frontend no futuro — aceitável para o estágio atual.
**Data**: 2026-09-15.

**DECISÃO**: Frete via Melhor Envio, não integração direta com Correios.
**Contexto**: necessidade de cobrir todos os estados do Brasil, com prazo e valor.
**Opções**: (a) API SIGEP/PrecoPrazo dos Correios direto; (b) Melhor Envio.
**Escolhido**: (b), por decisão do usuário.
**Razão**: API mais moderna e documentada, reduz esforço de integração.
**Concessões**: dependência de um serviço terceiro adicional.
**Data**: 2026-09-15.

**DECISÃO**: Pagamento online fora do MVP.
**Contexto**: usuário optou por decidir depois.
**Escolhido**: pedido é gerado sem cobrança online; registrado como
`ESCOPO_FUTURO`.
**Data**: 2026-09-15.

## 6. Observabilidade (planejada para o Dia 6)

Logs estruturados nas rotas de API, health check (`/api/health`), e
tratamento de erro centralizado — a ser implementado na fase de fundação.

## 7. Riscos arquiteturais

- Modelagem 3D por categoria de produto é o ponto de maior incerteza técnica
  — precisa de um spike antes de comprometer o cronograma.
- Falha ou lentidão da API Melhor Envio deve ter tratamento de erro e
  timeout definidos (a ser detalhado no Dia 4 — Integração).

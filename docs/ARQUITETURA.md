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
├── app/                # Adaptadores Next.js: páginas e endpoints HTTP
│   └── api/            # Backend HTTP (Route Handlers)
├── backend/            # Composição das dependências concretas do servidor
│   └── services.ts     # Ponto único que conecta casos de uso à infraestrutura
├── components/         # Frontend React, organizado por domínio
│   ├── catalog/
│   ├── viewer3d/
│   ├── customizer/
│   └── cart/
├── application/        # Casos de uso e portas (interfaces)
│   ├── ports/
│   └── use-cases/
├── domain/             # Entidades e regras puras, sem framework
│   ├── entities/
│   └── rules/
└── infrastructure/     # Implementações concretas das portas
    ├── db/             # Prisma client e repositórios
    ├── shipping/       # Cliente Melhor Envio
    └── storage/        # Armazenamento de arquivos
tests/                  # Testes de domínio, aplicação e adaptadores
```

Regra de dependência: `domain` não depende de outras camadas; `application`
depende apenas do domínio e declara suas portas; `infrastructure` implementa
essas portas. `backend/services.ts` é o ponto de composição que conhece as
implementações concretas. Os Route Handlers HTTP e a página do Next atuam como
adaptadores finos: validam/transformam entradas e chamam esses serviços, sem
instanciar Prisma ou integrações externas. O frontend visual em
`components/` continua isolado da infraestrutura e recebe dados por props ou
pelos endpoints HTTP.

A página inicial é um Server Component e consulta o serviço de catálogo pelo
ponto de composição do backend para manter a renderização inicial no servidor.
Isso mantém a separação das responsabilidades sem fazer uma chamada HTTP
interna desnecessária. A aplicação continua em um único projeto Next.js e pode
ser implantada como um único serviço; a separação aqui é arquitetural, não uma
separação de repositórios ou deploys.

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

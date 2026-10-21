# Plataforma de Personalização de Produtos Promocionais

> Nome e identidade visual da empresa ainda não definidos (placeholder: "ProjetoX").

## O que é

Site de e-commerce para personalização de produtos promocionais (camisetas, caixas,
sacolas e etiquetas empresariais), com visualização 3D em tempo real da peça
personalizada e cálculo automático de frete para todo o Brasil via Correios
(através do Melhor Envio).

## Documentos do projeto

| Documento | Conteúdo |
|---|---|
| [PRD.md](./PRD.md) | Requisitos de produto, personas, regras de negócio, escopo |
| [ARQUITETURA.md](./ARQUITETURA.md) | Stack, camadas, decisões técnicas |
| [DOMAIN.md](./DOMAIN.md) | Entidades e regras do domínio |
| [API.md](./API.md) | Contrato de endpoints |
| [DATABASE.md](./DATABASE.md) | Modelo de dados |
| [TESTING.md](./TESTING.md) | Estratégia de testes |
| [ROADMAP.md](./ROADMAP.md) | Plano de evolução em 7 dias |

## Stack (resumo)

- **Frontend/Backend**: Next.js (App Router), React componentizado
- **3D**: react-three-fiber / three.js
- **Banco de dados**: PostgreSQL + Prisma
- **Frete**: API Melhor Envio (cobre Correios e outras transportadoras)
- **Pagamento**: fora do MVP (registrado como `ESCOPO_FUTURO`)

## Status atual

Fase: **Dia 3 — Negócio principal**. O domínio, casos de uso, endpoints de
produtos e repositórios Prisma estão implementados; validações automatizadas e
configuração da migração/banco ainda precisam ser concluídas antes de considerar
esta fase pronta.

## Como rodar

Pré-requisitos: Node.js 20+, PostgreSQL rodando localmente (ou acessível).

```bash
npm install
cp .env.example .env   # preencher DATABASE_URL e MELHOR_ENVIO_TOKEN
npm run prisma:migrate  # cria as tabelas a partir de prisma/schema.prisma
npm run dev              # http://localhost:3000
```

Outros comandos:

```bash
npm run lint    # ESLint
npm run format  # Prettier
npm test        # testes unitários (Vitest)
npm run build   # build de produção
```

> Nota: os comandos acima não foram executados dentro do ambiente de geração
> deste código (sem acesso à rede para instalar dependências). A lógica de
> domínio foi validada separadamente com `tsc` + `node` — ver commit/registro
> de validação. Rode os comandos acima localmente antes do primeiro uso.

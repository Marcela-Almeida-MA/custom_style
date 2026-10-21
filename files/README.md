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

Fase: **Dia 1 — Descoberta e Arquitetura**. Nenhum código de aplicação foi
implementado ainda. Este é o conjunto de documentos base antes da fundação
técnica (Dia 2).

## Como rodar (será preenchido no Dia 2)

Instruções de setup local, variáveis de ambiente e comandos de desenvolvimento
serão adicionadas quando a fundação do projeto (estrutura de pastas,
configuração, banco) for criada.

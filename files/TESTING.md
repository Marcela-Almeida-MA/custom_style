# TESTING.md

## Filosofia

Vermelho → Verde → Refator, sempre que viável. Testes são contrato: nunca se
altera um teste apenas porque a implementação atual não passa nele — primeiro
se avalia se o requisito mudou ou se o teste está errado.

## Camadas de teste

### 1. Testes unitários (domínio e aplicação)
- Ferramenta: Vitest.
- Cobrem: regras de negócio puras (`domain/`) e casos de uso
  (`application/`) — ex.: "não pode ter estampa e logo ao mesmo tempo no
  mesmo item", "preço unitário é fixado na adição ao carrinho".
- Sem dependência de banco ou rede — usam fakes/mocks das interfaces de
  infraestrutura.

### 2. Testes de integração
- Ferramenta: Vitest + banco de testes real (PostgreSQL em container) ou
  Prisma com banco de teste dedicado.
- Cobrem: repositórios Prisma, rotas de API (`app/api/**`), integração com
  Melhor Envio (com HTTP mockado — nunca bater na API real em CI).

### 3. Testes E2E
- Ferramenta: Playwright.
- Cobrem as jornadas principais do PRD:
  - navegar catálogo → escolher produto → personalizar → ver preview 3D
    atualizado → adicionar ao carrinho → informar CEP → ver frete → confirmar
    pedido.
- Rodam contra um ambiente de staging ou build local antes de release.

## O que NÃO fazer (regra contra "teste verde falso")

- Não remover asserções para fazer o teste passar.
- Não comentar/pular teste sem justificativa registrada.
- Não mockar a integração de frete nos testes E2E principais — pelo menos um
  cenário deve validar o fluxo real (ou um ambiente sandbox do Melhor Envio,
  se disponível).

## Cobertura mínima esperada por funcionalidade nova

Toda funcionalidade nova no domínio ou aplicação entra com teste
correspondente antes de ser considerada concluída (Definição de Feito).

## CI

Pipeline mínimo: lint → build → testes unitários → testes de integração →
(E2E em pipeline separado, mais lento). Falha em qualquer etapa bloqueia o
merge.

# PRD — Product Requirements Document

## 1. Problema

Empresas e pessoas físicas que querem produtos promocionais personalizados
(camisetas, caixas, sacolas, etiquetas) hoje dependem de gráficas locais, com
orçamento manual, sem visualização prévia confiável do resultado e sem
transparência de frete antes de fechar o pedido.

## 2. Objetivo do produto

Permitir que o cliente escolha um produto, personalize (cor, estampa do
catálogo ou logo próprio), visualize o resultado em 3D antes de comprar, e
finalize o pedido com frete calculado automaticamente para qualquer estado do
Brasil.

## 3. Partes interessadas

- **Dono do negócio** (você): define catálogo, preços, regras comerciais.
- **Cliente final**: pessoa física ou empresa comprando produtos personalizados.
- **Operação/produção**: quem recebe o pedido e produz fisicamente o item
  (fora do escopo do software por enquanto — recebe o pedido já especificado).

## 4. Personas

### Persona 1 — Empresa pequena/média (B2B)
Quer camisetas, sacolas ou etiquetas com a logo da própria empresa, em
quantidade, para uso interno ou brindes. Sensível a prazo de entrega e frete.

### Persona 2 — Consumidor final (B2C)
Quer uma camiseta personalizada com estampa do catálogo ou cor específica,
compra em quantidade baixa (1 a 5 unidades).

## 5. Casos de uso principais

1. Navegar catálogo de produtos por categoria (camiseta, caixa, sacola, etiqueta).
2. Escolher um produto e abrir o personalizador.
3. Personalizar: selecionar cor base, selecionar estampa do catálogo **ou**
   fazer upload de logo próprio, ver preview 3D atualizado em tempo real.
4. Definir quantidade e adicionar ao carrinho.
5. No carrinho, informar CEP e visualizar opções de frete (com prazo e valor)
   via Correios/Melhor Envio.
6. Finalizar pedido (sem pagamento online no MVP — gera pedido/orçamento).
7. (Empresa) Cadastrar/gerenciar produtos e preços — área administrativa simples.

## 6. Requisitos funcionais

- RF01: Listar produtos por categoria com imagens e preço base.
- RF02: Exibir visualização 3D do produto selecionado.
- RF03: Permitir customização de cor a partir de uma paleta pré-definida por produto.
- RF04: Permitir escolha de estampa entre opções pré-cadastradas no catálogo.
- RF05: Permitir upload de logo/arquivo próprio do cliente (imagem), com
  validação de formato (PNG/JPG/SVG) e tamanho máximo.
- RF06: Aplicar a customização escolhida (cor, estampa ou logo) como textura
  no modelo 3D em tempo real.
- RF07: Carrinho com itens, quantidade, valor unitário e total.
- RF08: Cálculo de frete por CEP, cobrindo todos os estados do Brasil, via
  integração com Melhor Envio.
- RF09: Resumo do pedido (valor produtos + frete) antes da confirmação.
- RF10: Confirmação de pedido (sem cobrança online no MVP).

## 7. Requisitos não funcionais

- RNF01: Interface responsiva (mobile e desktop).
- RNF02: Visual limpo, paleta de cores neutras, sem depender de marca definida.
- RNF03: Tempo de resposta do preview 3D deve permanecer fluido (sem travar a
  interação ao trocar cor/estampa).
- RNF04: Cálculo de frete deve cobrir os 27 estados brasileiros.
- RNF05: Upload de logo deve ser validado no cliente e no servidor (tipo e
  tamanho de arquivo).
- RNF06: Código componentizado em React, para permitir manutenção e adição de
  novos tipos de produto sem reescrever o personalizador.

## 8. Regras de negócio

- Cada categoria de produto (camiseta, caixa, sacola, etiqueta) tem seu
  próprio conjunto de cores e estampas disponíveis — nem toda estampa serve
  para todo produto.
- Upload de logo próprio é sempre permitido como alternativa às estampas do
  catálogo, para qualquer categoria de produto.
- O frete é calculado sempre sobre o pedido completo (não item a item), pelo
  CEP de destino informado.
- Preço final = soma dos preços unitários (produto + eventual custo de
  personalização, se houver) × quantidade, mais frete.

## 9. Fora do escopo (MVP)

- Pagamento online (cartão, Pix, boleto) — `ESCOPO_FUTURO`.
- Login/conta de usuário — `ESCOPO_FUTURO` (pedido pode ser feito por
  formulário de contato/dados no MVP).
- Painel avançado de gestão de produção/estoque.
- Edição avançada tipo "editor gráfico" (arrastar textos, redimensionar logo
  livremente) — no MVP a logo é aplicada em posição/área fixa por produto.
- Multi-idioma.

## 10. Riscos identificados

- **Complexidade do 3D**: aplicar textura de logo do cliente de forma
  realista em modelos diferentes (camiseta, caixa, sacola) exige um modelo 3D
  e um mapeamento de textura (UV) específico por produto — risco de esforço
  subestimado.
- **Dependência externa (Melhor Envio)**: indisponibilidade ou mudança de
  API pode impactar o cálculo de frete; precisa de tratamento de erro e
  fallback (ex.: "frete a calcular" manual).
- **Sem marca definida**: pode atrasar a etapa visual final (logo, nome,
  domínio), mas não bloqueia a arquitetura nem o desenvolvimento funcional.
- **Upload de arquivos de cliente**: risco de segurança (arquivos maliciosos)
  — exige validação de tipo/tamanho e armazenamento seguro.

## 11. Métrica de sucesso do MVP

Um cliente consegue, sem ajuda, escolher um produto, personalizá-lo, ver o
preview 3D, calcular o frete para o seu CEP e enviar um pedido — de ponta a
ponta, sem erros.

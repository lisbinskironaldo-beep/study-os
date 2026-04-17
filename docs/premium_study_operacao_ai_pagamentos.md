# STUDY OS - PREMIUM STUDY - OPERAÇÃO, IA, ACESSOS E PAGAMENTOS

Documento oficial da frente operacional.

Status:
- vigente
- complementar
- subordinado a `docs/premium_study_constituicao_produto.md`

Atualizado em 2026-04-14.

---

## 1. Missão deste documento

Definir como o produto vai:

- usar IA externa com excelência e baixo custo
- controlar acessos
- receber pagamentos
- liberar planos
- estimular divulgação orgânica

Regra:

```txt
o produto deve parecer premium para o aluno
sem depender de uma operação cara e descontrolada
```

---

## 2. Modelo oficial de acesso do usuário

Estados de acesso autorizados:

- `guest`
- `registered_free`
- `trial`
- `premium_active`
- `premium_grace`
- `premium_past_due`
- `premium_cancelled`

### Guest

Pode:

- ver a landing
- ver o exemplo guiado
- iniciar o fluxo até certo ponto

Não pode:

- salvar plano real
- consumir recursos premium completos

### Registered free

Pode:

- criar conta
- testar o fluxo básico
- subir 1 material ativo
- usar limites pequenos

### Trial

Pode:

- experimentar a trilha premium por janela curta
- ver o valor do plano pessoal

### Premium

Pode:

- usar mais páginas
- usar vários materiais
- gerar questões sob demanda
- usar flashcards completos
- usar mini provas completas
- manter histórico e continuidade

Regra:

```txt
o premium não deve vender infinito real
deve vender profundidade, continuidade e plano pessoal
```

---

## 3. Estratégia oficial de IA

### O que fica local

Deve acontecer localmente sempre que possível:

- validação do arquivo
- extração de texto do PDF textual
- chunking inicial
- limpeza básica
- detecção simples de estrutura
- montagem de metadados
- cache de resultados

### O que vale chamar IA

Deve usar IA quando isso realmente melhora o resultado:

- priorização dos tópicos
- resumo orientado ao prazo
- explicação melhor do bloco
- revisão rápida
- geração de 3 questões
- flashcards
- mini prova

### O que não vale chamar IA no MVP

- chat livre
- OCR genérico
- podcast

---

## 4. Estratégia de custo baixo com IA

Táticas obrigatórias:

- limitar páginas
- rejeitar PDF ruim
- resumir localmente antes de enviar
- enviar só trechos relevantes do bloco
- usar cache por hash de material + bloco + ação
- gerar sob demanda
- impedir regeneração desnecessária
- usar JSON estruturado
- versionar prompts

Regra de ouro:

```txt
não usar IA para produzir o que já pode ser reaproveitado
```

---

## 5. Modelo técnico recomendado para IA

### Recomendação principal

Usar `gpt-4o-mini` como motor principal do MVP.

Motivos:

- custo baixo
- boa qualidade para resumo e geração curta
- equilíbrio melhor entre custo e utilidade

### Fonte oficial consultada

- OpenAI Pricing: https://platform.openai.com/docs/pricing/

Informações vistas na página oficial em 2026-04-14:

- `gpt-4o-mini`: `$0.15 / 1M` tokens de entrada e `$0.60 / 1M` de saída
- `gpt-5-mini`: `$0.25 / 1M` entrada e `$2.00 / 1M` saída
- `gpt-5-nano`: `$0.05 / 1M` entrada e `$0.40 / 1M` saída
- `text-embedding-3-small`: `$0.02 / 1M` tokens

Inferência operacional:

Com material compactado e geração sob demanda, o custo unitário pode ser mantido muito baixo.

---

## 6. Pipeline oficial de IA

1. usuário envia PDF
2. cliente valida o arquivo
3. texto é extraído localmente
4. parser local organiza blocos preliminares
5. backend recebe só contexto enxuto
6. IA gera estrutura ou artefato específico
7. resultado vem estruturado
8. resposta é cacheada
9. UI exibe e salva

Regra:

```txt
não existe chamada gigante para fazer tudo
o fluxo deve ser quebrado em tarefas pequenas e reutilizáveis
```

---

## 7. Prompts e governança de IA

Prompts devem ser:

- pequenos
- versionados
- testáveis
- separados por ação

Arquivos recomendados:

- `premium-study/services/ai/prompts/plan.md`
- `premium-study/services/ai/prompts/explain.md`
- `premium-study/services/ai/prompts/review.md`
- `premium-study/services/ai/prompts/questions.md`
- `premium-study/services/ai/prompts/flashcards.md`
- `premium-study/services/ai/prompts/mini_exam.md`

Regra:

```txt
prompt não fica espalhado em view
prompt é um artefato oficial e controlado
```

---

## 8. Cache e controle de custo

Cada geração deve poder ser cacheada por:

- usuário
- material hash
- bloco
- tipo de ação
- versão do prompt

Exemplo:

```txt
userId:materialHash:blockId:action:promptVersion
```

Deve existir:

- TTL para artefatos temporários
- reutilização de conteúdo já gerado
- invalidação quando o bloco mudar

---

## 9. Infraestrutura recomendada

### Recomendação pragmática

- Cloudflare Workers/Pages para backend leve
- Cloudflare R2 para armazenamento de arquivos
- camada de dados simples para usuários, planos e progresso

Fontes oficiais consultadas:

- Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/

---

## 10. Armazenamento recomendado

### No cliente

Usar:

- estado de sessão do módulo
- cache leve
- progresso local temporário

### No servidor

Guardar:

- usuários
- assinatura
- materiais
- planos
- blocos
- progresso
- gerações
- eventos de uso

Regra:

```txt
o PDF bruto não precisa ser guardado para sempre no plano grátis
```

---

## 11. Pagamentos que receberemos

### Decisão recomendada para Brasil

Começar com `Mercado Pago Assinaturas`.

Motivos:

- forte aderência no Brasil
- Pix, boleto e cartão
- recorrência disponível
- bom encaixe com público estudante

### Alternativa

`Stripe` pode ser usado depois para operação mais internacional.

### Fluxo oficial de cobrança

1. usuário escolhe plano
2. checkout externo abre
3. pagamento aprovado
4. webhook confirma
5. backend ativa acesso
6. frontend recebe novo estado

Regra:

```txt
frontend nunca deve confiar sozinho no status de premium
o backend é a fonte final da liberação
```

---

## 12. Referências oficiais de taxa consultadas

### Mercado Pago

Páginas consultadas em 2026-04-14:

- https://www.mercadopago.com.br/developers/en/docs/subscriptions/overview
- https://www.mercadopago.com.br/ajuda/19495

Pontos observados na página de taxas:

- cartão a partir de `3,98%` com recebimento em 30 dias
- `4,49%` em 14 dias
- `4,98%` na hora
- Pix `0,99%`
- boleto `R$ 3,49`

### Stripe

Páginas consultadas em 2026-04-14:

- https://stripe.com/br/pricing
- https://docs.stripe.com/subscriptions?locale=pt-BR

Pontos observados:

- cartão nacional com preço público de `3,99% + R$ 0,39`
- Billing com custo adicional público de `0,7%` do volume de Billing

Conclusão recomendada:

- para Brasil e início da frente, Mercado Pago tende a ser a melhor primeira escolha

---

## 13. Controle de acesso no produto

Camada obrigatória:

- `access-control`

Ela decide:

- se pode enviar PDF
- quantas páginas pode usar
- se pode salvar múltiplos materiais
- se pode gerar questões extras
- se pode abrir mini prova completa

Regra:

```txt
o acesso é decidido por uma camada única
e a interface apenas reflete o resultado
```

---

## 14. Estratégia de trial e conversão

Formato recomendado:

- experiência curta
- mostrando a trilha pronta
- sem burocracia excessiva

Regra:

```txt
o trial deve provar o valor do plano pessoal
não apenas liberar aleatoriamente uma feature
```

---

## 15. Formas de divulgação orgânica

O melhor marketing para este produto deve vir do próprio uso.

Alavancas recomendadas:

- tela bonita de `Seu plano está pronto`
- card compartilhável de `Seu cronograma pessoal`
- selo discreto `Criado no Study OS`
- resumo visual do progresso

Incentivos permitidos:

- pequeno bônus por indicação válida
- liberação controlada de gerações extras

Regra:

```txt
o estudante deve divulgar porque o produto o ajuda de verdade
não porque foi empurrado para um mecanismo de spam
```

---

## 16. Checklist operacional mínimo antes da Fase 1

- [x] estratégia de IA definida
- [x] regra de sem chat livre definida
- [x] modelo de acesso definido
- [x] caminho de pagamento sugerido
- [x] caminho de custo controlado definido
- [x] estratégia de divulgação orgânica definida
- [x] regra de cache e governança definida

---

## 17. Decisões congeladas desta frente

- usar IA apenas no que muda o resultado
- sem podcast no MVP
- sem chat livre no MVP
- rejeitar PDF ruim em vez de gastar com OCR
- Mercado Pago como primeira recomendação para assinatura no Brasil
- backend como fonte da verdade de acesso
- uso de modelo econômico como trilha principal

---

## 18. Execucao inicial da Fase 8 - base local

Atualizado em 2026-04-16.

Esta etapa criou a base operacional sem custo externo e sem chamada real de IA.

Arquivos criados:

- `premium-study/services/access-control.js`
- `premium-study/services/pdf-validator.js`
- `premium-study/services/billing.js`
- `premium-study/services/ai.js`
- `premium-study/services/ai/prompts/plan.md`
- `premium-study/services/ai/prompts/explain.md`
- `premium-study/services/ai/prompts/review.md`
- `premium-study/services/ai/prompts/questions.md`
- `premium-study/services/ai/prompts/flashcards.md`
- `premium-study/services/ai/prompts/mini_exam.md`

### Access control

Responsabilidade:

- normalizar estados antigos como `free` e `premium`
- decidir se o usuario pode abrir biblioteca premium
- decidir se pode exportar marcador
- decidir se pode pedir series extras
- decidir se pode gerar mini provas extras
- manter o ultimo estudo como recurso gratis
- manter o limite gratis de PDF em ate 12 paginas

Regra:

```txt
tela nao decide plano
tela pergunta para access-control
```

### Billing

Responsabilidade:

- listar planos locais
- indicar plano recomendado
- preparar contrato de checkout
- deixar claro que o provedor real ainda nao foi conectado

Estado atual:

```txt
local_scaffold
checkout real ainda nao configurado
```

Proxima etapa:

- escolher o primeiro provedor real
- conectar checkout no backend
- gravar assinatura como fonte de verdade no servidor
- atualizar `accessTier` pelo retorno confiavel do backend

### IA

Responsabilidade:

- mapear tarefas oficiais de IA
- versionar prompts
- criar chave de cache por tarefa
- retornar `not_configured` enquanto nao houver backend

Tarefas oficiais:

- `plan_from_material`
- `explain_block`
- `quick_review`
- `extra_quiz`
- `extra_true_false`
- `extra_flashcards`
- `extra_mini_exam`

Regra:

```txt
IA real nao deve ser chamada direto da interface
o backend precisa controlar chave, cache, limites e custo
```

### O que ainda nao entrou

- cobranca real
- webhook de pagamento
- login/conta como fonte de verdade
- validacao real de assinatura
- chamada real de IA
- cache persistente de geracoes
- estatisticas premium

### Criterio de aceite da Fase 8.1

- o modulo carrega os servicos antes da UI
- as telas deixam de depender diretamente de `accessTier === "premium"`
- os recursos premium passam a consultar uma camada unica
- nenhum custo externo e gerado
- a proxima fase consegue conectar provedor sem refazer o fluxo visual

---

## 19. Execucao da Fase 8.2 - paywall visual

Atualizado em 2026-04-16.

Esta etapa criou a tela de conversao premium sem ativar cobranca real.

### O que foi implementado

- rota `premium-checkout`
- tela de oferta premium contextual
- beneficios diferentes conforme o recurso bloqueado
- planos `Premium mensal` e `Premium anual` no contrato de billing
- clique em biblioteca premium levando para paywall
- clique em exportacao do marcador levando para paywall
- clique em extras de pratica levando para paywall
- clique em mini prova extra levando para paywall
- retorno visual quando o checkout real ainda nao esta conectado
- validacao do PDF antes de entrar no fluxo
- bloqueio de PDF acima de 12 paginas no plano gratis
- paywall contextual para PDF maior
- premium preparado para materiais longos sem trava fixa de paginas no navegador
- regra de custo: dividir o material antes de qualquer chamada de IA

### Decisao de produto

O produto nao deve mostrar preco definitivo enquanto o provedor real e a estrategia comercial nao forem fechados.

Por isso, os planos aparecem com:

```txt
Valor a definir
```

### Regras preservadas

- ultimo estudo continua gratis
- PDFs textuais de ate 12 paginas continuam gratis
- PDFs acima de 12 paginas nao avancam no fluxo gratis
- no premium, o atrativo deve ser `PDFs longos com divisao inteligente`, nao `IA ilimitada sem controle`
- tres rodadas gratis por formato de pratica continuam gratis
- questionarios extras, V/F extras e flashcards extras devem aparecer como beneficios separados
- biblioteca completa continua premium
- exportacao de marcador continua premium
- extras infinitos continuam premium

### O que depende de acao externa

Para transformar o paywall em assinatura real, sera necessario:

- criar ou acessar conta Mercado Pago
- definir preco mensal e anual
- criar aplicacao/credenciais de teste
- configurar URL de retorno
- configurar webhook de assinatura/pagamento
- criar backend para receber webhook
- salvar status real de assinatura no servidor
- atualizar o app com esse status confiavel

Regra:

```txt
nao confiar em premium ativado apenas pelo navegador
o navegador apenas reflete o status validado pelo backend
```

---

## 20. Preparacao do webhook Mercado Pago

Atualizado em 2026-04-17.

O webhook deve ser tratado agora como decisao operacional obrigatoria, mas so deve ser ativado no painel quando existir uma URL publica HTTPS do backend.

### Onde entra o segredo

Variavel local oficial:

```txt
MERCADO_PAGO_WEBHOOK_SECRET
```

Ela deve receber a assinatura/secret gerada pelo Mercado Pago depois de salvar a configuracao de Webhooks no painel da aplicacao.

Nao confundir:

- `MERCADO_PAGO_PUBLIC_KEY`: pode ser usada no cliente quando necessario
- `MERCADO_PAGO_ACCESS_TOKEN`: fica apenas no backend
- `MERCADO_PAGO_WEBHOOK_SECRET`: fica apenas no backend e valida notificacoes recebidas

### Caminho no Mercado Pago

No painel de desenvolvedor:

1. abrir `Suas integracoes`
2. selecionar a aplicacao `StudyPro`
3. abrir `Webhooks`
4. entrar em `Configurar notificacoes`
5. informar uma URL HTTPS publica do backend
6. selecionar os eventos corretos
7. salvar
8. copiar a assinatura/secret gerada para `MERCADO_PAGO_WEBHOOK_SECRET`

### URL planejada

Quando houver backend/serverless, usar:

```txt
https://dominio-do-site.com/api/mercado-pago/webhook
```

Em desenvolvimento local, `127.0.0.1` nao serve para webhook do Mercado Pago.

Para testar localmente, sera necessario:

- publicar um ambiente de teste, ou
- usar tunel HTTPS temporario, como Cloudflare Tunnel ou ngrok

### Eventos que devem ser ativados

Para pagamento unico via Checkout Pro:

- `payment`

Para assinatura recorrente:

- `subscription_preapproval`
- `subscription_authorized_payment`
- `subscription_preapproval_plan`, se usarmos plano associado mensal/anual

### Regra de seguranca

O backend deve:

- receber o POST do Mercado Pago
- validar a assinatura enviada no header `x-signature`
- consultar o pagamento/assinatura na API do Mercado Pago usando `MERCADO_PAGO_ACCESS_TOKEN`
- atualizar o status premium no servidor
- nunca liberar premium apenas porque o navegador voltou com `success`

Regra:

```txt
retorno visual do checkout nao libera premium
webhook validado e consulta ao Mercado Pago liberam premium
```

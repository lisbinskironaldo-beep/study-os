# ROTANOTA - TEMPLATE DE ENTREGA DAS QUESTOES

Documento interno de consulta.
Modelo para receber questoes de forma consistente e pronta para escalabilidade.

---

## 1. Estrutura real adotada no projeto

Neste projeto, os bancos base de questoes ficam em:

```txt
questions/banks/
```

Exemplo:

```txt
questions/banks/1-serie/matematica/numeros-reais/index.js
questions/banks/1-serie/matematica/index.js
questions/banks/1-serie/index.js
questions/banks/index.js
```

---

## 2. Hierarquia de distribuicao

As questoes devem ser organizadas sempre assim:

```txt
serie
 -> materia
   -> assunto
     -> questoes
```

Exemplo:

```txt
1a serie
 -> Matematica
   -> Numeros Reais
     -> questao 1
     -> questao 2
```

---

## 3. Estrutura do arquivo do topico

Cada assunto deve nascer como uma pasta propria, com um `index.js` interno:

```ts
export const numerosReais = {
  id: "matematica_numeros_reais",
  materia: "Matematica",
  serie: [1],
  topico: "Numeros Reais",

  metadados: {
    disciplinaId: "matematica",
    base: "ESCOLAR",
    eixo: "Numeros",
    frente: "Representacao numerica",
    searchAliases: [],
    subtopicosBase: [
      "Conjuntos numericos",
      "Reta numerica",
      "Intervalos",
      "Modulo",
      "Comparacao",
      "Operacoes",
      "Dizimas"
    ],
    habilidadesBase: []
  },

  questoes: []
};
```

Estrutura:

```txt
questions/banks/1-serie/matematica/numeros-reais/index.js
```

---

## 4. Schema obrigatorio de cada questao

Cada questao deve seguir exatamente este padrao:

```ts
{
  id: "",
  base: "ESCOLAR",
  serie: [1],
  materia: "Matematica",
  topico: "Numeros Reais",
  subtopico: "",
  dificuldadeLabel: "",
  dificuldadeNivel: 1,
  cognicao: "calculo",
  tipo: "",
  enunciado: "",
  opcoes: [],
  correta: null,
  comentario: "",
  tempoEstimado: 25,
  tags: [],

  // filtros e ingestao futura
  habilidades: [],
  collections: ["questions"],
  sourceType: "original",
  sourceExam: "",
  sourceYear: null,
  competencies: [],
  status: "rascunho"
}
```

Campos criticos:

- `dificuldadeLabel`: `facil`, `media`, `dificil`
- `dificuldadeNivel`: `1` a `10`
- `cognicao`: `calculo`, `interpretacao`, `estrategia`
- `tipo`: `multipla_escolha`, `input`, `ordenacao`, `comparacao`, `vf`
- `collections`: por enquanto usar `["questions"]`
- `sourceType`: `original`, `enem_oficial`, `enem_autoral`
- `status`: `rascunho` ou `revisada`
- `habilidades` e `competencies` podem ficar vazios no banco escolar inicial, mas o campo deve existir no envio novo

---

## 5. Tipos aceitos

### multipla_escolha

```ts
{
  tipo: "multipla_escolha",
  opcoes: ["", "", "", ""],
  correta: null
}
```

### input

```ts
{
  tipo: "input",
  opcoes: [],
  correta: null
}
```

### ordenacao

```ts
{
  tipo: "ordenacao",
  opcoes: [],
  correta: null
}
```

### comparacao

```ts
{
  tipo: "comparacao",
  opcoes: [],
  correta: null
}
```

### vf

```ts
{
  tipo: "vf",
  opcoes: [],
  correta: null
}
```

---

## 6. Bloco ideal de envio

O melhor formato de remessa e:

- 1 serie
- 1 materia
- 1 assunto por vez
- 5 a 20 questoes por bloco

Exemplo:

```txt
Serie: 1
Materia: Matematica
Assunto: Numeros Reais
Quantidade: 10
```

---

## 7. Layout simples em texto

Se voce quiser mandar em texto simples, use este modelo:

```txt
Serie: 1
Materia: Matematica
Assunto: Numeros Reais

Questao 1
id:
dificuldadeLabel:
dificuldadeNivel:
cognicao:
tipo:
enunciado:
opcoes:
correta:
comentario:
tempoEstimado:
tags:
```

---

## 8. Layout em JavaScript

Se quiser mandar ja no formato do banco:

```ts
export const numerosReais = {
  id: "matematica_numeros_reais",
  materia: "Matematica",
  serie: [1],
  topico: "Numeros Reais",
  metadados: {
    disciplinaId: "matematica",
    eixo: "Numeros",
    subtopicosBase: [
      "Conjuntos numericos",
      "Reta numerica",
      "Intervalos",
      "Modulo",
      "Comparacao",
      "Operacoes",
      "Dizimas"
    ]
  },
  questoes: [
    {
      id: "nr_001",
      serie: [1],
      materia: "Matematica",
      topico: "Numeros Reais",
      subtopico: "",
      dificuldadeLabel: "facil",
      dificuldadeNivel: 1,
      cognicao: "calculo",
      tipo: "multipla_escolha",
      enunciado: "",
      opcoes: [],
      correta: null,
      comentario: "",
      tempoEstimado: 25,
      tags: []
    }
  ]
};
```

---

## 9. Padrao de IDs

Formato recomendado:

```txt
[sigla_assunto]_[sequencial]
```

Exemplo:

```txt
nr_001
nr_002
nr_003
```

---

## 10. Regras de conteudo

- enunciado curto
- sem texto inutil
- foco direto no problema
- alternativa plausivel
- comentario objetivo
- uma habilidade principal por questao

---

## 11. Modelo minimo que eu preciso de voce

Se quiser mandar do jeito mais rapido possivel:

```txt
Materia:
Serie:
Assunto:

Questao 1
id:
Dificuldade label:
Dificuldade nivel:
Cognicao:
Tipo:
Enunciado:
Opcoes:
Correta:
Comentario:
Tempo estimado:
Tags:
```

Com isso eu converto para o formato do banco sem retrabalho.

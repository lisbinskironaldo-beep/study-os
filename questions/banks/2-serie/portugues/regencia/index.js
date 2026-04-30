import { createPortugueseTopic } from "../../../_shared/portugueseTopicFactory.js";

const blocos = [
  { subtopico: "Conceitos gerais", habilidade: "identificar o principio de regência verbal e nominal", tags: ["regencia", "conceitos"], fatos: [
    { lead: "a regência verbal", answer: "a relação entre o verbo e seus complementos com ou sem preposição", why: "o verbo determina a estrutura que completa seu sentido" },
    { lead: "a regência nominal", answer: "a relação entre um nome e o termo preposicionado que o complementa", why: "substantivos, adjetivos e adverbios podem exigir complemento" },
    { lead: "o termo regente", answer: "a palavra que exige ou seleciona determinado complemento", why: "ela comanda a estrutura de regência" },
    { lead: "o termo regido", answer: "o complemento subordinado ao termo regente", why: "ele completa o sentido do nome ou do verbo" },
    { lead: "a preposição na regência", answer: "o elemento que pode ser exigido pelo termo regente para ligar o complemento", why: "ela não aparece por acaso, mas por exigencia sintática" }
  ] },
  { subtopico: "Regência de verbos frequentes", habilidade: "reconhecer a regência de verbos usuais da norma padrão", tags: ["verbos", "uso-frequente"], fatos: [
    { lead: "o verbo assistir com sentido de ver", answer: "o verbo que exige complemento introduzido por preposição a na norma padrão", why: "assistir ao filme e a construção tradicional" },
    { lead: "o verbo obedecer", answer: "o verbo que exige complemento com preposição a", why: "trata-se de verbo transitivo indireto na norma padrão" },
    { lead: "o verbo preferir", answer: "o verbo que pede comparacao sem reforco de mais ou do que na construção padrão", why: "a estrutura preferir algo a outra coisa já traz a ideia comparativa" },
    { lead: "o verbo visar com sentido de ter como objetivo", answer: "o verbo que pode exigir preposição a na norma tradicional", why: "a estrutura liga o objetivo pretendido ao verbo" },
    { lead: "o verbo chegar com indicacao de destino", answer: "o verbo que na norma padrão se associa preferencialmente a preposicoes como a ou em, conforme o uso aceito", why: "a observação de registro e importante nesse caso" }
  ] },
  { subtopico: "Mudança de sentido pela regência", habilidade: "analisar alterações de sentido provocadas pela regência", tags: ["mudanca-de-sentido", "verbos"], fatos: [
    { lead: "o verbo assistir com sentidos diferentes", answer: "o verbo que muda de construção conforme signifique ver, prestar assistencia ou morar", why: "a regência ajuda a distinguir os usos" },
    { lead: "o verbo aspirar com sentido de desejar", answer: "o verbo que exige preposição a na norma padrão", why: "aspirar a um cargo difere de aspirar poeira" },
    { lead: "o verbo esquecer com e sem pronome", answer: "o caso em que a presença do pronome pode alterar a regência exigida", why: "esquecer algo e esquecer-se de algo são estruturas distintas" },
    { lead: "o verbo lembrar com e sem pronome", answer: "o caso em que a forma pronominal pede preposição de", why: "lembrar algo difere de lembrar-se de algo" },
    { lead: "a mudança semântica por regência", answer: "o fenomeno em que o sentido do verbo varia conforme a construção adotada", why: "a preposição não altera apenas forma, mas também significado" }
  ] },
  { subtopico: "Crase e regência", habilidade: "relacionar exigencia de preposição ao uso da crase", tags: ["crase", "regencia"], fatos: [
    { lead: "a crase", answer: "a fusão da preposição a com o artigo feminino a ou com pronomes iniciados por a", why: "ela depende da presença simultanea de dois elementos" },
    { lead: "a regência verbal no uso da crase", answer: "a exigencia de preposição a pelo verbo antes de termo feminino determinado por artigo", why: "sem essa regência a crase não se justifica" },
    { lead: "a regência nominal no uso da crase", answer: "a exigencia de preposição a por um nome antes de complemento feminino com artigo", why: "a fusão depende de relação regencial e determinação" },
    { lead: "a análise prévia para verificar crase", answer: "a identificacao de quem exige preposição e se o termo seguinte admite artigo", why: "esse e o caminho mais seguro para decidir o uso" },
    { lead: "a ausência de crase", answer: "a situação em que falta preposição exigida, falta artigo ou o contexto não admite fusão", why: "nem todo a gráfico indica crase" }
  ] },
  { subtopico: "Regência nominal", habilidade: "identificar nomes que exigem complemento preposicionado", tags: ["regencia-nominal", "nomes"], fatos: [
    { lead: "a necessidade de um nome", answer: "a relação que liga substantivo, adjetivo ou adverbio a seu complemento", why: "o nome pode exigir termo que complete seu sentido" },
    { lead: "um adjetivo como favoravel", answer: "um termo que costuma pedir complemento introduzido por preposição", why: "a regência nominal completa a relação semântica do adjetivo" },
    { lead: "um substantivo como respeito", answer: "um nome que frequentemente se liga a complemento preposicionado", why: "a ideia expressa pelo nome pede referência a algo ou alguem" },
    { lead: "a diferenca entre complemento nominal e adjunto adnominal", answer: "a oposicao entre termo completivo e termo caracterizador", why: "essa distincao e importante na análise da regência nominal" },
    { lead: "a preposição exigida por um nome", answer: "o elo formal definido pelo sentido e pelo uso consagrado da expressao", why: "ela não deve ser escolhida apenas por intuicao" }
  ] },
  { subtopico: "Pronomes relativos e regência", habilidade: "manter a regência correta em estruturas com pronome relativo", tags: ["pronome-relativo", "regencia"], fatos: [
    { lead: "a regência diante de pronome relativo", answer: "a manutenção da preposição exigida pelo termo regente antes do relativo quando necessario", why: "o pronome relativo não elimina a exigencia da estrutura" },
    { lead: "a expressao o livro de que preciso", answer: "um exemplo de preservacao da preposição exigida pelo verbo precisar", why: "o relativo retoma o antecedente sem apagar a regência" },
    { lead: "a expressao a cidade a que cheguei", answer: "um exemplo de relativa que conserva a preposição da regência verbal", why: "o verbo chegar pede leitura atenta da relação de destino" },
    { lead: "o apagamento indevido de preposição", answer: "um erro frequente em construções com pronome relativo", why: "a falta da preposição rompe a norma padrão da regência" },
    { lead: "a análise da relativa", answer: "a identificacao do termo regente dentro da subordinada antes de decidir a preposição", why: "isso garante a estrutura correta da frase" }
  ] },
  { subtopico: "Regência e colocacao pronominal", habilidade: "observar regência em estruturas com pronomes obliquos", tags: ["pronomes", "regencia"], fatos: [
    { lead: "o pronome obliquo como complemento verbal", answer: "o elemento que pode ocupar a função de objeto direto ou indireto", why: "a regência do verbo define essa relação" },
    { lead: "a substituição de complemento por pronome", answer: "a operação que exige observar se a estrutura pedia ou não preposição", why: "nem todo complemento pode ser trocado da mesma forma" },
    { lead: "o uso de lhe", answer: "a referência tipica a complemento indireto na norma padrão", why: "o pronome se associa a verbos com regência preposicionada" },
    { lead: "o uso de o, a, os, as", answer: "a referência tipica a complemento direto na norma padrão", why: "esses pronomes retomam termos sem preposição obrigatoria" },
    { lead: "a leitura da função do pronome", answer: "a verificacao de qual tipo de complemento o verbo exige", why: "isso evita trocas inadequadas na reescrita" }
  ] },
  { subtopico: "Regência em reescrita", habilidade: "avaliar manutenção de regência em reformulacoes", tags: ["reescrita", "aplicacao"], fatos: [
    { lead: "a troca de verbo em reescrita", answer: "a mudança que pode exigir nova preposição por causa da nova regência", why: "sinônimos nem sempre compartilham a mesma construção" },
    { lead: "a supressão de termo regido", answer: "a alteração que pode comprometer a completude sintática se o verbo ou nome continuar exigindo complemento", why: "regência e sentido caminham juntos" },
    { lead: "a manutenção da crase em reformulacao", answer: "a verificacao de se a nova estrutura preserva preposição e artigo feminino", why: "a crase depende da nova organização sintática" },
    { lead: "a equivalência com alteração de regência", answer: "a reescrita que pode soar próxima no sentido, mas ficar inadequada na norma", why: "a forma correta depende do termo regente escolhido" },
    { lead: "a revisao de regência em textos", answer: "a conferencia dos verbos e nomes que exigem preposição específica", why: "essa etapa reduz desvios em produção e interpretação" }
  ] },
  { subtopico: "Desvios recorrentes", habilidade: "identificar desvios de regência frequentes na norma padrão", tags: ["desvios", "correcao"], fatos: [
    { lead: "um desvio de regência verbal", answer: "a construção em que a preposição exigida pelo verbo está ausente ou inadequada", why: "o complemento não respeita a seleção do regente" },
    { lead: "um desvio de regência nominal", answer: "a construção em que o nome não se liga ao complemento pela preposição adequada", why: "isso compromete a forma padrão da estrutura" },
    { lead: "a interferencia da oralidade em regência", answer: "a influencia de usos coloquiais que nem sempre coincidem com a norma padrão", why: "por isso a análise formal continua importante" },
    { lead: "a correção de um desvio de regência", answer: "a substituição pela preposição ou construção exigida pelo termo regente", why: "corrigir depende de reconhecer quem rege o complemento" },
    { lead: "a consulta ao uso consagrado", answer: "uma estratégia útil quando há dúvida entre construes próximas", why: "alguns casos de regência dependem de observação atenta da norma" }
  ] },
  { subtopico: "Análise interpretativa", habilidade: "relacionar regência, sentido e clareza textual", tags: ["interpretacao", "sentido"], fatos: [
    { lead: "a relação entre regência e sentido", answer: "o fato de a estrutura escolhida influenciar a interpretação do enunciado", why: "mudar preposição ou construção pode mudar o significado" },
    { lead: "a clareza regencial", answer: "a adequacao entre termo regente, complemento e preposição no texto", why: "isso favorece compreensão precisa" },
    { lead: "a leitura semântica de verbos polissêmicos", answer: "a observação de como a regência ajuda a selecionar o sentido pretendido", why: "certos verbos mudam de significado conforme a construção" },
    { lead: "a interpretação de alternativas em prova", answer: "a comparacao entre estruturas corretas e desvios sutis de regência", why: "esse contraste e comum em questões objetivas" },
    { lead: "a revisao consciente da frase", answer: "a leitura que verifica se a construção escolhida respeita norma e significado", why: "isso torna a análise linguistica mais precisa" }
  ] }
];

export const regencia = createPortugueseTopic({
  id: "portugues_regencia",
  serie: 2,
  topico: "Regência",
  prefix: "reg",
  eixo: "Análise linguistica",
  frente: "Regência verbal e nominal",
  searchAliases: ["regência verbal", "regência nominal", "crase e regência", "verbos frequentes", "desvios de regência"],
  habilidadesBase: [
    "identificar principios de regência verbal e nominal",
    "reconhecer verbos e nomes que exigem preposição específica",
    "analisar mudancas de sentido causadas pela regência",
    "relacionar regência e uso da crase",
    "avaliar desvios e reescritas com foco em regência"
  ],
  blocos
});

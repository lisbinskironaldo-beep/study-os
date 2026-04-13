import { createPortugueseTopic } from "../../../_shared/portugueseTopicFactory.js";

const blocos = [
  { subtopico: "Conceitos gerais", habilidade: "identificar o principio de regencia verbal e nominal", tags: ["regencia", "conceitos"], fatos: [
    { lead: "a regencia verbal", answer: "a relacao entre o verbo e seus complementos com ou sem preposicao", why: "o verbo determina a estrutura que completa seu sentido" },
    { lead: "a regencia nominal", answer: "a relacao entre um nome e o termo preposicionado que o complementa", why: "substantivos, adjetivos e adverbios podem exigir complemento" },
    { lead: "o termo regente", answer: "a palavra que exige ou seleciona determinado complemento", why: "ela comanda a estrutura de regencia" },
    { lead: "o termo regido", answer: "o complemento subordinado ao termo regente", why: "ele completa o sentido do nome ou do verbo" },
    { lead: "a preposicao na regencia", answer: "o elemento que pode ser exigido pelo termo regente para ligar o complemento", why: "ela nao aparece por acaso, mas por exigencia sintatica" }
  ] },
  { subtopico: "Regencia de verbos frequentes", habilidade: "reconhecer a regencia de verbos usuais da norma padrao", tags: ["verbos", "uso-frequente"], fatos: [
    { lead: "o verbo assistir com sentido de ver", answer: "o verbo que exige complemento introduzido por preposicao a na norma padrao", why: "assistir ao filme e a construcao tradicional" },
    { lead: "o verbo obedecer", answer: "o verbo que exige complemento com preposicao a", why: "trata-se de verbo transitivo indireto na norma padrao" },
    { lead: "o verbo preferir", answer: "o verbo que pede comparacao sem reforco de mais ou do que na construcao padrao", why: "a estrutura preferir algo a outra coisa ja traz a ideia comparativa" },
    { lead: "o verbo visar com sentido de ter como objetivo", answer: "o verbo que pode exigir preposicao a na norma tradicional", why: "a estrutura liga o objetivo pretendido ao verbo" },
    { lead: "o verbo chegar com indicacao de destino", answer: "o verbo que na norma padrao se associa preferencialmente a preposicoes como a ou em, conforme o uso aceito", why: "a observacao de registro e importante nesse caso" }
  ] },
  { subtopico: "Mudanca de sentido pela regencia", habilidade: "analisar alteracoes de sentido provocadas pela regencia", tags: ["mudanca-de-sentido", "verbos"], fatos: [
    { lead: "o verbo assistir com sentidos diferentes", answer: "o verbo que muda de construcao conforme signifique ver, prestar assistencia ou morar", why: "a regencia ajuda a distinguir os usos" },
    { lead: "o verbo aspirar com sentido de desejar", answer: "o verbo que exige preposicao a na norma padrao", why: "aspirar a um cargo difere de aspirar poeira" },
    { lead: "o verbo esquecer com e sem pronome", answer: "o caso em que a presenca do pronome pode alterar a regencia exigida", why: "esquecer algo e esquecer-se de algo sao estruturas distintas" },
    { lead: "o verbo lembrar com e sem pronome", answer: "o caso em que a forma pronominal pede preposicao de", why: "lembrar algo difere de lembrar-se de algo" },
    { lead: "a mudanca semantica por regencia", answer: "o fenomeno em que o sentido do verbo varia conforme a construcao adotada", why: "a preposicao nao altera apenas forma, mas tambem significado" }
  ] },
  { subtopico: "Crase e regencia", habilidade: "relacionar exigencia de preposicao ao uso da crase", tags: ["crase", "regencia"], fatos: [
    { lead: "a crase", answer: "a fusao da preposicao a com o artigo feminino a ou com pronomes iniciados por a", why: "ela depende da presenca simultanea de dois elementos" },
    { lead: "a regencia verbal no uso da crase", answer: "a exigencia de preposicao a pelo verbo antes de termo feminino determinado por artigo", why: "sem essa regencia a crase nao se justifica" },
    { lead: "a regencia nominal no uso da crase", answer: "a exigencia de preposicao a por um nome antes de complemento feminino com artigo", why: "a fusao depende de relacao regencial e determinacao" },
    { lead: "a analise previa para verificar crase", answer: "a identificacao de quem exige preposicao e se o termo seguinte admite artigo", why: "esse e o caminho mais seguro para decidir o uso" },
    { lead: "a ausencia de crase", answer: "a situacao em que falta preposicao exigida, falta artigo ou o contexto nao admite fusao", why: "nem todo a grafico indica crase" }
  ] },
  { subtopico: "Regencia nominal", habilidade: "identificar nomes que exigem complemento preposicionado", tags: ["regencia-nominal", "nomes"], fatos: [
    { lead: "a necessidade de um nome", answer: "a relacao que liga substantivo, adjetivo ou adverbio a seu complemento", why: "o nome pode exigir termo que complete seu sentido" },
    { lead: "um adjetivo como favoravel", answer: "um termo que costuma pedir complemento introduzido por preposicao", why: "a regencia nominal completa a relacao semantica do adjetivo" },
    { lead: "um substantivo como respeito", answer: "um nome que frequentemente se liga a complemento preposicionado", why: "a ideia expressa pelo nome pede referencia a algo ou alguem" },
    { lead: "a diferenca entre complemento nominal e adjunto adnominal", answer: "a oposicao entre termo completivo e termo caracterizador", why: "essa distincao e importante na analise da regencia nominal" },
    { lead: "a preposicao exigida por um nome", answer: "o elo formal definido pelo sentido e pelo uso consagrado da expressao", why: "ela nao deve ser escolhida apenas por intuicao" }
  ] },
  { subtopico: "Pronomes relativos e regencia", habilidade: "manter a regencia correta em estruturas com pronome relativo", tags: ["pronome-relativo", "regencia"], fatos: [
    { lead: "a regencia diante de pronome relativo", answer: "a manutencao da preposicao exigida pelo termo regente antes do relativo quando necessario", why: "o pronome relativo nao elimina a exigencia da estrutura" },
    { lead: "a expressao o livro de que preciso", answer: "um exemplo de preservacao da preposicao exigida pelo verbo precisar", why: "o relativo retoma o antecedente sem apagar a regencia" },
    { lead: "a expressao a cidade a que cheguei", answer: "um exemplo de relativa que conserva a preposicao da regencia verbal", why: "o verbo chegar pede leitura atenta da relacao de destino" },
    { lead: "o apagamento indevido de preposicao", answer: "um erro frequente em construcoes com pronome relativo", why: "a falta da preposicao rompe a norma padrao da regencia" },
    { lead: "a analise da relativa", answer: "a identificacao do termo regente dentro da subordinada antes de decidir a preposicao", why: "isso garante a estrutura correta da frase" }
  ] },
  { subtopico: "Regencia e colocacao pronominal", habilidade: "observar regencia em estruturas com pronomes obliquos", tags: ["pronomes", "regencia"], fatos: [
    { lead: "o pronome obliquo como complemento verbal", answer: "o elemento que pode ocupar a funcao de objeto direto ou indireto", why: "a regencia do verbo define essa relacao" },
    { lead: "a substituicao de complemento por pronome", answer: "a operacao que exige observar se a estrutura pedia ou nao preposicao", why: "nem todo complemento pode ser trocado da mesma forma" },
    { lead: "o uso de lhe", answer: "a referencia tipica a complemento indireto na norma padrao", why: "o pronome se associa a verbos com regencia preposicionada" },
    { lead: "o uso de o, a, os, as", answer: "a referencia tipica a complemento direto na norma padrao", why: "esses pronomes retomam termos sem preposicao obrigatoria" },
    { lead: "a leitura da funcao do pronome", answer: "a verificacao de qual tipo de complemento o verbo exige", why: "isso evita trocas inadequadas na reescrita" }
  ] },
  { subtopico: "Regencia em reescrita", habilidade: "avaliar manutencao de regencia em reformulacoes", tags: ["reescrita", "aplicacao"], fatos: [
    { lead: "a troca de verbo em reescrita", answer: "a mudanca que pode exigir nova preposicao por causa da nova regencia", why: "sinonimos nem sempre compartilham a mesma construcao" },
    { lead: "a supressao de termo regido", answer: "a alteracao que pode comprometer a completude sintatica se o verbo ou nome continuar exigindo complemento", why: "regencia e sentido caminham juntos" },
    { lead: "a manutencao da crase em reformulacao", answer: "a verificacao de se a nova estrutura preserva preposicao e artigo feminino", why: "a crase depende da nova organizacao sintatica" },
    { lead: "a equivalencia com alteracao de regencia", answer: "a reescrita que pode soar proxima no sentido, mas ficar inadequada na norma", why: "a forma correta depende do termo regente escolhido" },
    { lead: "a revisao de regencia em textos", answer: "a conferencia dos verbos e nomes que exigem preposicao especifica", why: "essa etapa reduz desvios em producao e interpretacao" }
  ] },
  { subtopico: "Desvios recorrentes", habilidade: "identificar desvios de regencia frequentes na norma padrao", tags: ["desvios", "correcao"], fatos: [
    { lead: "um desvio de regencia verbal", answer: "a construcao em que a preposicao exigida pelo verbo esta ausente ou inadequada", why: "o complemento nao respeita a selecao do regente" },
    { lead: "um desvio de regencia nominal", answer: "a construcao em que o nome nao se liga ao complemento pela preposicao adequada", why: "isso compromete a forma padrao da estrutura" },
    { lead: "a interferencia da oralidade em regencia", answer: "a influencia de usos coloquiais que nem sempre coincidem com a norma padrao", why: "por isso a analise formal continua importante" },
    { lead: "a correcao de um desvio de regencia", answer: "a substituicao pela preposicao ou construcao exigida pelo termo regente", why: "corrigir depende de reconhecer quem rege o complemento" },
    { lead: "a consulta ao uso consagrado", answer: "uma estrategia util quando ha duvida entre construes proximas", why: "alguns casos de regencia dependem de observacao atenta da norma" }
  ] },
  { subtopico: "Analise interpretativa", habilidade: "relacionar regencia, sentido e clareza textual", tags: ["interpretacao", "sentido"], fatos: [
    { lead: "a relacao entre regencia e sentido", answer: "o fato de a estrutura escolhida influenciar a interpretacao do enunciado", why: "mudar preposicao ou construcao pode mudar o significado" },
    { lead: "a clareza regencial", answer: "a adequacao entre termo regente, complemento e preposicao no texto", why: "isso favorece compreensao precisa" },
    { lead: "a leitura semantica de verbos polissemicos", answer: "a observacao de como a regencia ajuda a selecionar o sentido pretendido", why: "certos verbos mudam de significado conforme a construcao" },
    { lead: "a interpretacao de alternativas em prova", answer: "a comparacao entre estruturas corretas e desvios sutis de regencia", why: "esse contraste e comum em questoes objetivas" },
    { lead: "a revisao consciente da frase", answer: "a leitura que verifica se a construcao escolhida respeita norma e significado", why: "isso torna a analise linguistica mais precisa" }
  ] }
];

export const regencia = createPortugueseTopic({
  id: "portugues_regencia",
  serie: 2,
  topico: "Regencia",
  prefix: "reg",
  eixo: "Analise linguistica",
  frente: "Regencia verbal e nominal",
  searchAliases: ["regencia verbal", "regencia nominal", "crase e regencia", "verbos frequentes", "desvios de regencia"],
  habilidadesBase: [
    "identificar principios de regencia verbal e nominal",
    "reconhecer verbos e nomes que exigem preposicao especifica",
    "analisar mudancas de sentido causadas pela regencia",
    "relacionar regencia e uso da crase",
    "avaliar desvios e reescritas com foco em regencia"
  ],
  blocos
});

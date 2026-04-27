import { createPortugueseTopic } from "../../../_shared/portugueseTopicFactory.js";

const blocos = [
  { subtopico: "Contexto do Barroco", habilidade: "relacionar o Barroco ao contexto historico e cultural", tags: ["barroco", "contexto"], fatos: [
    { lead: "o Barroco literario", answer: "o movimento marcado por contraste, conflito e linguagem elaborada", why: "essas caracteristicas refletem a tensao espiritual e historica do periodo" },
    { lead: "o contexto do Barroco", answer: "o ambiente de contrarreforma, religiosidade intensa e instabilidade de valores", why: "a literatura barroca nasce ligada a essas tensoes" },
    { lead: "o dualismo barroco", answer: "o conflito entre polos opostos como corpo e alma, pecado e perdao", why: "essa oposicao estrutura muitos textos do periodo" },
    { lead: "o teocentrismo residual no Barroco", answer: "a permanencia forte da visao religiosa na organizacao dos temas", why: "o homem barroco vive sob tensao espiritual constante" },
    { lead: "a linguagem rebuscada do Barroco", answer: "o uso expressivo de figuras e construcoes complexas", why: "a forma intensifica o conflito e o efeito estetico" }
  ] },
  { subtopico: "Barroco: conceitos e autores", habilidade: "identificar conceitos-chave e autores do Barroco", tags: ["barroco", "autores"], fatos: [
    { lead: "o cultismo", answer: "a valorizacao do jogo verbal, da forma e da ornamentacao da linguagem", why: "o foco recai na expressividade das palavras" },
    { lead: "o conceptismo", answer: "a valorizacao do raciocinio, da argumentacao engenhosa e do jogo de ideias", why: "o foco recai na sutileza logica do pensamento" },
    { lead: "Gregorio de Matos", answer: "o autor associado a poesia barroca no Brasil em vertentes religiosa, satirica e amorosa", why: "sua obra e referencia central do periodo colonial" },
    { lead: "Padre Antonio Vieira", answer: "o autor ligado ao conceptismo e a oratoria barroca", why: "seus sermoes destacam a forca argumentativa do estilo" },
    { lead: "a satira barroca", answer: "a critica moral, social ou politica realizada com forte carga expressiva", why: "essa vertente aparece de modo marcante em autores do periodo" }
  ] },
  { subtopico: "Arcadismo: contexto e principios", habilidade: "relacionar o Arcadismo ao Iluminismo e ao neoclassicismo", tags: ["arcadismo", "contexto"], fatos: [
    { lead: "o Arcadismo", answer: "o movimento literario que retoma equilibrio classico, clareza e idealizacao pastoril", why: "ele reage aos excessos formais do Barroco" },
    { lead: "o contexto do Arcadismo", answer: "o ambiente iluminista de valorizacao da razao e do equilibrio", why: "essas ideias influenciam a forma e os temas do periodo" },
    { lead: "o neoclassicismo", answer: "a retomada de modelos classicos de simplicidade, ordem e imitacao da natureza", why: "esse principio organiza a estetica arcadica" },
    { lead: "o bucolismo", answer: "a idealizacao da vida simples no campo como espaco de equilibrio", why: "ele se torna um tema recorrente do Arcadismo" },
    { lead: "a aurea mediocritas", answer: "o elogio da vida moderada e equilibrada", why: "esse ideal traduz a busca arcadica por serenidade" }
  ] },
  { subtopico: "Arcadismo: autores e temas", habilidade: "identificar autores e convencoes do Arcadismo brasileiro", tags: ["arcadismo", "autores"], fatos: [
    { lead: "Claudio Manuel da Costa", answer: "o autor associado ao Arcadismo brasileiro e a poesia de tom pastoril e reflexivo", why: "ele integra o nucleo central do movimento no Brasil" },
    { lead: "Tomas Antonio Gonzaga", answer: "o autor de Marilia de Dirceu e referencia do lirismo arcadico brasileiro", why: "sua obra articula ideal amoroso e convencoes pastorais" },
    { lead: "Basilio da Gama", answer: "o autor ligado a poesia epica arcadica em O Uraguai", why: "sua producao amplia o repertorio do periodo" },
    { lead: "o pseudonimo pastoril", answer: "o nome literario adotado para compor a encenacao bucolica do eu poetico", why: "essa convencao imita a vida pastoril idealizada" },
    { lead: "o carpe diem no Arcadismo", answer: "o convite a aproveitar o presente com medida e leveza", why: "o tema aparece articulado ao ideal de simplicidade" }
  ] },
  { subtopico: "Romantismo: contexto historico", habilidade: "relacionar o Romantismo ao contexto de nacionalismo e subjetividade", tags: ["romantismo", "contexto"], fatos: [
    { lead: "o Romantismo", answer: "o movimento que valoriza subjetividade, emocao, imaginacao e liberdade criadora", why: "ele se opoe a rigidez racional e classica anterior" },
    { lead: "o contexto do Romantismo", answer: "o ambiente de afirmacao nacional, individualismo e transformacoes politicas do seculo XIX", why: "a literatura incorpora essas tensoes e expectativas" },
    { lead: "o nacionalismo romantico", answer: "a valorizacao da identidade, da natureza e dos simbolos da nacao", why: "essa tendencia e forte especialmente em paises jovens como o Brasil" },
    { lead: "o subjetivismo romantico", answer: "a centralidade do eu, dos sentimentos e da expressao pessoal", why: "a interioridade ganha destaque na producao literaria" },
    { lead: "a idealizacao romantica", answer: "a construcao de figuras e cenarios intensificados pela imaginacao", why: "amor, patria e natureza muitas vezes surgem em tom elevado" }
  ] },
  { subtopico: "Romantismo: geracoes poeticas", habilidade: "distinguir geracoes e temas da poesia romantica", tags: ["romantismo", "poesia"], fatos: [
    { lead: "a primeira geracao romantica brasileira", answer: "a fase marcada por nacionalismo, indianismo e exaltacao da natureza", why: "ela ajuda a construir simbolicamente a identidade nacional" },
    { lead: "a segunda geracao romantica", answer: "a fase marcada por sentimentalismo, idealizacao amorosa e mal-do-seculo", why: "o eu poetico se torna mais introspectivo e angustiado" },
    { lead: "a terceira geracao romantica", answer: "a fase marcada por engajamento social e defesa de causas humanitarias", why: "a poesia se aproxima de temas politicos e abolicionistas" },
    { lead: "o indianismo", answer: "a idealizacao do indigena como heroi nacional", why: "esse tema foi central na primeira geracao romantica brasileira" },
    { lead: "o mal-do-seculo", answer: "o sentimento de tedio, melancolia e desejo de fuga presente na segunda geracao", why: "ele expressa crise interior e desencanto" }
  ] },
  { subtopico: "Romantismo: prosa", habilidade: "identificar temas e linhas da prosa romantica", tags: ["romantismo", "prosa"], fatos: [
    { lead: "a prosa romantica urbana", answer: "a vertente voltada a costumes, amores e conflitos da vida citadina", why: "ela aproxima a literatura do cotidiano social" },
    { lead: "a prosa indianista", answer: "a vertente que transforma o indigena em figura heroica e fundadora da nacionalidade", why: "ela participa do projeto nacionalista romantico" },
    { lead: "a prosa regionalista romantica", answer: "a vertente que explora paisagens, tipos humanos e habitos de diferentes regioes", why: "ela amplia a representacao do pais no romance" },
    { lead: "Jose de Alencar", answer: "o autor de destaque da prosa romantica brasileira em varias vertentes", why: "sua obra atravessa romance urbano, indianista e regionalista" },
    { lead: "a idealizacao amorosa na prosa romantica", answer: "a construcao intensificada de afetos e personagens femininas", why: "essa marca aparece com frequencia no romance do periodo" }
  ] },
  { subtopico: "Comparacao entre escolas", habilidade: "comparar Barroco, Arcadismo e Romantismo", tags: ["comparacao", "escolas-literarias"], fatos: [
    { lead: "a diferenca entre Barroco e Arcadismo", answer: "o contraste entre tensao ornamental barroca e equilibrio racional arcadico", why: "cada escola responde de modo distinto ao seu contexto" },
    { lead: "a diferenca entre Arcadismo e Romantismo", answer: "a passagem da moderacao classica para a expressao subjetiva e imaginativa", why: "o Romantismo rompe com o ideal de contencao anterior" },
    { lead: "a comparacao dos temas amorosos entre escolas", answer: "a mudanca de um amor conflituoso barroco para ideal pastoril arcadico e depois subjetivismo romantico", why: "o tratamento do sentimento revela a estetica de cada periodo" },
    { lead: "a relacao entre forma e contexto historico", answer: "o fato de cada escola expressar visoes de mundo de sua epoca", why: "estilo e historia se articulam na literatura" },
    { lead: "a leitura comparativa de escolas", answer: "a analise de permanencias e rupturas entre movimentos literarios", why: "isso ajuda a compreender a evolucao da tradicao" }
  ] },
  { subtopico: "Linguagem e recursos estilisticos", habilidade: "reconhecer marcas formais de cada escola", tags: ["linguagem", "estilo"], fatos: [
    { lead: "o rebuscamento barroco", answer: "a elaboracao intensa da linguagem com figuras e contrastes", why: "a forma acompanha o conflito interno do periodo" },
    { lead: "a simplicidade arcadica", answer: "a busca de clareza, harmonia e equilibrio expressivo", why: "o movimento reage aos excessos formais anteriores" },
    { lead: "a expressividade romantica", answer: "a expansao emocional e imagetica da linguagem", why: "ela reforca subjetividade e idealizacao" },
    { lead: "a antitese no Barroco", answer: "o recurso de aproximar ideias opostas para intensificar o conflito", why: "ela e muito frequente nesse estilo" },
    { lead: "a idealizacao no Romantismo", answer: "o recurso de elevar amor, natureza ou heroi a um plano intensificado", why: "essa marca revela a imaginacao romantica" }
  ] },
  { subtopico: "Interpretacao de textos literarios", habilidade: "interpretar fragmentos de diferentes escolas", tags: ["interpretacao", "literatura"], fatos: [
    { lead: "a leitura de um fragmento barroco", answer: "a busca de contrastes, religiosidade, jogo verbal e tensao existencial", why: "essas marcas orientam a interpretacao do periodo" },
    { lead: "a leitura de um fragmento arcadico", answer: "a observacao de equilibrio, natureza idealizada e convencionalismo pastoril", why: "essas marcas distinguem o Arcadismo" },
    { lead: "a leitura de um fragmento romantico", answer: "a observacao de subjetividade, nacionalismo ou idealizacao afetiva", why: "o movimento enfatiza emocao e identidade" },
    { lead: "a identificacao da escola literaria em um trecho", answer: "a analise conjunta de tema, linguagem e contexto estetico", why: "nao basta observar um elemento isolado" },
    { lead: "a interpretacao historico-literaria", answer: "a leitura que relaciona recursos do texto ao momento cultural de producao", why: "literatura e contexto dialogam continuamente" }
  ] }
];

export const literaturaBarrocoArcadismoRomantismo = createPortugueseTopic({
  id: "portugues_literatura_barroco_arcadismo_romantismo",
  serie: 2,
  topico: "Literatura Barroco Arcadismo Romantismo",
  prefix: "lbar",
  eixo: "Literatura",
  frente: "Escolas literarias",
  searchAliases: ["barroco", "arcadismo", "romantismo", "gregorio de matos", "jose de alencar"],
  habilidadesBase: [
    "relacionar escolas literarias a seus contextos historicos",
    "identificar autores, conceitos e temas centrais",
    "distinguir marcas de linguagem e estilo",
    "comparar movimentos literarios",
    "interpretar fragmentos literarios com base em suas caracteristicas"
  ],
  blocos
});

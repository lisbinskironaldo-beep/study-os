const PERFIS = [
  ["facil", 1, "identificacao", 20],
  ["facil", 1, "identificacao", 20],
  ["facil", 2, "compreensao", 25],
  ["medio", 3, "compreensao", 30],
  ["medio", 4, "aplicacao", 35],
  ["medio", 4, "aplicacao", 35],
  ["medio", 5, "analise", 40],
  ["medio", 5, "analise", 40],
  ["medio", 6, "analise", 40],
  ["medio", 6, "sintese", 45],
  ["medio", 6, "sintese", 45],
  ["medio", 6, "sintese", 45],
  ["dificil", 7, "analise", 50],
  ["dificil", 7, "analise", 50],
  ["dificil", 8, "sintese", 55],
  ["dificil", 8, "sintese", 55],
  ["dificil", 9, "avaliacao", 60],
  ["dificil", 9, "avaliacao", 60],
  ["dificil", 10, "avaliacao", 60],
  ["dificil", 10, "sintese", 60]
];

const slug = (texto) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const montarOpcoes = (respostas, index, correta) => {
  const candidatos = [correta, respostas[(index + 1) % respostas.length], respostas[(index + 7) % respostas.length], respostas[(index + 13) % respostas.length]];
  const unicas = [...new Set(candidatos)];
  const base = respostas.filter((item) => item !== correta && !unicas.includes(item));
  while (unicas.length < 4 && base.length) unicas.push(base.shift());
  const pos = index % 4;
  const opcoes = unicas.slice(0, 4);
  opcoes.splice(opcoes.indexOf(correta), 1);
  opcoes.splice(pos, 0, correta);
  return opcoes;
};

const criarQuestao = ({ id, subtopico, dificuldadeLabel, dificuldadeNivel, cognicao, tempoEstimado, enunciado, opcoes, correta, comentario, habilidade }) => ({
  id,
  serie: [3],
  materia: "Geografia",
  topico: "Geopolitica",
  subtopico,
  dificuldadeLabel,
  dificuldadeNivel,
  cognicao,
  tipo: "multipla_escolha",
  enunciado,
  opcoes,
  correta,
  comentario,
  tempoEstimado,
  tags: [slug(subtopico), slug(correta)],
  habilidades: [habilidade],
  collections: ["questions"],
  sourceType: "original",
  sourceExam: "",
  sourceYear: null,
  competencies: [],
  status: "revisada"
});

const montarBloco = (subtopico, inicio, comentario, habilidade, bruto) => {
  const itens = bruto
    .trim()
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean)
    .map((linha) => {
      const [correta, enunciado] = linha.split("|");
      return { correta, enunciado };
    });
  const respostas = itens.map((item) => item.correta);
  return itens.map((item, index) => {
    const [dificuldadeLabel, dificuldadeNivel, cognicao, tempoEstimado] = PERFIS[index];
    return criarQuestao({
      id: `gp_${String(inicio + index).padStart(3, "0")}`,
      subtopico,
      dificuldadeLabel,
      dificuldadeNivel,
      cognicao,
      tempoEstimado,
      enunciado: item.enunciado,
      opcoes: montarOpcoes(respostas, index, item.correta),
      correta: item.correta,
      comentario,
      habilidade
    });
  });
};

const bloco1 = montarBloco(
  "Conceitos geopoliticos e poder",
  1,
  "Geopolitica analisa relacoes entre poder, territorio, recursos, Estado e estrategia em varias escalas.",
  "identificar-conceitos-geopoliticos-basicos",
  `
geopolitica|O campo que estuda relacoes entre poder e territorio e a:
Estado nacional|A unidade politica soberana com territorio, governo e populacao e o:
territorio estrategico|O espaco valorizado por sua localizacao, recursos ou funcao militar e um:
poder global|A capacidade de influenciar outros atores em escala internacional define:
area de influencia|O espaco sobre o qual um Estado ou potencia exerce peso politico e economico forma uma:
soberania|O poder supremo de um Estado sobre seu territorio expressa a:
fronteira politica|O limite formal entre Estados corresponde a:
geoestrategia|O uso planejado do territorio e dos recursos para fins de poder integra a:
posicao geografica|A localizacao de um pais no mapa pode influenciar sua:
recurso estrategico|Energia, agua e minerais valiosos para economia e defesa sao:
potencia|Estado com grande capacidade militar, economica e diplomatica e uma:
hegemonia|Quando uma potencia exerce superioridade ampla sobre as demais ocorre:
escala internacional|A analise das relacoes entre varios Estados e atores globais pertence a:
controle territorial|A capacidade de ocupar, vigiar e organizar um espaco e o:
equilibrio de poder|A situacao em que varias potencias limitam umas as outras forma um:
interesse nacional|Os objetivos estrategicos definidos pelo Estado para preservar poder e seguranca formam o:
espaco geopolitico|O territorio visto sob a logica do poder e da estrategia compoe o:
disputa por influencia|A competicao entre potencias por aliados, mercados e areas estrategicas revela:
leitura espacial do poder|A sintese da geopolitica exige interpretar o poder por meio da:
`
);

const bloco2 = montarBloco(
  "Estado, territorio e fronteiras",
  21,
  "O Estado organiza o territorio, controla fronteiras e busca garantir seguranca e coesao interna.",
  "analisar-estado-territorio-e-fronteiras",
  `
fronteira internacional|A linha de separacao entre dois Estados soberanos e a:
limite territorial|A demarcacao oficial da extensao de um territorio nacional corresponde ao:
faixa de fronteira|A area interior proxima ao limite internacional de um pais e a:
controle de fronteiras|A fiscalizacao da circulacao de mercadorias e pessoas entre Estados define:
integridade territorial|A manutencao do territorio nacional sem perdas ou fragmentacoes corresponde a:
questao fronteirica|Disputas sobre linhas divisorias, recursos e presenca estatal integram a:
fronteira como zona de contato|Mais que linha, a fronteira tambem pode ser entendida como:
vigilancia territorial|Bases, radares e tropas em pontos estrategicos fortalecem a:
territorio nacional organizado pelo Estado|Leis, obras e administracao transformam o espaco em:
cidade de fronteira|Centro urbano marcado por intensa relacao com o pais vizinho e uma:
seguranca nacional|A protecao do territorio, da populacao e das instituicoes integra a:
cooperacao transfronteirica|A articulacao entre cidades e governos em lados opostos da fronteira constitui:
fronteira viva|Area de intensa circulacao de pessoas e atividades economicas entre paises e uma:
fronteira vulneravel|Regiao com pouca presenca estatal e alto fluxo ilicito pode ser:
ocupacao do territorio|O processo de povoar, integrar e controlar o espaco forma a:
articulacao entre escala local e nacional|As fronteiras afetam comunidades locais, mas tambem a:
territorialidade estatal|A forma como o Estado exerce poder sobre seu espaco corresponde a:
fronteira e recurso estrategico|Quando uma zona limitrofe possui agua, energia ou minerais ela ganha:
dimensao politica do mapa|A sintese sobre fronteiras mostra que o desenho territorial expressa:
`
);

const bloco3 = montarBloco(
  "Ordem mundial e multipolaridade",
  41,
  "A ordem mundial muda conforme a distribuicao do poder entre grandes potencias e blocos de influencia.",
  "analisar-ordem-mundial-e-multipolaridade",
  `
ordem bipolar|A organizacao mundial em torno de duas superpotencias caracteriza a:
Guerra Fria|O periodo de tensao entre Estados Unidos e Uniao Sovietica foi a:
ordem unipolar|A situacao em que uma unica potencia se destaca amplamente define a:
multipolaridade|A presenca de varios centros relevantes de poder no sistema internacional indica:
reordenamento global|Mudancas recentes na economia e na politica internacional apontam para um:
potencias emergentes|Estados que ampliaram peso economico e politico nas ultimas decadas sao:
disputa entre grandes potencias|A competicao por tecnologia, recursos e influencia entre Estados centrais forma uma:
novo equilibrio de poder|Quando a hierarquia internacional muda, pode surgir um:
deslocamento do eixo economico|O maior peso recente da Asia na economia mundial sugere um:
declinio relativo de hegemonia|A perda parcial de capacidade de comando por uma potencia revela:
concertacao internacional|A busca de acordos entre varios atores poderosos para evitar escalada de conflitos e uma:
regionalizacao do poder|Blocos e potencias regionais tambem influenciam a:
transicao geopolitica|A passagem de uma ordem internacional a outra e uma:
sistema internacional hierarquizado|Mesmo multipolar, o mundo continua organizado por:
assimetria entre Estados|As diferencas de poder economico, militar e tecnologico entre paises revelam:
potencia regional|Estado com forte capacidade de lideranca em seu entorno geografico e uma:
ordem mundial instavel|Crises, guerras e rivalidades entre polos sugerem uma:
coexistencia de cooperacao e conflito|A politica internacional atual combina acordos e:
leitura geopolitica do mundo atual|A sintese sobre a ordem mundial precisa articular poder, economia, tecnologia e:
`
);

const bloco4 = montarBloco(
  "Organismos internacionais e governanca global",
  61,
  "Instituicoes multilaterais mediam interesses, mas tambem refletem desigualdades de poder entre os Estados.",
  "analisar-organismos-internacionais-e-governanca-global",
  `
ONU|A principal organizacao internacional voltada a cooperacao politica global e a:
Conselho de Seguranca|O orgao da ONU com maior peso em temas de paz e guerra e o:
multilateralismo|A tentativa de resolver questoes internacionais por varios Estados e instituicoes define o:
governanca global|O conjunto de regras, acordos e organismos que orientam relacoes mundiais compoe a:
direito internacional|As normas que regulam as relacoes entre Estados e atores globais formam o:
resolucao internacional|A decisao formal aprovada em organismo multilateral e uma:
missao de paz|A operacao internacional voltada a monitorar cessar-fogo ou proteger civis e uma:
legitimidade internacional|O reconhecimento da aceitacao de uma decisao por varios atores compoe a:
organizacao multilateral|Instituicao criada por diversos Estados para cooperacao em temas comuns e uma:
veto no Conselho de Seguranca|O poder de bloquear certas resolucoes na ONU corresponde ao:
cooperacao internacional|A atuacao conjunta entre Estados para enfrentar problemas comuns forma a:
diplomacia multilateral|A negociacao em organismos com varios paises simultaneamente integra a:
assimetria de poder institucional|Mesmo em organismos globais, alguns paises influenciam mais por causa de:
governanca contestada|Questionamentos sobre representatividade e eficacia de instituicoes internacionais revelam uma:
agenda global|Conjunto de temas internacionais recorrentes como clima, seguranca e direitos forma a:
regime internacional|Regras e principios relativamente estaveis em torno de um tema especifico compoem um:
coordenacao entre Estados|A governanca global depende de:
limites do multilateralismo|Rivalidades entre potencias e interesses nacionais podem reduzir a:
instituicoes como arenas de poder|A sintese sobre organismos internacionais mostra que eles sao espacos de cooperacao e:
`
);

const bloco5 = montarBloco(
  "Conflitos territoriais e guerras",
  81,
  "Conflitos geopoliticos envolvem fronteiras, nacionalismos, recursos, seguranca e influencia estrategica.",
  "avaliar-conflitos-territoriais-e-guerras",
  `
conflito territorial|A disputa por controle de uma area, fronteira ou recurso forma um:
guerra interestatal|O confronto armado direto entre Estados soberanos e uma:
guerra civil|Conflito armado interno entre grupos do mesmo pais corresponde a:
disputa por recursos|Muitas tensoes territoriais intensificam-se pela busca de agua, energia ou:
intervencao militar|A acao armada de um Estado em outro territorio e uma:
cessar-fogo|A suspensao temporaria das hostilidades em uma guerra e o:
zona desmilitarizada|Area onde o uso de forcas armadas e restringido ou proibido constitui uma:
ocupacao militar|Quando tropas passam a controlar determinado territorio ocorre:
refugiados de guerra|Pessoas forcadas a deixar seu pais por conflitos armados formam:
fronteira disputada|Area limitrofe sem consenso entre Estados e uma:
guerra por procuracao|Conflito em que potencias apoiam lados opostos sem confronto direto e uma:
nacionalismo territorial|A valorizacao extrema do territorio e da identidade nacional pode alimentar:
conflito congelado|Disputa sem solucao definitiva, mas sem guerra aberta intensa, define um:
crise humanitaria|A situacao de grave sofrimento social causada por guerra e deslocamento e uma:
geografia do conflito|A distribuicao espacial de frentes, recursos e populacoes afetadas compoe a:
controle de corredor estrategico|Dominar passagens, estreitos e rotas importantes pode motivar:
militarizacao do territorio|O aumento de bases, tropas e equipamentos em determinada area indica:
seguranca coletiva|A ideia de que um ataque a um membro afeta varios Estados integra a:
conflito como expressao de poder e territorio|A sintese geopolitica das guerras destaca a articulacao entre:
`
);

const bloco6 = montarBloco(
  "Geoeconomia, sancoes e comercio estrategico",
  101,
  "A economia tornou-se instrumento direto de poder em disputas por mercados, tecnologias e cadeias produtivas.",
  "analisar-geoeconomia-sancoes-e-comercio-estrategico",
  `
geoeconomia|O uso de instrumentos economicos para obter vantagens geopoliticas define a:
sancao economica|A restricao financeira ou comercial imposta para pressionar um pais e uma:
guerra comercial|A disputa entre Estados por tarifas, subsidios e acesso a mercados e a:
embargo|A proibicao ampla de comercio com determinado pais constitui um:
dependencia comercial|Quando uma economia se torna muito ligada a um parceiro ou mercado ocorre:
cadeia estrategica de suprimentos|Setores considerados essenciais para seguranca e economia formam uma:
controle de exportacoes sensiveis|A restricao a venda de tecnologias e insumos avancados integra o:
protecionismo estrategico|A defesa de setores considerados cruciais por medidas estatais forma o:
soberania produtiva|A capacidade de produzir internamente bens considerados essenciais amplia a:
arma economica|Quando financas, energia ou comercio sao usados para pressionar outros atores fala-se em:
interdependencia assimetrica|Dois paises podem depender um do outro, mas de forma desigual, configurando:
vulnerabilidade externa seletiva|Setores muito dependentes de importacoes ou chips podem sofrer:
seguranca das cadeias|A preocupacao com fornecedores, estoques e transporte integra a:
relocalizacao produtiva estrategica|Mover fabricas para paises aliados ou para o proprio territorio corresponde a:
comercio como instrumento de poder|A sintese geoeconomica mostra que as trocas internacionais podem funcionar como:
restricao financeira internacional|Limites a bancos, pagamentos ou reservas compoem uma:
competicao por tecnologia|Disputas por chips, dados e plataformas fazem parte da:
reindustrializacao estrategica|A tentativa de recuperar cadeias consideradas essenciais corresponde a:
geoeconomia contemporanea desigual|A sintese sobre o tema destaca a combinacao entre mercados globais e:
`
);

const bloco7 = montarBloco(
  "Recursos estrategicos e energia na geopolitica",
  121,
  "Recursos naturais e energia condicionam aliancas, conflitos e posicoes de poder no sistema internacional.",
  "relacionar-recursos-estrategicos-e-energia-a-geopolitica",
  `
recurso estrategico|Bem natural ou tecnologico essencial para economia e defesa corresponde a:
geopolitica da energia|A disputa por petroleo, gas, minerios e rotas de abastecimento integra a:
rota maritima estrategica|Passagem essencial ao comercio e a energia mundial e uma:
gasoduto internacional|A infraestrutura que conecta produtores e consumidores de gas entre paises e o:
oleoduto|A tubulacao usada para transportar petroleo corresponde ao:
seguranca de abastecimento|Garantir energia e materias-primas sem interrupcoes define a:
minerais estrategicos|Litio, cobalto e terras raras ganharam importancia como:
dependencia energetica externa|Quando um pais importa parte relevante da energia que usa ocorre:
disputa por agua transfronteirica|Rios compartilhados por varios Estados podem gerar:
preco global da energia|Oscilacoes internacionais de petroleo e gas afetam a:
recursos como base de poder|Quem controla fontes e rotas consegue ampliar:
transicao energetica geopolitica|A corrida por novas tecnologias verdes alterou a importancia de:
territorio produtor de energia|Regioes ricas em petroleo, gas ou hidreletricidade possuem:
controle de estreitos e canais|Dominar passagens de navios petroleiros significa deter:
renda de recursos|A receita estatal obtida com petroleo, gas e minerios forma a:
conflito por jazidas e reservas|Disputas territoriais podem se intensificar em areas com:
energia como ferramenta diplomatica|Fornecer ou cortar combustiveis pode servir como:
interdependencia por recursos|Produtores e consumidores de energia se ligam numa:
recursos e poder mundial|A sintese geopolitica do tema mostra a conexao entre natureza, mercado e:
`
);

const bloco8 = montarBloco(
  "Defesa, tecnologia e ciberespaco",
  141,
  "O poder contemporaneo envolve armas, satelites, dados, vigilancia digital e dominio tecnologico.",
  "analisar-defesa-tecnologia-e-ciberespaco",
  `
defesa nacional|O conjunto de meios para proteger soberania, territorio e interesses do Estado define a:
industria de defesa|O setor que produz equipamentos, sistemas e tecnologias militares e a:
ciberespaco|O ambiente digital de redes, dados e sistemas conectados e o:
ciberguerra|Ataques digitais entre Estados ou grupos com fins politicos e militares configuram:
seguranca cibernetica|A protecao de dados, redes e infraestruturas digitais integra a:
satelite estrategico|Equipamento orbital importante para comunicacao, observacao e defesa e um:
vigilancia digital|O monitoramento de informacoes e comportamentos por meios eletronicos compoe a:
tecnologia dual|A tecnologia com uso civil e militar ao mesmo tempo e chamada de:
autonomia tecnologica|Dominar pesquisa, projeto e fabricacao de sistemas avancados amplia a:
dados estrategicos|Informacoes sensiveis sobre comunicacao, populacao e territorio formam:
inteligencia artificial militar|O uso de algoritmos em vigilancia e decisao de defesa integra a:
infraestrutura critica|Redes de energia, telecomunicacoes e bancos sao exemplos de:
guerra hibrida|A combinacao de meios militares, digitais, informacionais e economicos forma uma:
disputa por semicondutores|Os chips tornaram-se centrais na competicao por:
dominio informacional|Controlar dados, plataformas e comunicacao amplia:
espionagem tecnologica|A obtencao secreta de informacoes estrategicas e a:
controle de tecnologia sensivel|Restringir a exportacao de certos equipamentos faz parte da:
soberania digital|A capacidade de um pais proteger e gerir seus sistemas de dados integra a:
tecnologia como dimensao do poder|A sintese sobre defesa contemporanea mostra que poder militar depende tambem de:
`
);

const bloco9 = montarBloco(
  "Blocos, aliancas e integracao regional",
  161,
  "Aliancas militares, blocos politicos e integracao regional reordenam espacos de cooperacao e conflito.",
  "analisar-blocos-aliancas-e-integracao-regional",
  `
alianca militar|Acordo entre Estados para cooperacao em defesa e seguranca corresponde a:
bloco regional|Conjunto de paises articulados por interesses economicos e politicos forma um:
integracao regional|A ampliacao da cooperacao entre paises vizinhos em varias areas define a:
cooperacao estrategica|A articulacao diplomatica, militar ou tecnologica de longo prazo e uma:
organizacao de defesa coletiva|Instituicao que preve ajuda militar entre membros e uma:
esfera de influencia|A area sobre a qual um Estado ou bloco exerce maior peso politico constitui uma:
regionalismo geopolitico|A formacao de polos e acordos em determinadas regioes do mundo expressa:
convergencia diplomatica|A aproximacao entre paises em votos, acordos e objetivos indica:
bloco de poder|Grupo de Estados com interesses comuns capaz de agir no sistema internacional forma um:
alianca assimetrica|Nem todos os membros de uma coalizao possuem o mesmo peso, gerando:
projecao regional|A capacidade de liderar politicamente seu entorno geografico constitui:
coordenacao intergovernamental|A cooperacao entre Estados sem perda de soberania plena e uma:
interesse estrategico comum|A base politica que sustenta uma alianca ou bloco e o:
competicao entre blocos|A disputa entre agrupamentos de paises por mercados e influencia forma:
seguranca regional|A estabilidade politico-militar em determinada area depende de:
integracao como instrumento geopolitico|Unir mercados, energia ou defesa pode servir para ampliar:
fragmentacao do sistema internacional|A multiplicacao de aliancas e polos regionais sugere:
regionalizacao da ordem mundial|O fortalecimento de polos continentais e subcontinentais expressa:
blocos entre cooperacao e rivalidade|A sintese do tema mostra que integracao regional pode gerar acordos e:
`
);

const bloco10 = montarBloco(
  "Geopolitica contemporanea e interpretacao critica",
  181,
  "O mundo atual combina multipolaridade, geoeconomia, tecnologia, conflitos e disputas por narrativa e influencia.",
  "sintetizar-a-geopolitica-contemporanea",
  `
ordem mundial em transicao|O momento atual de mudanca na distribuicao do poder global define uma:
competicao sistemica|A rivalidade ampla entre grandes potencias em tecnologia, comercio e influencia forma uma:
globalizacao geopolitizada|A integracao mundial atual cada vez mais atravessada por sancoes e disputas expressa:
interdependencia conflitiva|A situacao em que Estados dependem uns dos outros, mas competem intensamente, constitui:
geopolitica das redes|Cabos, satelites, dados e plataformas tornaram-se objetos de:
economia como instrumento de poder|Tarifas, bloqueios e financiamentos mostram o uso da:
conflitos multiescalares|As disputas atuais envolvem ao mesmo tempo escala local, regional e:
potencias em rivalidade permanente|A sintese sobre o sistema atual destaca a presenca de:
territorio como recurso politico|Fronteiras, estreitos, bases e corredores mostram que o espaco continua sendo:
tecnologia como eixo geopolitico|Chips, IA, dados e satelites ganharam centralidade na:
energia e clima na geopolitica|A transicao energetica e a seguranca de abastecimento recolocaram no centro da:
atores variados do sistema internacional|Estados, empresas, organismos multilaterais e plataformas compoem:
disputa por narrativa global|Controlar informacao, midia e versoes dos fatos tornou-se parte da:
governanca global tensionada|Instituicoes internacionais existem, mas convivem com:
regionalismos competitivos|A multiplicacao de blocos e aliancas em diferentes areas sugere:
leitura integrada do poder mundial|Para compreender a geopolitica atual e preciso unir economia, defesa, tecnologia e:
mundo conectado e desigual|A sintese final sobre o tema deve reconhecer uma ordem internacional:
  `
);

const complementos = [
  criarQuestao({
    id: "gp_020",
    subtopico: "Conceitos geopoliticos e poder",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "Uma leitura geopolitica madura reconhece que territorio, recursos, Estado e estrategia se articulam numa mesma:",
    opcoes: ["geografia do poder", "classificacao climatica", "rede sem conflitos", "estrutura demografica"],
    correta: "geografia do poder",
    comentario: "A geopolitica interpreta o espaco como elemento ativo das relacoes de poder.",
    habilidade: "sintetizar-conceitos-geopoliticos-e-poder"
  }),
  criarQuestao({ id: "gp_040", subtopico: "Estado, territorio e fronteiras", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Fronteiras, soberania e controle estatal so ganham sentido pleno quando ligados a seguranca, circulacao e:", opcoes: ["organizacao do territorio", "apenas relevo", "uniformidade cultural", "ausencia de fluxos"], correta: "organizacao do territorio", comentario: "As fronteiras sao linhas politicas, mas tambem zonas de poder e gestao espacial.", habilidade: "sintetizar-estado-territorio-e-fronteiras" }),
  criarQuestao({ id: "gp_060", subtopico: "Ordem mundial e multipolaridade", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "A multipolaridade atual deve ser lida como reorganizacao de polos economicos, militares, tecnologicos e:", opcoes: ["diplomaticos", "somente climaticos", "puramente cartograficos", "hidrologicos"], correta: "diplomaticos", comentario: "A ordem mundial muda conforme variam as capacidades de comando em varias dimensoes.", habilidade: "sintetizar-ordem-mundial-e-multipolaridade" }),
  criarQuestao({ id: "gp_080", subtopico: "Organismos internacionais e governanca global", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Os organismos multilaterais precisam ser entendidos simultaneamente como espacos de cooperacao, negociacao e:", opcoes: ["disputa de poder", "apenas neutralidade", "ausencia de interesses nacionais", "controle do clima"], correta: "disputa de poder", comentario: "Instituicoes globais expressam regras comuns, mas tambem hierarquias entre os Estados.", habilidade: "sintetizar-governanca-global-e-organismos-internacionais" }),
  criarQuestao({ id: "gp_100", subtopico: "Conflitos territoriais e guerras", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Conflitos contemporaneos envolvem fronteiras, recursos, identidades, rotas e:", opcoes: ["estrategias de poder", "somente clima", "ausencia de interesses economicos", "homogeneidade cultural"], correta: "estrategias de poder", comentario: "Guerras e crises territoriais expressam disputas amplas pelo controle do espaco.", habilidade: "sintetizar-conflitos-territoriais-e-guerras" }),
  criarQuestao({ id: "gp_120", subtopico: "Geoeconomia, sancoes e comercio estrategico", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Tarifas, bloqueios, cadeias produtivas e financas mostram que a economia mundial tambem funciona como:", opcoes: ["instrumento geopolitico", "sistema sem poder", "rede puramente comercial", "fenomeno climatico"], correta: "instrumento geopolitico", comentario: "A geoeconomia transforma o mercado em recurso direto de pressao e comando.", habilidade: "sintetizar-geoeconomia-e-sancoes" }),
  criarQuestao({ id: "gp_140", subtopico: "Recursos estrategicos e energia na geopolitica", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Energia, agua e minerais tornam-se fatores geopoliticos quando se relacionam a mercado, tecnologia, rotas e:", opcoes: ["seguranca internacional", "apenas vegetacao", "tipos de solo", "estrutura urbana"], correta: "seguranca internacional", comentario: "Recursos estrategicos importam porque afetam tanto economias quanto relacoes de poder.", habilidade: "sintetizar-recursos-estrategicos-e-energia-na-geopolitica" }),
  criarQuestao({ id: "gp_160", subtopico: "Defesa, tecnologia e ciberespaco", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "No mundo atual, defesa depende de territorio, armas, dados, redes e:", opcoes: ["autonomia tecnologica", "somente relevo", "reducao do comercio", "desconexao digital"], correta: "autonomia tecnologica", comentario: "A soberania militar passou a exigir capacidade informacional e industrial muito maior.", habilidade: "sintetizar-defesa-tecnologia-e-ciberespaco" }),
  criarQuestao({ id: "gp_180", subtopico: "Blocos, aliancas e integracao regional", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Blocos e aliancas devem ser lidos como formas de cooperacao, mas tambem como mecanismos de projecao de:", opcoes: ["poder regional", "apenas uniformidade cultural", "isolamento politico", "desaparecimento da soberania"], correta: "poder regional", comentario: "Integracao e alianca alteram a capacidade de influencia dos Estados em suas regioes.", habilidade: "sintetizar-blocos-aliancas-e-integracao-regional" }),
  criarQuestao({ id: "gp_198", subtopico: "Geopolitica contemporanea e interpretacao critica", dificuldadeLabel: "dificil", dificuldadeNivel: 9, cognicao: "avaliacao", tempoEstimado: 60, enunciado: "A ordem internacional atual combina multipolaridade, geoeconomia, tecnologia e conflitos em uma:", opcoes: ["transicao geopolitica permanente", "estrutura totalmente estavel", "rede sem rivalidades", "paisagem sem Estado"], correta: "transicao geopolitica permanente", comentario: "O mundo contemporaneo e marcado por rearranjos frequentes de poder e alianca.", habilidade: "avaliar-a-geopolitica-contemporanea" }),
  criarQuestao({ id: "gp_199", subtopico: "Geopolitica contemporanea e interpretacao critica", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "avaliacao", tempoEstimado: 60, enunciado: "Uma leitura critica da geopolitica precisa articular economia, defesa, informacao, energia e:", opcoes: ["territorio", "apenas clima", "somente cultura local", "tipos de rocha"], correta: "territorio", comentario: "O espaco segue sendo dimensao central da politica internacional.", habilidade: "avaliar-a-centralidade-do-territorio-na-geopolitica" }),
  criarQuestao({ id: "gp_200", subtopico: "Geopolitica contemporanea e interpretacao critica", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "A sintese da geopolitica contemporanea deve reconhecer um mundo conectado, hierarquizado, competitivo e:", opcoes: ["desigualmente integrado", "sem conflitos territoriais", "politicamente uniforme", "energeticamente neutro"], correta: "desigualmente integrado", comentario: "A globalizacao nao eliminou a disputa entre potencias nem as assimetrias espaciais.", habilidade: "sintetizar-a-geopolitica-contemporanea" })
];

export const geopolitica = {
  id: "geografia_geopolitica",
  materia: "Geografia",
  serie: [3],
  topico: "Geopolitica",
  metadados: {
    disciplinaId: "geografia",
    base: "ESCOLAR",
    eixo: "Geografia",
    frente: "Geografia politica e geopolitica",
    searchAliases: ["geopolitica", "ordem mundial", "fronteiras", "guerra fria", "geoeconomia", "soberania"],
    subtopicosBase: [
      "Conceitos geopoliticos e poder",
      "Estado, territorio e fronteiras",
      "Ordem mundial e multipolaridade",
      "Organismos internacionais e governanca global",
      "Conflitos territoriais e guerras",
      "Geoeconomia, sancoes e comercio estrategico",
      "Recursos estrategicos e energia na geopolitica",
      "Defesa, tecnologia e ciberespaco",
      "Blocos, aliancas e integracao regional",
      "Geopolitica contemporanea e interpretacao critica"
    ],
    habilidadesBase: [
      "identificar conceitos centrais da geopolitica",
      "analisar territorio, fronteiras, poder e ordem mundial",
      "relacionar geoeconomia, recursos e tecnologia a disputas internacionais",
      "avaliar conflitos, aliancas e organismos multilaterais",
      "sintetizar a geopolitica contemporanea em perspectiva geografica"
    ]
  },
  questoes: [...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8, ...bloco9, ...bloco10, ...complementos].sort((a, b) => a.id.localeCompare(b.id))
};

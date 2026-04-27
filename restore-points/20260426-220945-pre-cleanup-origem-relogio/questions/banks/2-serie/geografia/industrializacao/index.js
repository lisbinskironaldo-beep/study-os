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
  serie: [2],
  materia: "Geografia",
  topico: "Industrializacao",
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
      id: `in_${String(inicio + index).padStart(3, "0")}`,
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
  "Conceitos e revolucoes industriais",
  1,
  "Industrializacao envolve transformacao tecnica, mudanca na producao e reorganizacao do territorio.",
  "identificar-conceitos-e-fases-da-industrializacao",
  `
industrializacao|O processo de ampliacao da producao mecanizada em fabricas define a:
Primeira Revolucao Industrial|A fase marcada por maquina a vapor, carvao e industria textil corresponde a:
Segunda Revolucao Industrial|A etapa associada a eletricidade, aco, quimica e petroleo e a:
Terceira Revolucao Industrial|A fase ligada a eletronica, informatica e automacao e a:
maquinofatura|A substituicao do trabalho artesanal pela producao com maquinas caracteriza a:
producao fabril|A concentracao de trabalhadores, equipamentos e etapas em um mesmo estabelecimento forma a:
revolucao tecnico-cientifica|O salto tecnologico baseado em eletronica, ciencia e informacao remete a:
mecanizacao|O uso crescente de maquinas no lugar do trabalho manual corresponde a:
urbanizacao industrial|O crescimento das cidades ligado ao avanco das fabricas exemplifica a:
energia a vapor|Na primeira fase da industrializacao a fonte energetica simbolica foi a:
eletrificacao industrial|Na segunda fase o uso amplo de energia eletrica impulsionou a:
producao em massa|A fabricacao padronizada de grandes quantidades de mercadorias forma a:
salto de produtividade|A introducao de novas tecnicas industriais costuma gerar:
reorganizacao do trabalho|Ao avancar, a industrializacao muda ritmos, tarefas e divisao das funcoes, produzindo:
transformacao territorial|Fabricas, vias, bairros operarios e servicos mostram que a industrializacao produz:
mudanca estrutural|Quando uma economia deixa de ser majoritariamente agraria e fortalece industria e servicos ocorre:
base tecnico-industrial|Maquinas, energia, transporte e conhecimento formam a:
industrializacao desigual|Nem todos os paises passaram pelas mesmas etapas no mesmo momento, o que revela:
processo historico cumulativo|Uma sintese sobre revolucoes industriais exige reconhecer que a industrializacao e um:
modernizacao produtiva|O conjunto de mudancas tecnicas e organizacionais associado ao avanco industrial expressa:
`
);

const bloco2 = montarBloco(
  "Fatores locacionais da industria",
  21,
  "A localizacao industrial depende de mercado, energia, infraestrutura, mao de obra e estrategia empresarial.",
  "analisar-fatores-locacionais-da-industria",
  `
fator locacional|Elemento que influencia a escolha do lugar de instalacao de uma fabrica e um:
mercado consumidor|A proximidade de grande numero de compradores favorece o:
materia-prima|Industria pesada costuma buscar proximidade de:
fonte de energia|Setores intensivos em consumo energetico valorizam a:
mao de obra qualificada|Ramos tecnologicos tendem a se localizar onde ha:
infraestrutura de transportes|Rodovias, portos e ferrovias compoem a:
economia de aglomeracao|A vantagem de concentrar empresas e servicos em um mesmo lugar e uma:
custo logistico|Distancia e dificuldade de escoamento elevam o:
incentivo fiscal|Beneficios oferecidos pelo Estado para atrair fabricas formam o:
tecnopolo|Area que concentra pesquisa, universidades e empresas inovadoras e um:
proximidade do porto|Industrias exportadoras costumam valorizar a:
rede urbana densa|Cidades com muitos servicos e infraestrutura oferecem vantagem de:
escala de producao|Quanto maior a fabrica e o volume produzido, maior pode ser a:
especializacao territorial|Quando um lugar atrai certo ramo industrial de forma recorrente surge uma:
desconcentracao industrial|A saida de fabricas de areas saturadas para novos espacos corresponde a:
vantagem comparativa regional|Disponibilidade de energia, servicos e mercado pode formar uma:
custo da terra|Empresas tambem avaliam o preco do solo urbano ou industrial como:
acesso a fornecedores|A proximidade de insumos e componentes reduz o:
localizacao seletiva|As industrias nao se distribuem ao acaso, mas segundo uma:
articulacao entre fatores|Uma sintese sobre localizacao industrial precisa reconhecer a combinacao entre mercado, logistica, energia e:
`
);

const bloco3 = montarBloco(
  "Modelos e trajetorias de industrializacao",
  41,
  "Os paises se industrializaram em ritmos e formas distintos, ligados a historia, Estado e mercado mundial.",
  "comparar-modelos-e-trajetorias-de-industrializacao",
  `
industrializacao classica|A ocorrida primeiro nos paises pioneiros europeus e chamada de:
industrializacao tardia|A que aconteceu depois, em paises que precisaram recuperar atraso, recebe o nome de:
substituicao de importacoes|A estrategia de produzir internamente bens antes comprados no exterior e a:
industrializacao induzida pelo Estado|Quando governos lideram infraestrutura, credito e protecao a fabricas ocorre:
industrializacao dependente|Aquela marcada por tecnologia externa, capital estrangeiro e subordinacao e a:
industrializacao planificada|Em economias socialistas a expansao industrial fortemente coordenada pelo governo formou uma:
protecao tarifaria|A elevacao de tarifas para fortalecer industria nascente integra a:
parque industrial|O conjunto de fabricas e ramos industriais de um pais forma o:
capital nacional|Quando empresas e bancos internos sustentam a expansao produtiva fortalece-se o:
capital estrangeiro|Investimentos externos em fabricas e setores produtivos correspondem ao:
industrializacao pesada|A priorizacao de siderurgia, maquinas e quimica de base define a:
industrializacao leve|A enfase em bens de consumo simples e caracteristica da:
politica industrial|Medidas estatais para estimular setores estrategicos compoem a:
mercado interno ampliado|A industria tende a ganhar folego quando cresce o:
dependencia tecnologica|Produzir sem dominar pesquisa e projeto mantem a:
trajetoria semiperiferica|Pais que combina industria relevante com dependencia parcial ocupa uma:
diversificacao industrial|Ampliar ramos e segmentos produtivos ajuda a construir:
autonomia produtiva|Quanto maior o dominio sobre tecnologia, insumos e decisao, maior a:
desenvolvimento industrial desigual|Uma leitura comparativa das trajetorias industriais revela:
industrializacao historicamente situada|A sintese correta e que cada processo industrial dependeu de contexto, Estado, mercado e:
`
);

const bloco4 = montarBloco(
  "Organizacao produtiva: fordismo, toyotismo e flexibilizacao",
  61,
  "Os modelos produtivos mudaram com a busca por maior produtividade, flexibilidade e reducao de custos.",
  "analisar-modelos-de-organizacao-produtiva",
  `
fordismo|O modelo baseado em linha de montagem e producao padronizada em massa e o:
toyotismo|O modelo baseado em flexibilidade, just in time e menor estoque e o:
linha de montagem|A organizacao do trabalho em sequencia fixa de etapas compoe a:
padronizacao|A fabricacao de mercadorias iguais em larga escala depende da:
just in time|Produzir de acordo com a demanda imediata e com baixo estoque define o:
estoque reduzido|No toyotismo busca-se manter:
especializacao de tarefas|No fordismo cada trabalhador realiza parte restrita do processo, mostrando:
flexibilidade produtiva|A capacidade de alterar rapidamente lotes, modelos e ritmos indica:
terceirizacao industrial|Transferir etapas a fornecedores externos e um traco da:
controle de qualidade total|No toyotismo a busca permanente por melhoria e controle integra o:
producao em serie|A fabricacao repetitiva de grandes volumes caracteriza a:
fragmentacao da producao|Espalhar etapas entre empresas e lugares diferentes mostra:
trabalhador polivalente|No modelo flexivel valoriza-se o:
racionalizacao do trabalho|A tentativa de elevar produtividade por controle do tempo e dos movimentos expressa:
reestruturacao industrial|A mudanca do fordismo rigido para esquemas mais flexiveis integra a:
cadeia de fornecedores|Empresas toyotistas dependem fortemente de uma:
producao sob demanda|Fabricar conforme pedidos e sinais do mercado constitui a:
pressao por produtividade|Fordismo e toyotismo, embora diferentes, compartilham a busca por:
organizacao industrial mutavel|Uma leitura historica dos modelos produtivos mostra que a fabrica moderna passou por:
eficiencia com custos menores|A sintese sobre a mudanca do fordismo ao toyotismo destaca a busca por:
`
);

const bloco5 = montarBloco(
  "Energia, materias-primas e infraestrutura industrial",
  81,
  "A industria depende de bases materiais, energia estavel, transportes e articulacao entre insumos e mercados.",
  "relacionar-energia-materias-primas-e-infraestrutura-a-industria",
  `
base energetica|Toda industria depende de fornecimento regular de:
carvao mineral|Na Primeira Revolucao Industrial a fonte central de energia foi o:
petroleo|Na Segunda Revolucao Industrial ganhou grande importancia o:
eletricidade|A expansao industrial moderna foi impulsionada pela difusao da:
siderurgia|A producao de aco e ferro compoe a:
infraestrutura industrial|Rodovias, portos, energia e telecomunicacoes formam a:
complexo industrial|A articulacao entre varios ramos e servicos de apoio constitui um:
industrias de base|Siderurgia, petroquimica e cimento pertencem as:
abastecimento continuo|Fabricas dependem de fluxo estavel de energia e insumos para manter:
logistica industrial|O transporte de materias-primas, pecas e mercadorias integra a:
economia de escala|Grandes unidades produtivas tendem a reduzir custo medio por meio da:
proximidade de insumos|Alguns ramos se aproximam da materia-prima para reduzir:
seguranca energetica|A garantia de energia suficiente e regular para produzir integra a:
integracao infraestrutural|Conectar ferrovias, portos, rodovias e redes de energia favorece a:
densidade industrial|Regioes com muitas fabricas, servicos e infraestrutura apresentam maior:
custo de transporte|Quanto maior a distancia entre insumos, fabrica e mercado, maior o:
parque fabril dependente de energia|Uma industria moderna sem rede estavel de eletricidade e combustiveis tende a:
vantagem logistica|Territorios bem conectados podem atrair fabricas por oferecer:
articulacao entre recursos e mercado|Uma leitura geografica da industria exige ligar insumos, energia, transportes e:
fundamento material da industrializacao|A sintese sobre industria e infraestrutura destaca que produzir exige tecnologia, capital e:
  `
);

const bloco6 = montarBloco(
  "Desconcentracao industrial e tecnopolos",
  101,
  "A industria se desloca no territorio em busca de custos menores, tecnologia, mercado e novas centralidades.",
  "analisar-desconcentracao-industrial-e-tecnopolos",
  `
desconcentracao industrial|A saida de fabricas de areas saturadas para outras regioes e a:
desmetropolizacao relativa da industria|Quando plantas deixam grandes centros e buscam cidades medias pode ocorrer:
tecnopolo|Area que concentra universidade, pesquisa e empresas inovadoras e um:
guerra fiscal|A disputa entre governos para atrair industrias por incentivos caracteriza a:
interiorizacao industrial|O deslocamento de fabricas para cidades do interior corresponde a:
custos metropolitanos elevados|Congestionamento, terra cara e saturacao podem estimular:
nova divisao territorial da industria|A redistribuicao regional das fabricas cria uma:
regiao industrial emergente|Area que passa a receber fabricas, logistica e servicos especializados torna-se uma:
infraestrutura regional competitiva|Rodovias, energia e telecomunicacoes ajudam a formar uma:
deslocamento seletivo de plantas|A desconcentracao nao ocorre para qualquer lugar, mas segundo:
tecnologia e inovacao local|Tecno polos atraem empresas de ponta por reunir:
rede urbana ampliada|A desconcentracao industrial costuma fortalecer cidades medias e a:
complementaridade regional|Quando regioes articulam industria, servicos e logistica em conjunto surge:
custos trabalhistas menores|Muitas empresas deslocam plantas em busca de:
proximidade de novos mercados|A interiorizacao tambem pode ocorrer para reduzir distancia ate:
reconfiguracao espacial da producao|A redistribuicao territorial de fabricas expressa uma:
polos de desenvolvimento|Grandes projetos e parques industriais podem formar:
especializacao regional renovada|Novos ramos produtivos podem redefinir o perfil economico de uma regiao, criando:
desigualdade regional persistente|Mesmo com deslocamentos industriais, algumas areas continuam concentrando comando, o que revela:
mobilidade espacial da industria|A sintese sobre desconcentracao destaca que a industria pode mudar de lugar em busca de:
`
);

const bloco7 = montarBloco(
  "Trabalho, automacao e industria 4.0",
  121,
  "A industria contemporanea combina robotizacao, dados e conectividade, redefinindo funcoes e exigencias do trabalho.",
  "relacionar-trabalho-automacao-e-industria-4-0",
  `
automacao industrial|O uso crescente de maquinas e sistemas programados na fabrica define a:
robotizacao|A substituicao de tarefas humanas repetitivas por robos caracteriza a:
industria 4.0|A integracao entre sensores, dados, software e maquinas conectadas compoe a:
internet das coisas|Equipamentos industriais capazes de trocar informacoes em rede integram a:
manufatura digital|Producao apoiada em softwares, simulacoes e controle informacional e uma:
producao inteligente|Quando maquinas e sistemas ajustam processos a partir de dados fala-se em:
sensorizacao|A coleta constante de informacoes por dispositivos nas linhas produtivas e a:
analise de dados industriais|O uso de informacoes em tempo real para controlar eficiencia e falhas forma a:
qualificacao tecnologica|Trabalhadores em ambientes automatizados tendem a exigir maior:
substituicao de tarefas repetitivas|A automacao incide primeiro sobre atividades de:
trabalho tecnico especializado|Em plantas mais sofisticadas cresce a demanda por:
desemprego tecnologico|A perda de postos por introducao de maquinas pode gerar:
requalificacao profissional|Diante da automacao trabalhadores precisam passar por:
integracao homem-maquina|Na industria contemporanea muitas tarefas combinam decisao humana com:
monitoramento em tempo real|Sistemas conectados permitem:
produtividade elevada|Automacao e dados sao adotados para ampliar:
controle digital da cadeia|Plataformas e softwares permitem coordenar estoques, fornecedores e producao por meio de:
desigualdade ocupacional|Enquanto alguns empregos se sofisticam outros se tornam mais instaveis, reforcando:
transicao tecnologica seletiva|Nem todos os paises e empresas acessam a industria 4.0 no mesmo ritmo, o que revela:
fabrica conectada|A sintese sobre industria 4.0 destaca a articulacao entre automacao, dados, redes e:
`
);

const bloco8 = montarBloco(
  "Industrializacao, urbanizacao e rede urbana",
  141,
  "O avanco industrial impulsiona cidades, servicos, transportes e reorganiza a hierarquia urbana.",
  "relacionar-industrializacao-urbanizacao-e-rede-urbana",
  `
urbanizacao industrial|O crescimento das cidades impulsionado por fabricas e empregos urbanos expressa a:
cidade industrial|Nucleo urbano fortemente marcado por concentracao fabril e de operarios e uma:
metropolizacao|A expansao de grandes cidades articuladas por industria, servicos e fluxos pode levar a:
rede urbana industrializada|O conjunto de cidades conectadas por producao, servicos e transporte compoe uma:
migracao campo-cidade|A atracao de trabalhadores para centros fabris estimula a:
bairro operario|Area urbana criada ou ocupada por trabalhadores industriais forma um:
segregacao socioespacial industrial|O crescimento urbano ligado a fabricas pode gerar contrastes entre areas valorizadas e:
infraestrutura urbana de apoio|Saneamento, energia, moradia e transporte crescem para atender a:
centralidade fabril|Cidades que concentram parques industriais ganham:
deslocamentos pendulares industriais|Quando trabalhadores moram longe das plantas e se deslocam diariamente ocorrem:
conurbacao|A uniao fisica entre cidades industrializadas vizinhas caracteriza a:
servicos urbanos complementares|Bancos, escolas tecnicas e comercio expandem-se junto a:
hierarquia urbana reforcada|A industrializacao tende a fortalecer certos centros e redefinir a:
cidade media industrial|Municipio que ganha relevancia por atrair plantas e logistica pode tornar-se uma:
problemas urbanos industriais|Crescimento rapido sem planejamento pode gerar periferizacao, poluicao e:
especializacao urbana|Certas cidades passam a ser reconhecidas por ramos produtivos especificos, formando:
interdependencia cidade-industria|Mercado de trabalho, transporte e servicos mostram a:
reorganizacao do territorio urbano|A implantacao de parques fabris e vias expressa uma:
urbanizacao desigual|Nem todas as areas da cidade recebem os beneficios da industria da mesma forma, o que indica:
cidade industrial complexa|A sintese sobre industrializacao e urbanizacao destaca a formacao de espacos urbanos articulados por trabalho, moradia, servicos e:
`
);

const bloco9 = montarBloco(
  "Impactos socioambientais da industria",
  161,
  "A industrializacao gera riqueza e emprego, mas tambem pressiona ambiente, saude e uso do territorio.",
  "avaliar-impactos-socioambientais-da-industria",
  `
poluicao industrial|A liberacao de residuos e contaminantes por fabricas caracteriza a:
emissao atmosferica|Fumaca, particulas e gases liberados pelas chamines integram a:
contaminacao hidrica|O despejo de efluentes em rios e lagos pode provocar:
residuos industriais|Sobras solidas e liquidas da producao formam os:
degradacao ambiental urbana|A concentracao fabril em cidades pode intensificar:
risco tecnologico|Acidentes com produtos quimicos e processos industriais integram um:
passivo ambiental|Area degradada por atividade produtiva que exige recuperacao forma um:
doenca ocupacional|Problemas de saude associados ao ambiente de trabalho industrial podem gerar:
justica ambiental|A discussao sobre quem sofre mais com poluicao e risco industrial remete a:
controle ambiental|Normas, fiscalizacao e tratamento de residuos compoem o:
licenciamento ambiental|O processo legal para autorizar instalacao de empreendimento e o:
industrializacao poluente|Quando a producao cresce sem tecnologia limpa ocorre:
relocalizacao de impactos|Empresas podem deslocar atividades mais sujas para areas de menor regulacao, gerando:
conflito socioambiental|Quando comunidade e industria disputam agua, terra e saude aparece:
tecnologia limpa|Inovacoes que reduzem residuos e consumo de energia apontam para:
eficiencia energetica|Produzir mais com menos gasto de energia ajuda a reduzir:
sustentabilidade industrial|A busca por conciliar producao, emprego e menor dano ambiental integra a:
desigualdade na exposicao ao risco|Bairros populares frequentemente sofrem mais com poluicao, mostrando:
industria e ambiente em tensao|Uma leitura critica do setor industrial precisa reconhecer a relacao entre crescimento economico e:
regulacao e responsabilidade socioambiental|A sintese sobre impactos industriais destaca a necessidade de combinar producao com:
`
);

const bloco10 = montarBloco(
  "Leitura geografica da industria e interpretacao aplicada",
  181,
  "Interpretar a industria exige unir tecnologia, territorio, trabalho, energia, urbanizacao e poder.",
  "sintetizar-a-leitura-geografica-da-industria",
  `
geografia industrial|O campo da Geografia que estuda distribuicao, localizacao e efeitos da industria e a:
territorio industrializado|Espaco marcado por infraestrutura, fabricas, fluxos e servicos especializados forma um:
insercao industrial internacional|A posicao de um pais nas cadeias produtivas globais define sua:
complexidade industrial|Quanto maior a diversidade tecnologica e produtiva de uma economia maior sua:
valor agregado industrial|Etapas como projeto, marca e componentes sofisticados concentram:
dependencia industrial|Produzir com maquinas e tecnologia importadas, sem dominar pesquisa, mantem:
autonomia tecnologica|A capacidade de criar, adaptar e controlar conhecimento produtivo amplia a:
competitividade sistemica|Infraestrutura, educacao, energia, inovacao e logistica compoem a:
rede de cidades industriais|Centros urbanos articulados por fabricas, fornecedores e servicos formam uma:
politica industrial ativa|Medidas estatais voltadas a setores estrategicos exemplificam:
divisao territorial da producao|A distribuicao de fabricas e funcoes industriais por diferentes regioes expressa a:
espaco produtivo seletivo|Nem todo lugar recebe industria; os investimentos escolhem areas com certas vantagens, criando:
densidade tecnica industrial|Locais com muita infraestrutura, pesquisa e servicos especializados apresentam:
articulacao entre escalas|A industria deve ser lida do plano local ao global, numa:
desenvolvimento industrial desigual|Algumas regioes concentram comando e inovacao enquanto outras recebem etapas simples, revelando:
vulnerabilidade produtiva|Dependencia de poucos setores, insumos ou mercados externos pode gerar:
resiliencia industrial|Diversificacao, pesquisa e cadeias internas fortalecidas ajudam a construir:
estrategia nacional de industrializacao|Planejamento de longo prazo para ampliar autonomia produtiva forma uma:
analise geografica integrada|Uma interpretacao madura da industria precisa unir localizacao, trabalho, energia, urbanizacao e:
industrializacao como processo territorial|A sintese final deve reconhecer que a industria nao e apenas setor economico, mas um:
`
);

export const industrializacao = {
  id: "geografia_industrializacao",
  materia: "Geografia",
  serie: [2],
  topico: "Industrializacao",
  metadados: {
    disciplinaId: "geografia",
    base: "ESCOLAR",
    eixo: "Geografia",
    frente: "Geografia da industrializacao",
    searchAliases: ["industrializacao", "revolucao industrial", "fordismo", "toyotismo", "localizacao industrial", "parque industrial"],
    subtopicosBase: [
      "Conceitos e revolucoes industriais",
      "Fatores locacionais da industria",
      "Modelos e trajetorias de industrializacao",
      "Organizacao produtiva: fordismo, toyotismo e flexibilizacao",
      "Energia, materias-primas e infraestrutura industrial",
      "Desconcentracao industrial e tecnopolos",
      "Trabalho, automacao e industria 4.0",
      "Industrializacao, urbanizacao e rede urbana",
      "Impactos socioambientais da industria",
      "Leitura geografica da industria e interpretacao aplicada"
    ],
    habilidadesBase: [
      "identificar fases e conceitos da industrializacao",
      "analisar localizacao, infraestrutura e modelos produtivos",
      "comparar trajetorias e estrategias de industrializacao",
      "relacionar industria, trabalho, tecnologia e urbanizacao",
      "avaliar impactos territoriais e socioambientais da industria"
    ]
  },
  questoes: [...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8, ...bloco9, ...bloco10]
};

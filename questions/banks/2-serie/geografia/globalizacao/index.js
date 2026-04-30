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
  const candidatos = [
    correta,
    respostas[(index + 1) % respostas.length],
    respostas[(index + 7) % respostas.length],
    respostas[(index + 13) % respostas.length]
  ];
  const unicas = [...new Set(candidatos)];
  const base = respostas.filter((item) => item !== correta && !unicas.includes(item));
  while (unicas.length < 4 && base.length) unicas.push(base.shift());
  const pos = index % 4;
  const opcoes = unicas.slice(0, 4);
  opcoes.splice(opcoes.indexOf(correta), 1);
  opcoes.splice(pos, 0, correta);
  return opcoes;
};

const criarQuestao = ({
  id,
  subtopico,
  dificuldadeLabel,
  dificuldadeNivel,
  cognicao,
  tempoEstimado,
  enunciado,
  opcoes,
  correta,
  comentario,
  habilidade
}) => ({
  id,
  serie: [2],
  materia: "Geografia",
  topico: "Globalizacao",
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
      id: `gl_${String(inicio + index).padStart(3, "0")}`,
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
  "Conceitos e bases da globalizacao",
  1,
  "Globalizacao envolve intensificacao de fluxos, interdependencia e articulacao desigual entre territorios.",
  "identificar-conceitos-basicos-da-globalizacao",
  `
globalizacao|O processo de ampliacao das conexões econômicas, técnicas e culturais em escala planetaria é chamado de:
interdependencia|A situação em que economias e sociedades passam a depender mais umas das outras caracteriza:
compressao espaço-tempo|A reducao pratica das distâncias pelo avanco dos transportes e da comunicação remete a:
fluxos globais|A circulação intensa de mercadorias, capitais, informacoes e pessoas em varias escalas forma os:
rede mundial|A articulacao de lugares por conexões permanentes de transporte e comunicação compoe uma:
aldeia global|A ideia de mundo mais conectado e acessivel em tempo quase imediato foi sintetizada na expressao:
mercado mundial|A integração entre economias nacionais por trocas e investimentos forma o:
liberalizacao econômica|A reducao de barreiras a comércio, capitais e investimentos e conhecida como:
integração produtiva|Quando as etapas de fabricacao de um bem se espalham por varios países ocorre:
revolucao tecnico-cientifica|O conjunto de inovacoes que acelerou comunicacoes, automacao e informatica esta ligado a:
circulação acelerada|Na globalizacao, mercadorias, informacoes e capitais tendem a apresentar:
escala planetaria|Quando um fenomeno ultrapassa fronteiras nacionais e passa a atingir varios continentes ele ganha:
homogeneizacao parcial|A difusao de marcas e padroes de consumo semelhantes em varios países sugere:
fragmentacao territorial|Mesmo com redes globais integradas, muitos espacos permanecem pouco conectados, o que revela:
desigualdade global|A globalizacao não conecta todos os territorios da mesma forma, o que evidencia:
multiescalaridade|Para compreender a globalizacao e preciso observar relações no plano local, nacional e:
interconexao|A ligacao constante entre lugares distantes por redes técnicas e econômicas expressa:
seletividade espacial|Investimentos, empresas e tecnologias não se distribuem igualmente, mas segundo uma logica de:
articulacao desigual|Uma sintese correta sobre globalizacao deve reconhecer que o mundo esta mais conectado, mas de forma:
sistema mundial integrado|Ao juntar fluxos, redes, tecnologia e mercados, a globalizacao pode ser lida como um:
`
);

const bloco2 = montarBloco(
  "Redes, fluxos e circulação",
  21,
  "A globalizacao depende de redes materiais e imateriais que aceleram a circulação, mas também aprofundam dependências.",
  "analisar-redes-e-fluxos-da-globalizacao",
  `
rede de transportes|Portos, aeroportos, rodovias e ferrovias integram a:
rede digital|Cabos submarinos, satelites e data centers formam a:
circulação de capitais|Transferências financeiras em tempo real exemplificam a:
logística global|A coordenacao entre armazenagem, transporte e distribuição em escala internacional define a:
hub logistico|Um ponto altamente conectado que concentra distribuição e redistribuicao de cargas é um:
tempo real|As bolsas de valores e as plataformas financeiras operam globalmente quase em:
conectividade|A capacidade de um território de se ligar a outros por redes técnicas expressa sua:
intermodalidade|O uso articulado de varios meios de transporte no mesmo circuito é chamado de:
cadeia de suprimentos|O conjunto de etapas de fornecimento, transporte e distribuição de insumos constitui a:
circulação informacional|Mensagens, dados e imagens trocados instantaneamente representam a:
densidade técnica|Locais com muitas infraestruturas e serviços especializados revelam elevada:
nos de rede|Cidades e portos de alta centralidade funcionam como:
gargalo logistico|Quando uma rota, canal ou porto concentra excessiva dependencia ele vira um:
integração territorial seletiva|A maior presenca de redes em certos lugares do que em outros indica:
dependencia de fluxos|Economias muito conectadas a importacoes de insumos podem sofrer com:
sincronizacao produtiva|Empresas globais coordenam fabricacao e entrega com base em:
encurtamento das distâncias funcionais|Na globalizacao, o avanco dos transportes e da internet produz:
vulnerabilidade em rede|Uma interrupcao em um elo importante das cadeias pode espalhar efeitos por toda a:
hipermobilidade do capital|Investimentos financeiros que mudam rapidamente de país exemplificam:
circulação global hierarquizada|As redes mundiais conectam muitos lugares, mas sob diferentes graus de centralidade e:
`
);

const bloco3 = montarBloco(
  "Tecnologia, informacao e comunicação",
  41,
  "Tecnologias da informacao reduziram distâncias funcionais e ampliaram o comando de redes globais.",
  "relacionar-tecnologia-informacao-e-globalizacao",
  `
internet|A principal rede mundial de comunicação digital contemporanea é a:
tecnologias da informacao|Computadores, softwares, telecomunicacoes e plataformas digitais compoem as:
automacao|O uso crescente de maquinas e sistemas programados na produção corresponde a:
telecomunicacoes|Telefonia, satelites e transmissao de dados pertencem ao setor de:
dados|Na economia digital, plataformas e empresas extraem valor a partir de grande volume de:
plataformas digitais|Empresas que conectam usuarios, publicidade, serviços e algoritmos atuam como:
algoritmos|Sequencias logicas usadas para organizar recomendacoes e processar informacoes são:
cibercultura|A produção de praticas sociais e culturais mediadas por redes digitais integra a:
teletrabalho|A realizacao de atividades profissionais a distância, mediada por internet, é chamada de:
economia digital|Quando o valor e criado por software, plataformas, dados e serviços online fala-se em:
cloud computing|O armazenamento e processamento remoto de informacoes em servidores externos define a:
big data|A análise de massas gigantes de informacoes digitais e conhecida como:
inteligencia artificial|Sistemas capazes de reconhecer padroes, aprender e automatizar decisões integram a:
datacenter|Instalacao física que concentra servidores e armazenamento digital é um:
infraestrutura informacional|Cabos, satelites, antenas e servidores compoem a:
velocidade informacional|Na globalizacao, a transmissao quase instantanea de dados aumenta a:
comando remoto da produção|Empresas podem coordenar fabricas espalhadas por varios países gracas ao:
dependencia tecnologica|Países que consomem tecnologia, mas não dominam pesquisa e projeto, mantem:
exclusao digital|A desigualdade no acesso a internet, equipamentos e conhecimento tecnico expressa:
poder informacional|Controlar plataformas, softwares, patentes e dados significa deter:
`
);

const bloco4 = montarBloco(
  "Empresas transnacionais e cadeias globais",
  61,
  "Empresas transnacionais organizam cadeias globais de valor, deslocam etapas produtivas e exercem forte poder territorial.",
  "analisar-empresas-transnacionais-e-cadeias-globais",
  `
empresa transnacional|Corporacao que atua em varios países com unidades produtivas e decisorias é uma:
filial|Uma unidade de uma empresa global instalada em outro país é uma:
matriz|A sede principal que concentra decisão estrategica de uma empresa global é a:
cadeia global de valor|A distribuição internacional de etapas como pesquisa, montagem e venda forma a:
terceirizacao|Quando uma empresa contrata outra para executar parte de sua atividade ocorre:
offshoring|A transferencia de uma etapa produtiva para outro país recebe o nome de:
relocalizacao industrial|A mudança de fabricas para lugares de menor custo ou maior mercado corresponde a:
vantagem competitiva|Infraestrutura, qualificacao de trabalho e incentivos podem funcionar como:
fragmentacao da produção|Quando as etapas de um mesmo produto se espalham por varios lugares ocorre:
controle de marca|Nas cadeias globais, uma parte importante do lucro fica com quem domina design, marketing e:
montagem periferica|Instalar etapas simples e intensivas em trabalho em países de menor salario exemplifica:
investimento direto externo|A aplicacao de capital produtivo por empresas em outros países constitui o:
deslocamento produtivo|Mover fabricas ou serviços entre países para reduzir custos é uma forma de:
dependencia de matrizes|Economias que recebem filiais, mas não controlam tecnologia e decisão mantem:
enclave exportador|Uma área fortemente integrada ao mercado mundial, mas pouco articulada ao entorno local, pode funcionar como:
especializacao funcional|Em cadeias globais, cada território tende a cumprir certo papel ou:
subcontratacao internacional|A contratacao de fornecedores em varios países integra a:
captura de valor|A etapa mais lucrativa da cadeia costuma ficar com agentes que controlam tecnologia, financas e:
poder corporativo global|Quando grandes empresas influenciam normas, mercados e políticas estatais elas exercem:
cadeia produtiva hierarquizada|Uma sintese sobre transnacionais deve reconhecer que as etapas globais não são iguais, mas ordenadas em uma:
`
);

const bloco5 = montarBloco(
  "Financeirizacao e fluxos de capital",
  81,
  "A financeirizacao ampliou o peso das bolsas, bancos e fundos na organizacao do capitalismo global.",
  "interpretar-financeirizacao-e-fluxos-de-capital",
  `
financeirizacao|O aumento do peso das financas na economia e na vida social define a:
capital especulativo|Recursos aplicados em busca de ganhos rapidos com compra e venda de ativos formam o:
bolsa de valores|O mercado de negociacao de ações e outros papeis é a:
taxa de juros|O preco do dinheiro no sistema financeiro é a:
volatilidade financeira|A rapida oscilação de capitais e precos em mercados globais gera:
mercado cambial|A negociacao internacional de moedas ocorre no:
investimento de carteira|A aplicacao financeira sem controle direto sobre a produção recebe o nome de:
fundos globais|Grandes investidores institucionais que aplicam recursos em varios países são:
liquidez|A facilidade de transformar um ativo em dinheiro sem grandes perdas expressa a:
risk premium|A exigencia de retorno maior por medo de perda é um tipo de:
credito internacional|Emprestimos e financiamentos entre agentes de diferentes países compoem o:
movimento instantaneo de capitais|A digitalizacao das financas permite:
dependencia financeira|Países muito expostos a capitais externos e juros globais podem sofrer:
crise cambial|Quando faltam divisas é a moeda se desvaloriza fortemente pode ocorrer:
bolha financeira|A valorizacao exagerada de ativos, desconectada da economia real, forma uma:
especulacao global|Ganhos obtidos com variacoes de precos e juros em varios mercados integram a:
descolamento da economia real|Quando as financas crescem mais que produção e emprego aparece um processo de:
vulnerabilidade externa|Economias dependentes de capital estrangeiro podem enfrentar:
centralidade financeira|Cidades como Nova York e Londres se destacam pela:
comando do capital global|Uma sintese sobre financeirizacao reconhece que bancos, fundos e bolsas ampliaram o:
  `
);

const bloco6 = montarBloco(
  "Cultura, consumo e industria cultural",
  101,
  "A globalizacao cultural difunde informacoes e produtos, mas também padroniza consumos e fortalece mercados simbolicos.",
  "analisar-cultura-consumo-e-industria-cultural-na-globalizacao",
  `
industria cultural|A produção em massa de bens simbolicos para consumo amplo integra a:
consumo globalizado|A difusao de marcas e hábitos semelhantes em varios países expressa:
padronizacao cultural|A repeticao de referencias, modas e formatos midiaticos em escala ampla remete a:
hibridizacao cultural|Quando elementos locais e globais se misturam surgem processos de:
mass média|Televisao, radio, cinema e grandes redes de comunicação formam os:
marketing global|A adaptacao e divulgacao de produtos para diversos mercados exige:
marcas globais|Empresas reconhecidas em varios continentes atuam por meio de:
publicidade transnacional|Campanhas comerciais planejadas para varios países representam a:
consumismo|A valorizacao social do ato de comprar em excesso esta ligada ao:
soft power|A capacidade de influenciar por cultura, comunicação e estilos de vida é uma forma de:
streaming|A distribuição online e sob demanda de filmes, series e musicas se expandiu com o:
cultura pop global|Musica, series, moda e celebridades difundidas mundialmente compoem a:
identidade local|Mesmo com a difusao de referencias globais, grupos e territorios podem reforcar a:
apropriacao cultural desigual|A circulação global de simbolos pode ocorrer sem reconhecimento equilibrado de seus produtores, gerando:
mercantilizacao da cultura|Quando expressoes culturais passam a ser vendidas como produtos ocorre:
segmentacao de mercado|Na globalizacao, empresas adaptam mercadorias a diferentes perfis de publico por meio da:
algoritmizacao do consumo|Plataformas digitais influenciam escolhas de compra e entretenimento por meio da:
convergencia midiatica|A circulação do mesmo conteudo em TV, celular, rede social e cinema revela:
disputa simbolica global|Uma leitura critica da cultura globalizada deve reconhecer que imagens, narrativas e mercadorias participam de uma:
globalizacao cultural contraditoria|A sintese sobre cultura e consumo precisa admitir que ha difusao mundial, mas também resistência, hibridizacao e:
`
);

const bloco7 = montarBloco(
  "Trabalho, reestruturacao produtiva e precarizacao",
  121,
  "Mudancas produtivas globais alteraram formas de emprego, qualificacao, terceirizacao e inseguranca social.",
  "analisar-trabalho-e-reestruturacao-produtiva-na-globalizacao",
  `
reestruturacao produtiva|As mudancas nas formas de produzir, gerir e empregar no capitalismo recente formam a:
toyotismo|O modelo baseado em flexibilidade, just in time e terceirizacao e conhecido como:
flexibilizacao do trabalho|A reducao de rigidez em contratos e jornadas integra a:
terceirizacao|A transferencia de etapas ou serviços para outra empresa corresponde a:
precarizacao laboral|Empregos instaveis, baixos direitos e inseguranca crescente revelam:
deslocalizacao produtiva|A mudança de empresas para países de menor custo de produção define a:
just in time|A produção ajustada a demanda imediata e caracteristica do:
trabalho em rede|A articulacao de equipes e tarefas em varios lugares por plataformas e sistemas digitais cria:
subcontratacao|A contratacao de fornecedores para executar partes da produção e:
uberizacao|Quando o trabalho e organizado por plataformas sob demanda e baixa protecao social ocorre:
automacao industrial|O uso intensivo de maquinas e sistemas programados na produção é a:
qualificacao seletiva|Na economia global, alguns postos exigem alta formação enquanto outros se tornam mais simples, gerando:
desemprego estrutural|A perda de vagas por mudancas técnicas e organizacionais pode gerar:
trabalho informal|Atividades sem carteira, seguridade ou protecao legal pertencem ao:
plataformizacao do trabalho|Aplicativos que conectam servico e consumidor em tempo real impulsionam a:
fragmentacao ocupacional|Mercados de trabalho com vinculos muito diferentes entre si revelam:
pressão competitiva global|Empresas alteram contratos, salarios e localizacao para responder a:
mobilidade seletiva do trabalho|Na globalizacao, alguns trabalhadores circulam com facilidade, enquanto outros enfrentam barreiras, revelando:
desigualdade laboral global|Uma leitura critica do trabalho no mundo globalizado precisa reconhecer ganhos de produtividade e ao mesmo tempo:
trabalho flexivel e inseguro|A sintese sobre reestruturacao produtiva mostra que a globalizacao ampliou eficiencia, mas também:
`
);

const bloco8 = montarBloco(
  "Desigualdades, exclusao digital e seletividade espacial",
  141,
  "A globalizacao integra territorios de forma desigual, concentrando tecnologia, renda e oportunidades em certos espacos.",
  "avaliar-desigualdades-e-seletividade-espacial-na-globalizacao",
  `
seletividade espacial|Investimentos e redes técnicas se concentram em alguns lugares segundo uma logica de:
exclusao digital|A desigualdade no acesso a internet, equipamentos e competencias técnicas é uma forma de:
centros globais|Cidades e regiões que concentram comando financeiro, informacional e empresarial funcionam como:
periferias desconectadas|Espacos pouco integrados a redes modernas e de baixa infraestrutura podem ser vistos como:
divisao digital|A separacao entre incluidos e excluidos no uso de tecnologias define a:
concentracao de renda|Mesmo em economias globalizadas, parte importante da riqueza permanece em processo de:
territorios opacos|Lugares de pouca densidade técnica e pouca centralidade nas redes podem ser chamados de:
territorios luminosos|Espacos de grande fluidez, informacao e densidade de infraestrutura compoem os:
assimetrias globais|As diferencas de acesso a tecnologia, capital e poder entre países mostram:
marginalizacao territorial|Quando um espaço permanece fora dos principais fluxos e investimentos ocorre:
centralidade urbana global|Metropoles que concentram sedes, financas e serviços superiores possuem alta:
inclusao seletiva|Na globalizacao alguns grupos entram nas redes por consumo, mas não por direitos plenos, revelando:
desigualdade de conectividade|A diferenca entre lugares hiperconectados e outros mal atendidos por redes expressa:
segregacao socioespacial ampliada|A globalizacao pode reforcar desigualdades urbanas ao combinar fluxos sofisticados e:
acesso desigual a oportunidades|Educação, internet e mobilidade não chegam igualmente a todos, produzindo:
hierarquia territorial|Os lugares ocupam posicoes distintas no sistema global, formando uma:
concentracao tecnologica|Patentes, laboratorios e plataformas digitais tendem a se acumular em poucos polos, o que revela:
modernizacao desigual|Infraestrutura e inovacao avancam de forma diferente entre regiões e grupos, produzindo:
globalizacao excludente|Uma análise critica deve reconhecer que as redes mundiais conectam muito, mas deixam parte da população em:
inserção desigual nos fluxos globais|A sintese sobre seletividade espacial mostra que a globalizacao organiza os territorios por:
`
);

const bloco9 = montarBloco(
  "Meio ambiente e globalizacao",
  161,
  "A expansao global da produção e do consumo intensificou impactos ambientais e ampliou debates sobre sustentabilidade.",
  "relacionar-meio-ambiente-e-globalizacao",
  `
mudança climatica global|O aumento de temperatura associado a emissoes em escala planetaria define a:
efeito estufa intensificado|A elevacao da concentracao de gases atmosfericos gera:
pegada ecologica|O indicador que mede pressão de modos de vida e consumo sobre a natureza é a:
desmatamento exportador|A abertura de novas áreas para commodities voltadas ao mercado externo pode causar:
poluicao transfronteirica|Quando contaminantes ultrapassam fronteiras nacionais ocorre:
economia verde|A proposta de combinar atividade econômica com menor impacto ambiental integra a:
transicao energetica|A troca progressiva de combustiveis fosseis por fontes menos poluentes é a:
justica ambiental|A distribuição desigual de riscos e danos ambientais entre grupos sociais questiona a:
externalizacao de custos ambientais|Quando empresas deslocam impactos para outros lugares ou populacoes ocorre:
consumo intensivo de recursos|O estilo de vida estimulado pela globalizacao pode ampliar o:
mercado de carbono|Mecanismos de compra e venda de creditos de emissao integram o:
acordos climaticos internacionais|Negociacoes entre Estados para reduzir emissoes compoem os:
globalizacao dos impactos ambientais|Poluicao, aquecimento e perda de biodiversidade revelam a:
cadeias produtivas poluentes|A distribuição internacional da produção pode deslocar atividades mais sujas para:
inseguranca hidrica|Mudancas no clima, uso intensivo e degradacao podem ampliar a:
sustentabilidade produtiva|Uma estrategia econômica que busca reduzir danos e preservar recursos aposta em:
conflitos socioambientais globais|Mineracao, energia e agroexportacao podem gerar disputas locais ligadas a mercados mundiais, formando:
responsabilidades diferenciadas|Nos debates ambientais costuma-se reconhecer que os países não contribuem igualmente para a crise, o que implica:
ecologia politica da globalizacao|Uma leitura critica do ambiente globalizado precisa unir economia, poder, território e:
crise ambiental planetaria|A sintese sobre ambiente e globalizacao mostra que os fluxos mundiais de produção e consumo ampliaram uma:
`
);

const bloco10 = montarBloco(
  "Geopolitica da globalizacao e interpretação critica",
  181,
  "A globalizacao deve ser lida como processo economico, tecnologico e geopolitico, atravessado por disputas de poder.",
  "avaliar-geopolitica-da-globalizacao-e-interpretacao-critica",
  `
hegemonia global|Quando uma potencia exerce forte capacidade de comando economico, militar e cultural ela tende a manter:
guerra comercial|Disputas por tarifas, subsidios e mercados entre grandes economias caracterizam:
sancao econômica|Restricoes financeiras e comerciais usadas para pressionar outro país compoem uma:
soberania tecnologica|A busca por dominar chips, dados, softwares e infraestrutura digital integra a:
regionalizacao da globalizacao|A articulacao por blocos e acordos mostra que o mundo global também se organiza por:
multinivel de poder|Na globalizacao, empresas, Estados, organismos multilaterais e plataformas exercem:
disputa por cadeias estrategicas|Semicondutores, energia e minerais tornaram-se foco de:
geoeconomia|O uso de instrumentos econômicos para ampliar poder politico e territorial define a:
desglobalizacao relativa|Movimentos de retorno de etapas produtivas e maior protecao a setores sensiveis podem indicar:
rearranjo das cadeias globais|Mudancas recentes de localizacao produtiva, estoques e fornecedores sugerem:
interdependencia conflitante|Países dependem mutuamente de tecnologia, energia e mercados, mas também competem, gerando:
ordem mundial instavel|Crises financeiras, guerras e disputas técnicas indicam uma:
nacionalismo economico|A defesa de empresas, empregos e tecnologias internas por medidas estatais integra o:
governanca global contestada|Instituicoes multilaterais existem, mas sofrem questionamentos e disputas, revelando:
fluxos sob vigilancia|Dados, capitais e mercadorias circulam globalmente, mas cada vez mais sob controle e:
globalizacao contraditoria|O mundo contemporaneo combina integração, desigualdade, cooperacao e conflito em uma:
resistência local ao global|Movimentos sociais e territoriais que enfrentam impactos de megaprojetos expressam:
autonomia estrategica|Diversificar parceiros, fortalecer industria e investir em ciência ajuda os Estados a buscar:
interpretação critica da globalizacao|Uma leitura madura do tema precisa articular redes, tecnologia, desigualdade, cultura, trabalho e:
sistema global desigual e disputado|A sintese sobre globalizacao deve reconhecer que ela conecta o planeta, mas sob um:
`
);

export const globalizacao = {
  id: "geografia_globalizacao",
  materia: "Geografia",
  serie: [2],
  topico: "Globalizacao",
  metadados: {
    disciplinaId: "geografia",
    base: "ESCOLAR",
    eixo: "Geografia",
    frente: "Geografia da globalizacao",
    searchAliases: ["globalizacao", "redes globais", "transnacionais", "financeirizacao", "economia digital", "fluxos globais"],
    subtopicosBase: [
      "Conceitos e bases da globalizacao",
      "Redes, fluxos e circulação",
      "Tecnologia, informacao e comunicação",
      "Empresas transnacionais e cadeias globais",
      "Financeirizacao e fluxos de capital",
      "Cultura, consumo e industria cultural",
      "Trabalho, reestruturacao produtiva e precarizacao",
      "Desigualdades, exclusao digital e seletividade espacial",
      "Meio ambiente e globalizacao",
      "Geopolitica da globalizacao e interpretação critica"
    ],
    habilidadesBase: [
      "identificar conceitos fundamentais da globalizacao",
      "analisar redes, fluxos e empresas transnacionais",
      "relacionar tecnologia e financeirizacao a mudancas territoriais",
      "avaliar impactos sociais, culturais e ambientais da globalizacao",
      "interpretar desigualdades e disputas geopoliticas no mundo globalizado"
    ]
  },
  questoes: [...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8, ...bloco9, ...bloco10]
};

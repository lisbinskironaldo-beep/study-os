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
  topico: "Urbanizacao",
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
      id: `ur_${String(inicio + index).padStart(3, "0")}`,
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
  "Conceitos urbanos e rede urbana",
  1,
  "Urbanizacao envolve concentracao populacional em cidades, ampliacao de serviços e articulacao em rede.",
  "identificar-conceitos-urbanos-e-rede-urbana",
  `
urbanizacao|O processo de crescimento da população urbana e da importancia das cidades é a:
cidade|O espaço com maior concentracao de construcoes, serviços e população é a:
rede urbana|O conjunto articulado de cidades por fluxos e funções forma a:
centralidade urbana|A capacidade de uma cidade atrair pessoas, serviços e decisões expressa sua:
hierarquia urbana|A organizacao das cidades em niveis diferentes de influencia forma a:
função urbana|O papel desempenhado por uma cidade na rede e sua:
metropole|Grande cidade com forte concentracao de serviços complexos e influencia regional ou nacional é uma:
cidade média|Centro urbano intermediario que articula área regional e serviços diversificados é uma:
taxa de urbanizacao|A proporcao de habitantes vivendo em cidades corresponde a:
espaço urbano|O ambiente produzido pela concentracao de moradias, vias, serviços e equipamentos é o:
concentracao urbana|O aumento do peso das cidades em relação ao campo representa:
fluxos urbanos|Movimentos de pessoas, mercadorias, informacoes e capitais entre cidades constituem:
articulacao interurbana|As ligacoes entre cidades por rodovias, comércio e serviços revelam:
núcleo urbano|A porcao consolidada e central de uma cidade pode ser chamada de:
rede de cidades|A urbanizacao moderna organiza o território por meio de uma:
urbanizacao desigual|Nem todas as regiões de um país se urbanizam no mesmo ritmo, o que indica:
território urbanizado|Espaço marcado por alta densidade de cidades, vias e serviços forma um:
dinamica urbana|A mudança constante das cidades em tamanho, função e estrutura expressa a:
cidade como nodo de rede|Uma sintese geográfica sobre urbanizacao precisa ver a cidade como:
sistema urbano articulado|O conjunto de cidades ligadas por centralidade, fluxos e hierarquia compoe um:
`
);

const bloco2 = montarBloco(
  "Metropolizacao e conurbacao",
  21,
  "O crescimento das grandes aglomeracoes urbanas amplia integracoes funcionais, deslocamentos e problemas metropolitanos.",
  "analisar-metropolizacao-e-conurbacao",
  `
metropolizacao|O processo de fortalecimento e expansao da influencia das grandes metropoles é a:
conurbacao|A uniao física entre manchas urbanas de cidades vizinhas é a:
região metropolitana|O conjunto de municipios articulados por uma metropole forma a:
periferizacao|A expansao da população e da moradia para áreas distantes e pouco equipadas expressa:
mancha urbana|A extensao continua do tecido construido de uma cidade forma a:
integração funcional metropolitana|Deslocamentos diarios, trabalho e serviços compartilhados revelam:
expansao horizontal|O crescimento da cidade para fora, ocupando novas áreas, indica:
suburbio metropolitano|Área residencial periferica integrada ao cotidiano da metropole é um:
dependencia do centro|Quando periferias concentram moradia e buscam emprego e serviços em outra área ocorre:
aglomeracao urbana|A forte concentracao de população e atividades em cidades contiguas gera:
deslocamento pendular metropolitano|O movimento diario entre municipio de moradia e de trabalho caracteriza:
macrocefalia urbana|A concentracao excessiva de população e funções em uma unica cidade pode gerar:
espraiamento urbano|A dispersao da ocupacao sobre extensas periferias corresponde ao:
fragmentacao metropolitana|A coexistencia de enclaves valorizados e periferias precarias mostra:
governanca metropolitana|A coordenacao de transporte, habitacao e saneamento entre municipios exige:
centralidade metropolitana|A metropole concentra serviços superiores, decisão e:
externalizacao dos custos urbanos|Moradia distante, longos deslocamentos e solo caro indicam:
reorganizacao regional do urbano|Quando a metropole passa a comandar municipios vizinhos ocorre:
urbanizacao metropolitana desigual|A expansao da metropole produz integração espacial, mas também:
complexo metropolitano|A sintese sobre metropolizacao destaca a articulacao entre centralidade, conurbacao, mobilidade e:
`
);

const bloco3 = montarBloco(
  "Hierarquia urbana e centralidade",
  41,
  "As cidades ocupam posicoes diferenciadas na rede urbana conforme os serviços, o comando é o alcance de sua influencia.",
  "analisar-hierarquia-urbana-e-centralidade",
  `
hierarquia urbana|A distribuição das cidades segundo o alcance de suas funções corresponde a:
cidade global|Grande metropole com peso em financas, informacao e comando transnacional é uma:
metropole nacional|Cidade de forte influencia sobre grande parte do território de um país é uma:
capital regional|Centro que organiza serviços e fluxos de uma área ampla em escala intermediaria é uma:
centro local|Pequena cidade que atende demandas cotidianas do entorno imediato é um:
alcance espacial dos serviços|Quanto mais complexo o servico, maior tende a ser o:
centralidade funcional|A capacidade de comandar fluxos, atrair pessoas e oferecer serviços define a:
rede hierarquizada de cidades|Quando alguns centros exercem mais comando que outros forma-se uma:
serviços superiores|Universidades, hospitais complexos e sedes empresariais são exemplos de:
influencia regional|A área alcancada por fluxos e serviços de uma cidade mostra sua:
polarizacao urbana|Quando uma cidade atrai fortemente pessoas e atividades do entorno ocorre:
especializacao funcional urbana|Certos centros se destacam por ramos especificos como tecnologia, turismo ou industria, formando:
comando territorial|A capacidade de organizar e decidir sobre fluxos em varias escalas expressa:
rede de centralidades|As cidades não se distribuem isoladamente, mas como uma:
interdependencia urbana|Mesmo em niveis hierarquicos diferentes, as cidades mantem:
fluxos assimetricos|As relações na rede urbana não são iguais; centros maiores costumam concentrar:
cidade nodo|Na leitura de redes, cada cidade pode ser entendida como um:
relevancia dos serviços complexos|A posicao superior de muitas cidades depende da:
estrutura urbana policentrica|Quando varias cidades compartilham funções de comando numa mesma área surge uma:
hierarquia urbana dinamica|A sintese sobre rede urbana mostra que a centralidade pode mudar com economia, infraestrutura e:
`
);

const bloco4 = montarBloco(
  "Planejamento urbano e infraestrutura",
  61,
  "As cidades exigem planejamento para organizar uso do solo, mobilidade, saneamento e acesso a serviços.",
  "analisar-planejamento-urbano-e-infraestrutura",
  `
planejamento urbano|O conjunto de ações voltadas a organizar o crescimento e os usos da cidade define o:
uso do solo urbano|A distribuição de moradias, comércio, industria e serviços no espaço da cidade compoe o:
zoneamento|A definicao de regras para diferentes funções em partes da cidade é o:
saneamento basico|Água tratada, esgoto, drenagem e residuos formam o:
mobilidade urbana|As condições de deslocamento de pessoas e cargas na cidade integram a:
infraestrutura urbana|Redes de transporte, energia, água e equipamentos publicos constituem a:
adensamento urbano|A concentracao de população e construcoes em certas áreas representa o:
expansao sem planejamento|Quando a cidade cresce sem infraestrutura adequada ocorre:
equipamentos publicos|Escolas, postos de saúde, parques e terminais são:
função social da cidade|A ideia de que a cidade deve atender coletivamente a população remete a:
regularizacao fundiaria|A legalizacao de ocupações e lotes com garantia de direitos integra a:
gestao urbana|A administracao de serviços, obras e ordenamento territorial forma a:
planejamento integrado|Combinar habitacao, saneamento, transporte e meio ambiente exige:
acesso desigual a infraestrutura|Quando bairros recebem serviços em niveis distintos aparece:
capacidade institucional municipal|Planejar e executar políticas urbanas depende da:
expansao periferica desassistida|Crescimento de bairros distantes sem serviços revela:
densidade com infraestrutura|Adensar não significa piorar a cidade se houver:
cidade bem equipada|Uma leitura positiva da urbanizacao associa crescimento com:
planejamento urbano desigual|Mesmo existindo planos, os investimentos podem priorizar algumas áreas e reforcar:
infraestrutura como direito urbano|A sintese sobre planejamento urbano destaca que serviços e equipamentos devem ser entendidos como:
`
);

const bloco5 = montarBloco(
  "Segregacao socioespacial e periferizacao",
  81,
  "As desigualdades urbanas aparecem na localizacao da moradia, no acesso a serviços e no uso desigual do território.",
  "avaliar-segregacao-socioespacial-e-periferizacao",
  `
segregacao socioespacial|A separacao de grupos sociais em áreas desiguais da cidade é a:
periferia urbana|Área geralmente mais distante do centro e com infraestrutura incompleta é a:
gentrificacao|A valorizacao de bairros com expulsao de moradores de menor renda é chamada de:
especulacao imobiliaria|A retencao e valorizacao de terrenos e imoveis em busca de lucro expressa:
periferizacao|O deslocamento de grupos de baixa renda para franjas urbanas caracteriza:
desigualdade intraurbana|As diferencas de renda, serviços e moradia dentro da mesma cidade revelam:
exclusao territorial|Quando certos grupos ficam em áreas pouco servidas e distantes de oportunidades ocorre:
fragmentacao urbana|A cidade dividida em enclaves valorizados e periferias precarizadas apresenta:
acesso desigual a cidade|Moradia, transporte e serviços distribuidos de forma desigual produzem:
mercado imobiliario seletivo|A cidade organizada pelo poder de compra e pela renda mostra um:
enclave de alta renda|Área fechada e muito valorizada voltada a grupos de maior poder aquisitivo é um:
ocupacao precária|Moradias em áreas de risco ou sem infraestrutura compoem a:
segregacao por renda|A separacao espacial baseada na capacidade econômica é a:
distância entre moradia e emprego|Longos trajetos diarios mostram efeito da:
injustica urbana|Quando a cidade distribui riscos e oportunidades de forma muito desigual aparece:
cidade dual|A coexistencia de circuitos muito modernos e outros profundamente precarizados gera uma:
perda do direito a centralidade|Grupos afastados do centro e dos serviços sofrem com:
urbanizacao excludente|O crescimento da cidade sem inclusao social ampla produz:
segregacao como forma espacial da desigualdade|Uma leitura geográfica da desigualdade urbana reconhece que ela se materializa em:
periferia como expressao da desigualdade|A sintese sobre periferizacao destaca a relação entre solo urbano caro, exclusao e:
  `
);

const bloco6 = montarBloco(
  "Mobilidade urbana e deslocamentos",
  101,
  "A mobilidade revela como a estrutura da cidade facilita ou dificulta o acesso ao trabalho, serviços e lazer.",
  "analisar-mobilidade-urbana-e-deslocamentos",
  `
mobilidade urbana|As condições de deslocamento de pessoas e cargas dentro da cidade formam a:
transporte coletivo|Onibus, metro e trem compoem o:
deslocamento pendular|O movimento diario entre local de moradia e trabalho ou estudo é o:
engarrafamento|A saturacao das vias por excesso de veiculos gera:
tempo de deslocamento|A duracao gasta para chegar a serviços e empregos corresponde ao:
acessibilidade urbana|A facilidade de uma pessoa chegar a diferentes pontos da cidade define a:
dependencia do automovel|Quando a cidade se organiza priorizando carros particulares ocorre:
integração modal|A articulacao entre onibus, metro, trem e bicicleta caracteriza a:
transporte de massa|Sistemas capazes de mover grande número de pessoas em pouco tempo formam o:
mobilidade desigual|Quando alguns grupos enfrentam mais demora, custo e dificuldade de acesso aparece:
custo espacial da periferia|Morar longe de empregos e serviços amplia o:
planejamento da circulação|Corredores, terminais e redes integradas exigem:
cidade dispersa|A expansao horizontal excessiva tende a ampliar:
politica de transporte publico|Ações estatais voltadas a ampliar acesso e reduzir deslocamentos fazem parte da:
infraestrutura viaria|Avenidas, aneis, pontes e terminais compoem a:
mobilidade ativa|Caminhada e bicicleta formam a:
exclusao por transporte|Quando a falta de deslocamento impede o acesso a direitos ocorre:
integração entre uso do solo e transporte|Uma cidade mais eficiente articula moradia, emprego e:
mobilidade como direito urbano|A leitura critica do transporte urbano precisa reconhece-lo como:
cidade funcionalmente conectada|A sintese sobre mobilidade mostra que o urbano depende da relação entre infraestrutura, distância, custo e:
`
);

const bloco7 = montarBloco(
  "Moradia, habitacao e direito a cidade",
  121,
  "A questao habitacional envolve acesso a terra urbana, infraestrutura, seguranca e permanencia na cidade.",
  "avaliar-moradia-habitacao-e-direito-a-cidade",
  `
deficit habitacional|A insuficiencia de moradias adequadas para a população corresponde ao:
habitacao social|Políticas voltadas a produzir moradia para grupos de menor renda formam a:
direito a cidade|A ideia de acesso amplo a serviços, mobilidade, cultura e moradia é o:
regularizacao fundiaria|A garantia legal de posse ou propriedade para moradores de áreas ocupadas integra a:
favelizacao|O crescimento de assentamentos precarios e sem plena infraestrutura caracteriza a:
ocupacao irregular|A instalacao de moradias em terras sem legalizacao plena gera:
precariedade habitacional|Casas sem saneamento, espaço adequado ou seguranca revelam:
politica habitacional|O conjunto de ações estatais para moradia e acesso a terra compoe a:
expulsao imobiliaria|A valorizacao fundiaria que afasta moradores pobres de certas áreas produz:
moradia digna|Uma habitacao com infraestrutura, seguranca e acesso a serviços corresponde a:
vulnerabilidade socioambiental|Morar em encostas, beiras de rio ou áreas sem drenagem amplia a:
terra urbana valorizada|Quando o solo bem localizado se torna caro e escasso fala-se em:
aluguel excessivo|Quando o custo da moradia compromete grande parte da renda familiar ocorre:
autoconstrucao periferica|A produção de moradia pelos proprios moradores em áreas distantes é a:
politica de urbanizacao de assentamentos|Levar saneamento, vias e equipamentos a bairros precarios integra a:
seguranca da posse|A estabilidade juridica para permanecer na moradia garante:
acesso desigual a localizacao|Nem toda moradia possui mesma proximidade de emprego, transporte e:
habitacao como direito social|Uma leitura geográfica da cidade deve entender a moradia como:
questao fundiaria urbana|O problema da habitacao esta ligado também ao controle da terra é a:
moradia no centro do problema urbano|A sintese sobre habitacao mostra que o direito a cidade depende de solo, renda, infraestrutura e:
`
);

const bloco8 = montarBloco(
  "Economia urbana, serviços e cidades globais",
  141,
  "As cidades concentram comércio, serviços, financas e informacao, assumindo papeis distintos na economia urbana global.",
  "analisar-economia-urbana-servicos-e-cidades-globais",
  `
economia urbana|O conjunto de atividades produtivas, comerciais e de serviços nas cidades forma a:
setor terciário urbano|Comércio, bancos, saúde e educação compoem o:
cidade global|Metropole conectada a fluxos internacionais de financas, informacao e decisão é uma:
serviços superiores|Atividades de alta complexidade como consultoria, pesquisa e financas são:
centro financeiro|Área ou cidade que concentra bancos, bolsas e decisão econômica é um:
distrito de negocios|A porcao urbana com concentracao de escritorios, sedes e serviços empresariais forma um:
economia de aglomeracao urbana|A proximidade entre empresas e serviços em uma cidade gera:
centralidade econômica|A capacidade de uma cidade atrair investimentos e decisão expressa sua:
rede de serviços complexos|Universidades, hospitais e tecnologia reforcam a:
metropole terciaria|Grande cidade cuja economia se apoia fortemente em serviços e comando é uma:
cidade informacional|Centro urbano marcado por telecomunicacoes, dados e serviços avancados é uma:
especializacao urbana de serviços|Certas cidades se destacam por financas, tecnologia, turismo ou logística, formando:
desigualdade de acesso ao consumo urbano|Nem todos os grupos usam igualmente os equipamentos e serviços da cidade, o que revela:
economia urbana polarizada|Setores muito modernos podem coexistir com informalidade e baixa renda, produzindo:
global city region|A área ampla articulada por metropole de comando internacional compoe uma:
comando corporativo urbano|Sedes de empresas e centros decisorios reforcam:
serviços intensivos em conhecimento|Ramos urbanos de alta qualificacao e base informacional compoem os:
competitividade urbana|Infraestrutura, conectividade e serviços especializados aumentam a:
cidade como centro de fluxos e comando|A sintese sobre economia urbana mostra que muitas cidades funcionam como:
urbanizacao ligada ao terciário superior|No periodo atual, grande parte do dinamismo metropolitano vem de:
`
);

const bloco9 = montarBloco(
  "Sustentabilidade urbana e cidades inteligentes",
  161,
  "O debate urbano contemporaneo inclui eficiencia, tecnologia, participacao social e reducao de impactos ambientais.",
  "relacionar-sustentabilidade-urbana-e-cidades-inteligentes",
  `
sustentabilidade urbana|A busca por reduzir impactos e melhorar qualidade de vida nas cidades define a:
cidade inteligente|O uso de tecnologia e dados para gerir serviços urbanos é uma:
gestao de residuos|Coleta, tratamento e destinacao do lixo compoem a:
drenagem urbana|As obras e sistemas para escoar aguas pluviais integram a:
ilhas de calor urbanas|O aquecimento mais intenso em áreas muito impermeabilizadas e construidas forma as:
arborizacao urbana|O plantio e manejo de arvores na cidade correspondem a:
mobilidade sustentavel|O incentivo a transporte coletivo, bicicleta e caminhada integra a:
eficiencia energetica urbana|Reduzir gasto de energia em edificios, iluminacao e serviços significa buscar:
planejamento resiliente|Preparar a cidade para enchentes, ondas de calor e outros riscos exige:
dados urbanos integrados|Sistemas de informacao usados para monitorar transito, energia e serviços compoem:
governanca urbana participativa|Quando decisão publica incorpora moradores e coletivos locais fortalece-se a:
requalificacao de áreas degradadas|A recuperacao de espacos abandonados ou poluidos para novos usos corresponde a:
infraestrutura verde|Parques, corredores vegetados e áreas permeaveis formam a:
cidade compacta|Modelo urbano que busca reduzir dispersao e longos deslocamentos é a:
resiliencia urbana|A capacidade de resistir, adaptar-se e recuperar-se de crises é a:
uso inteligente da tecnologia|Sensores e aplicativos so melhoram a cidade se articulados a:
justica socioambiental urbana|Políticas sustentaveis precisam considerar também quem mais sofre com riscos e carencias, produzindo:
inovacao urbana inclusiva|Tecnologia sem acesso social amplo pode aprofundar desigualdades, por isso a cidade inteligente deve buscar:
sustentabilidade com equidade|Uma sintese critica das cidades inteligentes deve combinar eficiencia, meio ambiente e:
futuro urbano planejado|A leitura geográfica da sustentabilidade urbana destaca a necessidade de unir tecnologia, infraestrutura, participacao e:
`
);

const bloco10 = montarBloco(
  "Leitura critica da urbanizacao contemporanea",
  181,
  "A urbanizacao atual combina redes globais, desigualdades locais, novas tecnologias e disputas pelo uso da cidade.",
  "sintetizar-a-leitura-critica-da-urbanizacao-contemporanea",
  `
urbanizacao contemporanea desigual|O crescimento atual das cidades ocorre com modernizacao de alguns setores e permanencia de exclusoes, formando uma:
cidade em rede|As cidades de hoje se articulam por fluxos materiais e informacionais, compondo uma:
metropole fragmentada|A coexistencia de centralidades modernas e periferias precarias gera uma:
circulação urbana seletiva|Nem todos os grupos conseguem deslocar-se e acessar a cidade do mesmo modo, o que produz:
centralidade policentrica|Quando varias áreas passam a concentrar comércio e serviços em uma mesma metropole surge:
expansao urbana contraditoria|A cidade pode crescer em área e infraestrutura sem garantir inclusao plena, formando:
geografia dos acessos|Distância, renda, transporte e localizacao ajudam a explicar a:
urbanizacao conectada e excludente|As redes digitais e os serviços modernos ampliam fluxos, mas também podem sustentar uma:
cidade mercantilizada|Quando o solo é a moradia são tratados sobretudo como mercadoria fortalece-se a:
governanca urbana complexa|Gerir metropoles atuais exige articular municipios, empresas, moradores e:
pressão sobre infraestrutura|O crescimento acelerado pode superar a capacidade de saneamento, transporte e:
desigualdade como forma urbana|Renda e poder aparecem materializados em bairros, vias e serviços, produzindo:
urbanizacao orientada por fluxos|Na cidade contemporanea, redes de transporte, dados, capital e informacao impulsionam uma:
território urbano disputado|Movimentos sociais, mercado imobiliario e Estado competem pelo uso da:
cidade como espaço de direitos|Uma leitura democratica do urbano reconhece a cidade como:
modernizacao urbana seletiva|Tecnologias e investimentos nem sempre chegam a toda a população, revelando:
planejamento com justica espacial|Uma politica urbana consistente precisa distribuir melhor infraestrutura, moradia e:
interpretação multiescalar do urbano|Para compreender a cidade atual e preciso ligar bairro, municipio, metropole, país e:
urbanizacao como expressao de poder|O modo como a cidade cresce depende de agentes econômicos, Estado, renda e:
sintese geográfica do urbano atual|A conclusao sobre urbanizacao contemporanea deve unir rede urbana, segregacao, mobilidade, infraestrutura, sustentabilidade e:
`
);

export const urbanizacao = {
  id: "geografia_urbanizacao",
  materia: "Geografia",
  serie: [2],
  topico: "Urbanizacao",
  metadados: {
    disciplinaId: "geografia",
    base: "ESCOLAR",
    eixo: "Geografia",
    frente: "Geografia da urbanizacao",
    searchAliases: ["urbanizacao", "rede urbana", "metropole", "segregacao socioespacial", "planejamento urbano", "mobilidade urbana"],
    subtopicosBase: [
      "Conceitos urbanos e rede urbana",
      "Metropolizacao e conurbacao",
      "Hierarquia urbana e centralidade",
      "Planejamento urbano e infraestrutura",
      "Segregacao socioespacial e periferizacao",
      "Mobilidade urbana e deslocamentos",
      "Moradia, habitacao e direito a cidade",
      "Economia urbana, serviços e cidades globais",
      "Sustentabilidade urbana e cidades inteligentes",
      "Leitura critica da urbanizacao contemporanea"
    ],
    habilidadesBase: [
      "identificar conceitos centrais da urbanizacao",
      "analisar rede urbana, centralidade e metropolizacao",
      "relacionar planejamento, infraestrutura e mobilidade ao crescimento urbano",
      "avaliar segregacao socioespacial e problemas habitacionais",
      "interpretar desigualdades e desafios da urbanizacao contemporanea"
    ]
  },
  questoes: [...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8, ...bloco9, ...bloco10]
};

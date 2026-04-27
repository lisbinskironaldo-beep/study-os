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
  "Urbanizacao envolve concentracao populacional em cidades, ampliacao de servicos e articulacao em rede.",
  "identificar-conceitos-urbanos-e-rede-urbana",
  `
urbanizacao|O processo de crescimento da populacao urbana e da importancia das cidades e a:
cidade|O espaco com maior concentracao de construcoes, servicos e populacao e a:
rede urbana|O conjunto articulado de cidades por fluxos e funcoes forma a:
centralidade urbana|A capacidade de uma cidade atrair pessoas, servicos e decisoes expressa sua:
hierarquia urbana|A organizacao das cidades em niveis diferentes de influencia forma a:
funcao urbana|O papel desempenhado por uma cidade na rede e sua:
metropole|Grande cidade com forte concentracao de servicos complexos e influencia regional ou nacional e uma:
cidade media|Centro urbano intermediario que articula area regional e servicos diversificados e uma:
taxa de urbanizacao|A proporcao de habitantes vivendo em cidades corresponde a:
espaco urbano|O ambiente produzido pela concentracao de moradias, vias, servicos e equipamentos e o:
concentracao urbana|O aumento do peso das cidades em relacao ao campo representa:
fluxos urbanos|Movimentos de pessoas, mercadorias, informacoes e capitais entre cidades constituem:
articulacao interurbana|As ligacoes entre cidades por rodovias, comercio e servicos revelam:
nucleo urbano|A porcao consolidada e central de uma cidade pode ser chamada de:
rede de cidades|A urbanizacao moderna organiza o territorio por meio de uma:
urbanizacao desigual|Nem todas as regioes de um pais se urbanizam no mesmo ritmo, o que indica:
territorio urbanizado|Espaco marcado por alta densidade de cidades, vias e servicos forma um:
dinamica urbana|A mudanca constante das cidades em tamanho, funcao e estrutura expressa a:
cidade como nodo de rede|Uma sintese geografica sobre urbanizacao precisa ver a cidade como:
sistema urbano articulado|O conjunto de cidades ligadas por centralidade, fluxos e hierarquia compoe um:
`
);

const bloco2 = montarBloco(
  "Metropolizacao e conurbacao",
  21,
  "O crescimento das grandes aglomeracoes urbanas amplia integracoes funcionais, deslocamentos e problemas metropolitanos.",
  "analisar-metropolizacao-e-conurbacao",
  `
metropolizacao|O processo de fortalecimento e expansao da influencia das grandes metropoles e a:
conurbacao|A uniao fisica entre manchas urbanas de cidades vizinhas e a:
regiao metropolitana|O conjunto de municipios articulados por uma metropole forma a:
periferizacao|A expansao da populacao e da moradia para areas distantes e pouco equipadas expressa:
mancha urbana|A extensao continua do tecido construido de uma cidade forma a:
integracao funcional metropolitana|Deslocamentos diarios, trabalho e servicos compartilhados revelam:
expansao horizontal|O crescimento da cidade para fora, ocupando novas areas, indica:
suburbio metropolitano|Area residencial periferica integrada ao cotidiano da metropole e um:
dependencia do centro|Quando periferias concentram moradia e buscam emprego e servicos em outra area ocorre:
aglomeracao urbana|A forte concentracao de populacao e atividades em cidades contiguas gera:
deslocamento pendular metropolitano|O movimento diario entre municipio de moradia e de trabalho caracteriza:
macrocefalia urbana|A concentracao excessiva de populacao e funcoes em uma unica cidade pode gerar:
espraiamento urbano|A dispersao da ocupacao sobre extensas periferias corresponde ao:
fragmentacao metropolitana|A coexistencia de enclaves valorizados e periferias precarias mostra:
governanca metropolitana|A coordenacao de transporte, habitacao e saneamento entre municipios exige:
centralidade metropolitana|A metropole concentra servicos superiores, decisao e:
externalizacao dos custos urbanos|Moradia distante, longos deslocamentos e solo caro indicam:
reorganizacao regional do urbano|Quando a metropole passa a comandar municipios vizinhos ocorre:
urbanizacao metropolitana desigual|A expansao da metropole produz integracao espacial, mas tambem:
complexo metropolitano|A sintese sobre metropolizacao destaca a articulacao entre centralidade, conurbacao, mobilidade e:
`
);

const bloco3 = montarBloco(
  "Hierarquia urbana e centralidade",
  41,
  "As cidades ocupam posicoes diferenciadas na rede urbana conforme os servicos, o comando e o alcance de sua influencia.",
  "analisar-hierarquia-urbana-e-centralidade",
  `
hierarquia urbana|A distribuicao das cidades segundo o alcance de suas funcoes corresponde a:
cidade global|Grande metropole com peso em financas, informacao e comando transnacional e uma:
metropole nacional|Cidade de forte influencia sobre grande parte do territorio de um pais e uma:
capital regional|Centro que organiza servicos e fluxos de uma area ampla em escala intermediaria e uma:
centro local|Pequena cidade que atende demandas cotidianas do entorno imediato e um:
alcance espacial dos servicos|Quanto mais complexo o servico, maior tende a ser o:
centralidade funcional|A capacidade de comandar fluxos, atrair pessoas e oferecer servicos define a:
rede hierarquizada de cidades|Quando alguns centros exercem mais comando que outros forma-se uma:
servicos superiores|Universidades, hospitais complexos e sedes empresariais sao exemplos de:
influencia regional|A area alcancada por fluxos e servicos de uma cidade mostra sua:
polarizacao urbana|Quando uma cidade atrai fortemente pessoas e atividades do entorno ocorre:
especializacao funcional urbana|Certos centros se destacam por ramos especificos como tecnologia, turismo ou industria, formando:
comando territorial|A capacidade de organizar e decidir sobre fluxos em varias escalas expressa:
rede de centralidades|As cidades nao se distribuem isoladamente, mas como uma:
interdependencia urbana|Mesmo em niveis hierarquicos diferentes, as cidades mantem:
fluxos assimetricos|As relacoes na rede urbana nao sao iguais; centros maiores costumam concentrar:
cidade nodo|Na leitura de redes, cada cidade pode ser entendida como um:
relevancia dos servicos complexos|A posicao superior de muitas cidades depende da:
estrutura urbana policentrica|Quando varias cidades compartilham funcoes de comando numa mesma area surge uma:
hierarquia urbana dinamica|A sintese sobre rede urbana mostra que a centralidade pode mudar com economia, infraestrutura e:
`
);

const bloco4 = montarBloco(
  "Planejamento urbano e infraestrutura",
  61,
  "As cidades exigem planejamento para organizar uso do solo, mobilidade, saneamento e acesso a servicos.",
  "analisar-planejamento-urbano-e-infraestrutura",
  `
planejamento urbano|O conjunto de acoes voltadas a organizar o crescimento e os usos da cidade define o:
uso do solo urbano|A distribuicao de moradias, comercio, industria e servicos no espaco da cidade compoe o:
zoneamento|A definicao de regras para diferentes funcoes em partes da cidade e o:
saneamento basico|Agua tratada, esgoto, drenagem e residuos formam o:
mobilidade urbana|As condicoes de deslocamento de pessoas e cargas na cidade integram a:
infraestrutura urbana|Redes de transporte, energia, agua e equipamentos publicos constituem a:
adensamento urbano|A concentracao de populacao e construcoes em certas areas representa o:
expansao sem planejamento|Quando a cidade cresce sem infraestrutura adequada ocorre:
equipamentos publicos|Escolas, postos de saude, parques e terminais sao:
funcao social da cidade|A ideia de que a cidade deve atender coletivamente a populacao remete a:
regularizacao fundiaria|A legalizacao de ocupacoes e lotes com garantia de direitos integra a:
gestao urbana|A administracao de servicos, obras e ordenamento territorial forma a:
planejamento integrado|Combinar habitacao, saneamento, transporte e meio ambiente exige:
acesso desigual a infraestrutura|Quando bairros recebem servicos em niveis distintos aparece:
capacidade institucional municipal|Planejar e executar politicas urbanas depende da:
expansao periferica desassistida|Crescimento de bairros distantes sem servicos revela:
densidade com infraestrutura|Adensar nao significa piorar a cidade se houver:
cidade bem equipada|Uma leitura positiva da urbanizacao associa crescimento com:
planejamento urbano desigual|Mesmo existindo planos, os investimentos podem priorizar algumas areas e reforcar:
infraestrutura como direito urbano|A sintese sobre planejamento urbano destaca que servicos e equipamentos devem ser entendidos como:
`
);

const bloco5 = montarBloco(
  "Segregacao socioespacial e periferizacao",
  81,
  "As desigualdades urbanas aparecem na localizacao da moradia, no acesso a servicos e no uso desigual do territorio.",
  "avaliar-segregacao-socioespacial-e-periferizacao",
  `
segregacao socioespacial|A separacao de grupos sociais em areas desiguais da cidade e a:
periferia urbana|Area geralmente mais distante do centro e com infraestrutura incompleta e a:
gentrificacao|A valorizacao de bairros com expulsao de moradores de menor renda e chamada de:
especulacao imobiliaria|A retencao e valorizacao de terrenos e imoveis em busca de lucro expressa:
periferizacao|O deslocamento de grupos de baixa renda para franjas urbanas caracteriza:
desigualdade intraurbana|As diferencas de renda, servicos e moradia dentro da mesma cidade revelam:
exclusao territorial|Quando certos grupos ficam em areas pouco servidas e distantes de oportunidades ocorre:
fragmentacao urbana|A cidade dividida em enclaves valorizados e periferias precarizadas apresenta:
acesso desigual a cidade|Moradia, transporte e servicos distribuidos de forma desigual produzem:
mercado imobiliario seletivo|A cidade organizada pelo poder de compra e pela renda mostra um:
enclave de alta renda|Area fechada e muito valorizada voltada a grupos de maior poder aquisitivo e um:
ocupacao precaria|Moradias em areas de risco ou sem infraestrutura compoem a:
segregacao por renda|A separacao espacial baseada na capacidade economica e a:
distancia entre moradia e emprego|Longos trajetos diarios mostram efeito da:
injustica urbana|Quando a cidade distribui riscos e oportunidades de forma muito desigual aparece:
cidade dual|A coexistencia de circuitos muito modernos e outros profundamente precarizados gera uma:
perda do direito a centralidade|Grupos afastados do centro e dos servicos sofrem com:
urbanizacao excludente|O crescimento da cidade sem inclusao social ampla produz:
segregacao como forma espacial da desigualdade|Uma leitura geografica da desigualdade urbana reconhece que ela se materializa em:
periferia como expressao da desigualdade|A sintese sobre periferizacao destaca a relacao entre solo urbano caro, exclusao e:
  `
);

const bloco6 = montarBloco(
  "Mobilidade urbana e deslocamentos",
  101,
  "A mobilidade revela como a estrutura da cidade facilita ou dificulta o acesso ao trabalho, servicos e lazer.",
  "analisar-mobilidade-urbana-e-deslocamentos",
  `
mobilidade urbana|As condicoes de deslocamento de pessoas e cargas dentro da cidade formam a:
transporte coletivo|Onibus, metro e trem compoem o:
deslocamento pendular|O movimento diario entre local de moradia e trabalho ou estudo e o:
engarrafamento|A saturacao das vias por excesso de veiculos gera:
tempo de deslocamento|A duracao gasta para chegar a servicos e empregos corresponde ao:
acessibilidade urbana|A facilidade de uma pessoa chegar a diferentes pontos da cidade define a:
dependencia do automovel|Quando a cidade se organiza priorizando carros particulares ocorre:
integracao modal|A articulacao entre onibus, metro, trem e bicicleta caracteriza a:
transporte de massa|Sistemas capazes de mover grande numero de pessoas em pouco tempo formam o:
mobilidade desigual|Quando alguns grupos enfrentam mais demora, custo e dificuldade de acesso aparece:
custo espacial da periferia|Morar longe de empregos e servicos amplia o:
planejamento da circulacao|Corredores, terminais e redes integradas exigem:
cidade dispersa|A expansao horizontal excessiva tende a ampliar:
politica de transporte publico|Acoes estatais voltadas a ampliar acesso e reduzir deslocamentos fazem parte da:
infraestrutura viaria|Avenidas, aneis, pontes e terminais compoem a:
mobilidade ativa|Caminhada e bicicleta formam a:
exclusao por transporte|Quando a falta de deslocamento impede o acesso a direitos ocorre:
integracao entre uso do solo e transporte|Uma cidade mais eficiente articula moradia, emprego e:
mobilidade como direito urbano|A leitura critica do transporte urbano precisa reconhece-lo como:
cidade funcionalmente conectada|A sintese sobre mobilidade mostra que o urbano depende da relacao entre infraestrutura, distancia, custo e:
`
);

const bloco7 = montarBloco(
  "Moradia, habitacao e direito a cidade",
  121,
  "A questao habitacional envolve acesso a terra urbana, infraestrutura, seguranca e permanencia na cidade.",
  "avaliar-moradia-habitacao-e-direito-a-cidade",
  `
deficit habitacional|A insuficiencia de moradias adequadas para a populacao corresponde ao:
habitacao social|Politicas voltadas a produzir moradia para grupos de menor renda formam a:
direito a cidade|A ideia de acesso amplo a servicos, mobilidade, cultura e moradia e o:
regularizacao fundiaria|A garantia legal de posse ou propriedade para moradores de areas ocupadas integra a:
favelizacao|O crescimento de assentamentos precarios e sem plena infraestrutura caracteriza a:
ocupacao irregular|A instalacao de moradias em terras sem legalizacao plena gera:
precariedade habitacional|Casas sem saneamento, espaco adequado ou seguranca revelam:
politica habitacional|O conjunto de acoes estatais para moradia e acesso a terra compoe a:
expulsao imobiliaria|A valorizacao fundiaria que afasta moradores pobres de certas areas produz:
moradia digna|Uma habitacao com infraestrutura, seguranca e acesso a servicos corresponde a:
vulnerabilidade socioambiental|Morar em encostas, beiras de rio ou areas sem drenagem amplia a:
terra urbana valorizada|Quando o solo bem localizado se torna caro e escasso fala-se em:
aluguel excessivo|Quando o custo da moradia compromete grande parte da renda familiar ocorre:
autoconstrucao periferica|A producao de moradia pelos proprios moradores em areas distantes e a:
politica de urbanizacao de assentamentos|Levar saneamento, vias e equipamentos a bairros precarios integra a:
seguranca da posse|A estabilidade juridica para permanecer na moradia garante:
acesso desigual a localizacao|Nem toda moradia possui mesma proximidade de emprego, transporte e:
habitacao como direito social|Uma leitura geografica da cidade deve entender a moradia como:
questao fundiaria urbana|O problema da habitacao esta ligado tambem ao controle da terra e a:
moradia no centro do problema urbano|A sintese sobre habitacao mostra que o direito a cidade depende de solo, renda, infraestrutura e:
`
);

const bloco8 = montarBloco(
  "Economia urbana, servicos e cidades globais",
  141,
  "As cidades concentram comercio, servicos, financas e informacao, assumindo papeis distintos na economia urbana global.",
  "analisar-economia-urbana-servicos-e-cidades-globais",
  `
economia urbana|O conjunto de atividades produtivas, comerciais e de servicos nas cidades forma a:
setor terciario urbano|Comercio, bancos, saude e educacao compoem o:
cidade global|Metropole conectada a fluxos internacionais de financas, informacao e decisao e uma:
servicos superiores|Atividades de alta complexidade como consultoria, pesquisa e financas sao:
centro financeiro|Area ou cidade que concentra bancos, bolsas e decisao economica e um:
distrito de negocios|A porcao urbana com concentracao de escritorios, sedes e servicos empresariais forma um:
economia de aglomeracao urbana|A proximidade entre empresas e servicos em uma cidade gera:
centralidade economica|A capacidade de uma cidade atrair investimentos e decisao expressa sua:
rede de servicos complexos|Universidades, hospitais e tecnologia reforcam a:
metropole terciaria|Grande cidade cuja economia se apoia fortemente em servicos e comando e uma:
cidade informacional|Centro urbano marcado por telecomunicacoes, dados e servicos avancados e uma:
especializacao urbana de servicos|Certas cidades se destacam por financas, tecnologia, turismo ou logistica, formando:
desigualdade de acesso ao consumo urbano|Nem todos os grupos usam igualmente os equipamentos e servicos da cidade, o que revela:
economia urbana polarizada|Setores muito modernos podem coexistir com informalidade e baixa renda, produzindo:
global city region|A area ampla articulada por metropole de comando internacional compoe uma:
comando corporativo urbano|Sedes de empresas e centros decisorios reforcam:
servicos intensivos em conhecimento|Ramos urbanos de alta qualificacao e base informacional compoem os:
competitividade urbana|Infraestrutura, conectividade e servicos especializados aumentam a:
cidade como centro de fluxos e comando|A sintese sobre economia urbana mostra que muitas cidades funcionam como:
urbanizacao ligada ao terciario superior|No periodo atual, grande parte do dinamismo metropolitano vem de:
`
);

const bloco9 = montarBloco(
  "Sustentabilidade urbana e cidades inteligentes",
  161,
  "O debate urbano contemporaneo inclui eficiencia, tecnologia, participacao social e reducao de impactos ambientais.",
  "relacionar-sustentabilidade-urbana-e-cidades-inteligentes",
  `
sustentabilidade urbana|A busca por reduzir impactos e melhorar qualidade de vida nas cidades define a:
cidade inteligente|O uso de tecnologia e dados para gerir servicos urbanos e uma:
gestao de residuos|Coleta, tratamento e destinacao do lixo compoem a:
drenagem urbana|As obras e sistemas para escoar aguas pluviais integram a:
ilhas de calor urbanas|O aquecimento mais intenso em areas muito impermeabilizadas e construidas forma as:
arborizacao urbana|O plantio e manejo de arvores na cidade correspondem a:
mobilidade sustentavel|O incentivo a transporte coletivo, bicicleta e caminhada integra a:
eficiencia energetica urbana|Reduzir gasto de energia em edificios, iluminacao e servicos significa buscar:
planejamento resiliente|Preparar a cidade para enchentes, ondas de calor e outros riscos exige:
dados urbanos integrados|Sistemas de informacao usados para monitorar transito, energia e servicos compoem:
governanca urbana participativa|Quando decisao publica incorpora moradores e coletivos locais fortalece-se a:
requalificacao de areas degradadas|A recuperacao de espacos abandonados ou poluidos para novos usos corresponde a:
infraestrutura verde|Parques, corredores vegetados e areas permeaveis formam a:
cidade compacta|Modelo urbano que busca reduzir dispersao e longos deslocamentos e a:
resiliencia urbana|A capacidade de resistir, adaptar-se e recuperar-se de crises e a:
uso inteligente da tecnologia|Sensores e aplicativos so melhoram a cidade se articulados a:
justica socioambiental urbana|Politicas sustentaveis precisam considerar tambem quem mais sofre com riscos e carencias, produzindo:
inovacao urbana inclusiva|Tecnologia sem acesso social amplo pode aprofundar desigualdades, por isso a cidade inteligente deve buscar:
sustentabilidade com equidade|Uma sintese critica das cidades inteligentes deve combinar eficiencia, meio ambiente e:
futuro urbano planejado|A leitura geografica da sustentabilidade urbana destaca a necessidade de unir tecnologia, infraestrutura, participacao e:
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
circulacao urbana seletiva|Nem todos os grupos conseguem deslocar-se e acessar a cidade do mesmo modo, o que produz:
centralidade policentrica|Quando varias areas passam a concentrar comercio e servicos em uma mesma metropole surge:
expansao urbana contraditoria|A cidade pode crescer em area e infraestrutura sem garantir inclusao plena, formando:
geografia dos acessos|Distancia, renda, transporte e localizacao ajudam a explicar a:
urbanizacao conectada e excludente|As redes digitais e os servicos modernos ampliam fluxos, mas tambem podem sustentar uma:
cidade mercantilizada|Quando o solo e a moradia sao tratados sobretudo como mercadoria fortalece-se a:
governanca urbana complexa|Gerir metropoles atuais exige articular municipios, empresas, moradores e:
pressao sobre infraestrutura|O crescimento acelerado pode superar a capacidade de saneamento, transporte e:
desigualdade como forma urbana|Renda e poder aparecem materializados em bairros, vias e servicos, produzindo:
urbanizacao orientada por fluxos|Na cidade contemporanea, redes de transporte, dados, capital e informacao impulsionam uma:
territorio urbano disputado|Movimentos sociais, mercado imobiliario e Estado competem pelo uso da:
cidade como espaco de direitos|Uma leitura democratica do urbano reconhece a cidade como:
modernizacao urbana seletiva|Tecnologias e investimentos nem sempre chegam a toda a populacao, revelando:
planejamento com justica espacial|Uma politica urbana consistente precisa distribuir melhor infraestrutura, moradia e:
interpretacao multiescalar do urbano|Para compreender a cidade atual e preciso ligar bairro, municipio, metropole, pais e:
urbanizacao como expressao de poder|O modo como a cidade cresce depende de agentes economicos, Estado, renda e:
sintese geografica do urbano atual|A conclusao sobre urbanizacao contemporanea deve unir rede urbana, segregacao, mobilidade, infraestrutura, sustentabilidade e:
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
      "Economia urbana, servicos e cidades globais",
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

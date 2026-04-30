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
  topico: "Energia",
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
      id: `en_${String(inicio + index).padStart(3, "0")}`,
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
  "Conceitos e matriz energetica",
  1,
  "Energia deve ser analisada como recurso estrategico ligado a matriz, consumo, infraestrutura e poder.",
  "identificar-conceitos-basicos-de-energia-e-matriz-energetica",
  `
matriz energetica|O conjunto das fontes usadas por um país para suprir energia forma a:
fonte renovavel|Aquela capaz de se recompor em escala humana é uma:
fonte não renovavel|Aquela de reposição muito lenta em escala geológica é uma:
energia primaria|A forma obtida diretamente da natureza antes das transformações é a:
energia secundaria|A forma resultante do processamento de outra fonte é a:
seguranca energetica|A capacidade de garantir oferta continua e confiavel de energia define a:
consumo energetico|A quantidade de energia utilizada por familias, transportes e industrias corresponde ao:
diversificacao da matriz|A ampliacao do número de fontes para reduzir riscos compoe a:
dependencia energetica|Quando um país precisa importar parte importante da energia que usa ocorre:
eficiencia energetica|Produzir e consumir com menor desperdicio expressa:
demanda de energia|A necessidade de abastecimento para economia e sociedade forma a:
transmissao de energia|O transporte da eletricidade das usinas ate os centros consumidores é a:
distribuição de energia|A entrega final da eletricidade ao consumidor integra a:
infraestrutura energetica|Usinas, redes, dutos e linhas compoem a:
planejamento energetico|A definicao de investimentos e prioridades para oferta futura forma o:
balanco energetico|A comparacao entre oferta, transformação e consumo de energia é um:
setor energetico|O conjunto de atividades de produção, transporte e distribuição de energia constitui o:
energia como recurso estrategico|Na Geografia econômica a energia deve ser entendida como:
matriz energetica desigual|Os países utilizam fontes e proporcoes diferentes, o que revela:
leitura geográfica da energia|A sintese do tema exige articular fontes, território, consumo, tecnologia e:
`
);

const bloco2 = montarBloco(
  "Fontes não renovaveis",
  21,
  "Combustiveis fosseis e minerais energeticos ainda possuem grande peso na economia mundial e no Brasil.",
  "analisar-fontes-nao-renovaveis-de-energia",
  `
petroleo|A principal fonte fossil usada em transportes e petroquimica é o:
gas natural|Combustivel fossil amplamente usado em termoeletricas e industrias é o:
carvao mineral|Fonte muito associada a siderurgia é a Primeira Revolucao Industrial é o:
combustivel fossil|Petroleo, gas e carvao são exemplos de:
refino de petroleo|A etapa que transforma oleo bruto em derivados é o:
derivados de petroleo|Gasolina, diesel e querosene fazem parte dos:
termoeletrica fossil|Usina que gera eletricidade a partir da queima de combustiveis é uma:
emissao de carbono|A queima de fontes fosseis amplia a:
reserva energetica finita|Fontes não renovaveis possuem:
dependencia de combustiveis fosseis|Matrizes baseadas em petroleo, gas e carvao revelam:
vulnerabilidade a choques de preco|Economias dependentes de petroleo e gas sofrem mais com:
geopolitica do petroleo|A disputa por reservas, oleodutos e rotas de abastecimento integra a:
exploracao offshore|A extração de petroleo no mar corresponde a:
combustao de carvao|A geracao é o uso industrial desse mineral envolvem:
gasoduto|A infraestrutura usada para transportar gas natural é o:
petroquimica|O ramo industrial que usa derivados de petroleo como base é a:
dependencia importadora de energia|Quando um país compra grande parte dos fosseis que consome ocorre:
custo ambiental elevado|As fontes não renovaveis costumam apresentar:
transicao para menor uso de fosseis|A necessidade de reduzir emissoes e dependencia de petroleo impulsiona:
leitura critica das fontes fosseis|A sintese sobre não renovaveis deve reconhecer seu peso economico, seus riscos e:
`
);

const bloco3 = montarBloco(
  "Fontes renovaveis",
  41,
  "Renovaveis ampliam a diversificacao energetica, mas também dependem de infraestrutura, tecnologia e território.",
  "analisar-fontes-renovaveis-de-energia",
  `
energia hidreletrica|A eletricidade gerada pela forca da água em movimento é a:
energia solar|A fonte obtida a partir da radiacao do Sol é a:
energia eolica|A produção eletrica pelo movimento dos ventos define a:
biomassa|A fonte derivada de materia organica vegetal ou animal é a:
energia renovavel|Fontes capazes de reposição em escala humana formam a:
painel fotovoltaico|O equipamento que converte luz solar em eletricidade é o:
parque eolico|O conjunto de aerogeradores em uma mesma área forma um:
etanol|Biocombustivel bastante associado a cana-de-acucar no Brasil é o:
biodiesel|Combustivel renovavel produzido a partir de oleos vegetais e outras matérias-primas é o:
diversificacao com renovaveis|A ampliacao de eolica, solar e biomassa favorece a:
intermitencia de certas fontes|Solar e eolica dependem de variação natural, o que produz:
armazenamento de energia|Baterias e outras tecnologias ajudam a lidar com:
uso de potencial natural|Fontes renovaveis aproveitam ventos, rios, sol e:
geracao distribuida|A produção de energia em telhados e pequenas unidades perto do consumidor constitui:
transicao energetica|A substituicao gradual de parte dos fosseis por renovaveis integra a:
baixo carbono|Matrizes com maior peso de renovaveis tendem a emitir menos:
potencial eolico do Nordeste|No Brasil a expansao dos ventos para gerar eletricidade destaca o:
energia limpa com impactos territoriais|Mesmo renovaveis podem gerar disputas locais por terra, água e:
renovaveis como estrategia de seguranca|Ampliar diversas fontes renovaveis ajuda a reduzir:
leitura geográfica das renovaveis|A sintese sobre essas fontes exige unir potencial natural, tecnologia, infraestrutura e:
`
);

const bloco4 = montarBloco(
  "Hidreletricidade e matriz brasileira",
  61,
  "A energia hidreletrica marcou a eletricidade brasileira, mas traz vulnerabilidades e conflitos socioambientais.",
  "analisar-hidreletricidade-e-matriz-brasileira",
  `
hidreletricidade predominante|Durante muito tempo a principal base da eletricidade brasileira foi a:
usina hidreletrica|A instalacao que usa a energia potencial e cinetica da água para gerar eletricidade é a:
reservatorio|A área alagada criada para acumular água para uma barragem forma o:
barragem|A estrutura que repres a água para formar o reservatorio é a:
linhas de transmissao|Para levar eletricidade gerada em longas distâncias usam-se:
vulnerabilidade hidrologica|Matrizes muito dependentes de rios sofrem com:
periodo de seca|A reducao do volume de água nos reservatorios se intensifica em:
potencial hidrico brasileiro|A grande quantidade de rios e desniveis favoreceu historicamente o:
integração entre geracao e consumo|Como parte das usinas fica longe dos grandes centros, a eletricidade depende de:
custos socioambientais de barragens|Grandes usinas podem causar deslocamentos populacionais e:
termoeletricas de apoio|Em momentos de seca o sistema brasileiro recorre mais a:
hidreletricidade amazonica|Nos ultimos decenios o avanco de barragens no Norte reforcou a:
impacto sobre comunidades ribeirinhas|Empreendimentos hidreletricos podem afetar diretamente:
regularizacao de vazoes|Reservatorios permitem certo controle da oferta de água e:
debate sobre grandes barragens|A expansao hidreletrica envolve discussoes sobre energia, território e:
matriz eletrica relativamente renovavel|Comparada a muitos países, a eletricidade brasileira apresenta:
dependencia regional de usinas distantes|Grandes centros consumidores dependem da geracao produzida em:
seguranca do sistema eletrico|A combinacao de varias fontes e redes busca garantir a:
hidreletricidade com contradicoes|A sintese sobre essa fonte no Brasil une vantagem renovavel, risco hidrologico e:
`
);

const bloco5 = montarBloco(
  "Petroleo, gas e geopolitica energetica",
  81,
  "Petroleo e gas articulam economia, financas, comércio exterior e disputas de poder em varias escalas.",
  "relacionar-petroleo-gas-e-geopolitica-energetica",
  `
pre-sal|A importante área de reservas petroliferas em aguas profundas do Brasil é o:
exploracao offshore|A extração de petroleo em plataformas marinhas corresponde a:
geopolitica energetica|A disputa por reservas, rotas e controle de energia integra a:
refinaria|A unidade industrial que processa petroleo bruto é uma:
derivados combustiveis|Gasolina, diesel e GLP pertencem aos:
gasoduto internacional|A infraestrutura que transporta gas entre países é um:
seguranca de abastecimento|Garantir combustiveis e energia em quantidade suficiente define a:
oscilação do preco do petroleo|Mercados internacionais podem alterar fortemente a:
dependencia de importação de combustiveis|Mesmo sendo produtor, um país pode precisar comprar parte dos:
royalties do petroleo|A compensacao financeira paga pela exploracao desse recurso gera:
industria petroquimica|O uso industrial de derivados para plastico e produtos quimicos integra a:
estrategia nacional de energia|Decisões sobre produção, refino e uso dos combustiveis fazem parte da:
mercado global de petroleo|A circulação internacional do oleo e organizada em um:
reserva estrategica|Estoque criado para lidar com choques e emergencias no abastecimento é uma:
dependencia de fertilizantes e gas|A agricultura é a industria podem sofrer quando faltam:
preco internacional transmitido internamente|Choques externos de petroleo podem elevar custos e:
energia como instrumento de poder|Controlar oferta e rotas de combustiveis amplia:
disputa por autonomia no refino|Produzir oleo sem processa-lo totalmente reforca a necessidade de:
petroleo entre riqueza e vulnerabilidade|A sintese sobre o setor une renda, exportação, risco externo e:
`
);

const bloco6 = montarBloco(
  "Infraestrutura, distribuição e consumo de energia",
  101,
  "A energia so chega ao consumidor por redes complexas de produção, transmissao, distribuição e regulacao.",
  "analisar-infraestrutura-distribuicao-e-consumo-de-energia",
  `
sistema interligado nacional|A rede que conecta grande parte da geracao e do consumo eletrico no Brasil é o:
transmissao eletrica|O transporte da energia em alta tensao entre usinas e centros consumidores define a:
distribuição eletrica|A etapa que leva energia da subestacao ate casas, comércio e industrias é a:
subestacao|A instalacao que transforma e redistribui tensao eletrica é a:
rede de dutos|Oleodutos e gasodutos compoem uma:
consumo residencial|A energia usada em moradias pertence ao:
consumo industrial|A eletricidade e combustiveis voltados a fabricas integram o:
consumo de transportes|Combustiveis usados em carros, caminhoes e avioes compoem o:
perda na rede|Parte da energia se dissipa no percurso de geracao ao consumo por:
tarifa energetica|O preco pago pelo uso de eletricidade e combustiveis envolve:
investimento em infraestrutura|Expandir a oferta de energia depende de:
logística dos combustiveis|A circulação de gasolina, diesel e gas exige:
universalizacao do acesso|Levar energia a todos os lares e atividades econômicas integra a:
desigualdade no consumo energetico|Grupos e regiões utilizam energia em volumes e condições diferentes, revelando:
eficiencia no uso final|Equipamentos e processos que gastam menos energia por resultado melhoram a:
demanda de pico|Os momentos de maior necessidade simultanea do sistema compoem a:
integração entre fontes|Uma matriz segura busca combinar hidreletrica, térmica, solar, eolica e:
territorialidade das redes energeticas|Linhas, dutos e usinas desenham no território uma:
energia como base da vida urbana e industrial|A sintese sobre distribuição de energia destaca seu papel na:
`
);

const bloco7 = montarBloco(
  "Energia, industria e desenvolvimento",
  121,
  "A energia condiciona competitividade industrial, transporte, emprego e possibilidades de desenvolvimento territorial.",
  "relacionar-energia-industria-e-desenvolvimento",
  `
energia como insumo produtivo|Na industria e nos serviços a energia funciona como:
competitividade industrial|Custos energeticos menores podem elevar a:
intensidade energetica|Setores que demandam muito consumo por unidade produzida apresentam alta:
setor eletrointensivo|Aluminio, siderurgia e alguns ramos quimicos fazem parte do:
localizacao industrial influenciada pela energia|Muitas fabricas se instalam considerando oferta e custo de:
apagao produtivo|A falta de fornecimento eletrico pode causar:
energia e transporte de cargas|A circulação de mercadorias depende fortemente de:
desenvolvimento regional apoiado em energia|Usinas e redes podem estimular atividades econômicas e:
investimento produtivo dependente de energia|Expandir industria e serviços exige:
energia barata e expansao econômica|Custos menores podem favorecer:
transicao energetica como oportunidade industrial|Novas fontes podem gerar equipamentos, empregos e:
cadeia produtiva da energia|Exploracao, geracao, equipamentos e redes formam uma:
dependencia tecnologica no setor energetico|Importar maquinas e sistemas para gerar energia pode manter:
desenvolvimento de fornecedores nacionais|A ampliacao da produção de equipamentos energeticos internos fortalece:
planejamento de longo prazo|Energia e desenvolvimento precisam ser articulados em:
articulacao entre matriz e economia|O tipo de energia usado no país influencia a:
energia e soberania produtiva|Quanto maior a capacidade interna de produzir e gerir o setor, maior a:
desigualdade regional no acesso a energia competitiva|Nem todas as áreas do país oferecem o mesmo ambiente para:
energia como base do desenvolvimento territorial|A sintese geográfica do tema destaca sua função para produção, circulação e:
`
);

const bloco8 = montarBloco(
  "Impactos socioambientais da produção energetica",
  141,
  "Toda fonte energetica apresenta custos territoriais e ambientais que precisam ser avaliados criticamente.",
  "avaliar-impactos-socioambientais-da-producao-energetica",
  `
impacto socioambiental|A alteracao no ambiente e na vida das populacoes causada por usinas e exploracao é um:
alagamento por barragem|A formação de grandes reservatorios pode provocar:
deslocamento compulsorio|Quando moradores precisam sair para a implantacao de obras energeticas ocorre:
emissao de gases de efeito estufa|A queima de fosseis amplia a:
contaminacao por atividades energeticas|Vazamentos e residuos do setor podem causar:
conflito territorial por usinas|Disputas entre empresa, Estado e população local em torno de empreendimentos revelam:
injustica ambiental|Quando certos grupos suportam mais danos do que beneficios ocorre:
risco tecnologico|Acidentes com plataformas, dutos e usinas envolvem:
uso intensivo da água|Hidreletricas e outras atividades podem pressionar:
degradacao de ecossistemas|A implantacao de empreendimentos pode alterar:
impacto visual e eolico local|Parques eolicos também podem gerar debates sobre:
residuos da cadeia energetica|Baterias, cinzas e estruturas antigas produzem:
licenciamento ambiental|O processo de avaliação e autorizacao de obras energeticas é o:
mitigacao de impactos|Ações voltadas a reduzir danos socioambientais formam a:
energia e clima|As escolhas da matriz influenciam diretamente a:
transicao com responsabilidade socioambiental|Ampliar renovaveis sem ignorar comunidades e ecossistemas exige:
participacao social nas decisões energeticas|Audiencias, consultas e debate publico fortalecem:
territorios de sacrificio|Áreas que concentram usinas e danos para beneficiar mercados distantes podem ser vistas como:
energia e ambiente em tensao|A sintese sobre o tema mostra que produzir energia implica equilibrar oferta, natureza e:
`
);

const bloco9 = montarBloco(
  "Transicao energetica e sustentabilidade",
  161,
  "A transicao energetica busca reduzir emissoes e dependencia fossil, mas exige tecnologia, investimento e justica territorial.",
  "analisar-transicao-energetica-e-sustentabilidade",
  `
transicao energetica|A mudança gradual para matrizes menos emissoras e mais diversificadas é a:
descarbonizacao|A reducao do peso dos combustiveis intensivos em carbono define a:
energia de baixo carbono|Fontes com menor emissao ao longo do ciclo de uso compoem a:
eletromobilidade|A substituicao de motores convencionais por veiculos eletricos impulsiona a:
armazenamento energetico|Baterias e outras solucoes ajudam a ampliar:
hidrogenio de baixo carbono|Alternativa energ ética associada a eletricidade renovavel é o:
eficiencia energetica ampliada|Consumir menos energia para atingir os mesmos resultados corresponde a:
inovacao tecnologica no setor|Novas turbinas, paineis e baterias impulsionam a:
renovacao da infraestrutura|A transicao exige modernizacao de redes, sistemas e:
justica energetica|O debate sobre quem paga, quem acessa e quem se beneficia da nova matriz remete a:
minerais estrategicos da transicao|Litio, cobre e terras raras ganharam importancia por causa da:
seguranca na mudança de matriz|Reduzir fosseis sem comprometer oferta exige:
reindustrializacao verde|A produção nacional de equipamentos renovaveis pode estimular uma:
financiamento da transicao|Expandir novas fontes e redes depende de:
mudança de padrao de consumo|A transicao não depende so da oferta, mas também de:
sustentabilidade energetica|A combinacao entre seguranca, baixo impacto e acesso social compoe a:
transicao desigual entre países|Nem todos conseguem avancar no mesmo ritmo por causa de tecnologia, renda e:
energia e clima articulados|A mudança da matriz e central para enfrentar a:
transicao energetica contraditoria|A sintese do tema mostra oportunidades industriais, mas também novos conflitos por:
`
);

const bloco10 = montarBloco(
  "Leitura geográfica da energia e interpretação critica",
  181,
  "Energia deve ser interpretada como tema geográfico, economico, ambiental e geopolitico ao mesmo tempo.",
  "sintetizar-a-leitura-geografica-da-energia",
  `
geografia da energia|O estudo da distribuição das fontes, das redes e dos conflitos energeticos integra a:
energia como fator de poder|Controlar fontes, tecnologia e rotas amplia a:
territorialidade do setor energetico|Usinas, dutos, linhas e mercados desenham no espaço uma:
matriz energetica desigual|Países e regiões usam composicoes diferentes de fontes, revelando:
interdependencia energetica|Mercados e redes fazem com que muitos países dependam mutuamente de:
vulnerabilidade a choques externos|Quem depende de importacoes ou de poucas fontes sofre mais com:
energia e organizacao do território|Grandes obras e redes de transmissao influenciam a:
escala local dos impactos|Mesmo gerando beneficios amplos, os empreendimentos afetam diretamente:
escala global das emissoes|As escolhas nacionais de matriz somam efeitos sobre:
seguranca e sustentabilidade como dilema|Garantir oferta sem ampliar danos resume um:
energia no centro da economia|Industria, transportes, cidades e agropecuaria dependem de:
planejamento energetico territorial|Definir onde gerar, transmitir e consumir exige:
articulacao entre Estado e mercado|No setor energetico convivem empresas, reguladores e:
modernizacao infraestrutural|A expansao da energia acompanha a:
energia e desigualdade social|Acesso, tarifa e localizacao de impactos mostram a:
energia e soberania nacional|Dominar parte relevante da cadeia de produção, tecnologia e distribuição amplia a:
escala regional das redes|Linhas, usinas e combustiveis conectam diferentes áreas do país em:
interpretação integrada do setor|Uma leitura madura da energia precisa juntar matriz, território, ambiente e:
energia como questao estrategica total|A sintese final deve reconhecer que o tema envolve economia, politica, tecnologia e:
  `
);

const complementos = [
  criarQuestao({
    id: "en_080",
    subtopico: "Hidreletricidade e matriz brasileira",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "A hidreletricidade brasileira so pode ser compreendida articulando potencial hidrico, reservatorios, linhas de transmissao e:",
    opcoes: ["conflitos socioambientais", "apenas relevo cristalino", "unica demanda urbana", "ausencia de riscos climaticos"],
    correta: "conflitos socioambientais",
    comentario: "A eletricidade gerada por barragens envolve ganhos de oferta e custos territoriais.",
    habilidade: "sintetizar-a-hidreletricidade-na-matriz-brasileira"
  }),
  criarQuestao({
    id: "en_100",
    subtopico: "Petroleo, gas e geopolitica energetica",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "Petroleo e gas devem ser lidos ao mesmo tempo como commodities, base industrial, fonte de renda e:",
    opcoes: ["instrumentos de poder geopolitico", "recursos sem impacto territorial", "bens desligados do refino", "fontes puramente renovaveis"],
    correta: "instrumentos de poder geopolitico",
    comentario: "O setor envolve comércio, infraestrutura, soberania e estrategia internacional.",
    habilidade: "sintetizar-petroleo-gas-e-geopolitica-energetica"
  }),
  criarQuestao({
    id: "en_120",
    subtopico: "Infraestrutura, distribuição e consumo de energia",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "A seguranca do abastecimento energetico depende da articulacao entre geracao, transmissao, distribuição, demanda e:",
    opcoes: ["planejamento territorial das redes", "somente clima estavel", "uniformidade regional", "ausencia de infraestrutura"],
    correta: "planejamento territorial das redes",
    comentario: "As redes energeticas exigem coordenacao permanente entre oferta e consumo.",
    habilidade: "sintetizar-infraestrutura-e-distribuicao-de-energia"
  }),
  criarQuestao({
    id: "en_140",
    subtopico: "Energia, industria e desenvolvimento",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "Uma economia que busca desenvolvimento duradouro precisa articular politica industrial, custo energetico, tecnologia e:",
    opcoes: ["autonomia produtiva", "apenas expansao do consumo", "dependencia externa crescente", "ausencia de planejamento"],
    correta: "autonomia produtiva",
    comentario: "Energia barata e segura so faz sentido quando combinada a estrategia produtiva de longo prazo.",
    habilidade: "sintetizar-energia-industria-e-desenvolvimento"
  }),
  criarQuestao({
    id: "en_160",
    subtopico: "Impactos socioambientais da produção energetica",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "Os danos ambientais e territoriais da geracao de energia precisam ser avaliados junto com emissoes, deslocamentos populacionais e:",
    opcoes: ["desigualdade na exposicao aos riscos", "somente oferta de eletricidade", "falta de consumidores", "estabilidade climatica garantida"],
    correta: "desigualdade na exposicao aos riscos",
    comentario: "Os custos do setor energetico não recaem igualmente sobre todos os grupos e lugares.",
    habilidade: "sintetizar-impactos-socioambientais-da-energia"
  }),
  criarQuestao({
    id: "en_180",
    subtopico: "Transicao energetica e sustentabilidade",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "A transicao energetica exige reduzir fosseis, ampliar renovaveis, modernizar redes e enfrentar:",
    opcoes: ["novas dependências tecnologicas e minerais", "somente a insolacao", "o fim do consumo urbano", "a inexistencia de mercado"],
    correta: "novas dependências tecnologicas e minerais",
    comentario: "A mudança de matriz não elimina automaticamente assimetrias e disputas por recursos.",
    habilidade: "sintetizar-a-transicao-energetica"
  }),
  criarQuestao({
    id: "en_200",
    subtopico: "Leitura geográfica da energia e interpretação critica",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "A energia deve ser interpretada como tema territorial total, pois conecta matrizes, redes, ambiente, economia e:",
    opcoes: ["relações de poder", "apenas forma do relevo", "somente clima regional", "estrutura etária"],
    correta: "relações de poder",
    comentario: "A distribuição das fontes e das infraestruturas energeticas expressa escolhas econômicas e geopoliticas.",
    habilidade: "sintetizar-a-leitura-geografica-da-energia"
  })
];

export const energia = {
  id: "geografia_energia",
  materia: "Geografia",
  serie: [3],
  topico: "Energia",
  metadados: {
    disciplinaId: "geografia",
    base: "ESCOLAR",
    eixo: "Geografia",
    frente: "Geografia da energia",
    searchAliases: ["energia", "matriz energetica", "hidreletrica", "petroleo", "transicao energetica", "geopolitica energetica"],
    subtopicosBase: [
      "Conceitos e matriz energetica",
      "Fontes não renovaveis",
      "Fontes renovaveis",
      "Hidreletricidade e matriz brasileira",
      "Petroleo, gas e geopolitica energetica",
      "Infraestrutura, distribuição e consumo de energia",
      "Energia, industria e desenvolvimento",
      "Impactos socioambientais da produção energetica",
      "Transicao energetica e sustentabilidade",
      "Leitura geográfica da energia e interpretação critica"
    ],
    habilidadesBase: [
      "identificar conceitos e fontes de energia",
      "analisar matriz energetica, infraestrutura e seguranca do abastecimento",
      "relacionar energia, economia, industria e geopolitica",
      "avaliar impactos socioambientais da produção energetica",
      "sintetizar a transicao energetica em perspectiva geográfica"
    ]
  },
  questoes: [...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8, ...bloco9, ...bloco10, ...complementos].sort((a, b) => a.id.localeCompare(b.id))
};

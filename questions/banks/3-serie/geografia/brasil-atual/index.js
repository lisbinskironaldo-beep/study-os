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
  topico: "Brasil Atual",
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
      id: `ba_${String(inicio + index).padStart(3, "0")}`,
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
  "Territorio e regionalizacao do Brasil",
  1,
  "O Brasil atual deve ser lido a partir de sua extensao territorial, diversidade regional e articulacao desigual dos espacos.",
  "identificar-territorio-e-regionalizacao-do-brasil",
  `
regioes brasileiras|A divisao oficial do territorio nacional em Norte, Nordeste, Centro-Oeste, Sudeste e Sul forma as:
regionalizacao|O ato de dividir o territorio em partes segundo criterios especificos e a:
diversidade regional|As grandes diferencas naturais, economicas e sociais entre areas do pais revelam a:
territorio nacional|O espaco sob soberania do Estado brasileiro corresponde ao:
faixa de fronteira|A zona terrestre proxima aos limites internacionais do pais e a:
zona costeira|A porcao do territorio articulada ao litoral e aos usos maritimos forma a:
dominio amazonico|A extensa area de florestas tropicais no Norte integra o:
semiarido nordestino|A porcao de clima mais seco do Nordeste corresponde ao:
centro-sul dinamico|A area de maior concentracao economica e tecnico-cientifica do pais pode ser chamada de:
complexidade regional|As diferencas de populacao, economia e infraestrutura entre as regioes mostram a:
integracao territorial desigual|As redes de transporte e comunicacao conectam o Brasil, mas de forma:
densidade tecnica regional|Algumas regioes concentram mais infraestrutura, servicos e tecnologia, revelando maior:
ocupacao historica seletiva|A forma desigual de povoamento e organizacao do territorio brasileiro resulta de:
espaco agrario e urbano articulado|No Brasil contemporaneo campo e cidade se relacionam em um:
rede regional de cidades|A articulacao de centros urbanos em diferentes escalas no interior das regioes forma uma:
reorganizacao territorial recente|Novos eixos de expansao produtiva mostram uma:
contrastes intrarregionais|Dentro da mesma regiao podem coexistir areas modernas e areas precarias, formando:
fronteira economica interna|Areas de expansao recente da agropecuaria, da mineracao e da infraestrutura constituem:
leitura multiescalar do Brasil|Interpretar o Brasil atual exige relacionar municipio, estado, regiao e:
territorio brasileiro desigual e integrado|A sintese sobre o espaco nacional deve reconhecer que o Brasil e ao mesmo tempo:
`
);

const bloco2 = montarBloco(
  "Populacao e dinamicas demograficas",
  21,
  "O Brasil atual apresenta transicao demografica avancada, urbanizacao elevada e desigualdades populacionais persistentes.",
  "analisar-populacao-e-dinamicas-demograficas-do-brasil",
  `
transicao demografica|A passagem de altas taxas de natalidade e mortalidade para niveis mais baixos caracteriza a:
envelhecimento populacional|O aumento relativo da participacao de idosos na populacao brasileira indica:
queda da fecundidade|A reducao do numero medio de filhos por mulher mostra a:
urbanizacao elevada|A grande maioria da populacao brasileira vivendo em cidades expressa:
estrutura etaria em mudanca|A diminuicao relativa da base da piramide e o aumento da faixa adulta revelam:
densidade demografica desigual|A populacao brasileira nao se distribui uniformemente, o que evidencia:
migracao interna|Os deslocamentos populacionais entre regioes e estados do pais formam a:
mobilidade pendular|O deslocamento diario entre moradia e trabalho ou estudo nas areas urbanas e a:
metropolizacao populacional|A concentracao humana em grandes aglomeracoes e regioes metropolitanas compoe a:
interiorizacao do povoamento|O crescimento de cidades medias e novas frentes economicas revela:
reducao do crescimento vegetativo|Com menos nascimentos e maior envelhecimento ocorre:
distribuicao desigual da populacao|O litoral e certas metropoles concentram mais habitantes, mostrando:
desigualdades sociodemograficas|Renda, escolaridade, acesso a saude e composicao etaria revelam:
populacao economicamente ativa|O grupo em idade e condicao de trabalho compoe a:
transicao urbana consolidada|A predominancia historica do modo de vida urbano no pais indica:
mudanca no perfil das familias|A reducao do tamanho medio dos lares brasileiros mostra:
pressao sobre politicas sociais|O envelhecimento e as desigualdades regionais ampliam desafios em:
seletividade migratoria|Certos fluxos internos concentram jovens e trabalhadores, revelando:
dinamica populacional complexa|No Brasil atual natalidade, migracoes, urbanizacao e envelhecimento formam uma:
leitura geografica da populacao brasileira|A sintese demografica do pais exige articular distribuicao espacial, estrutura etaria e:
`
);

const bloco3 = montarBloco(
  "Urbanizacao e rede urbana brasileira",
  41,
  "A urbanizacao brasileira formou metropoles, cidades medias e fortes contrastes de infraestrutura e servicos.",
  "analisar-urbanizacao-e-rede-urbana-brasileira",
  `
rede urbana brasileira|O conjunto articulado de cidades e fluxos no pais forma a:
metropole nacional|Grande cidade brasileira com ampla influencia economica e funcional sobre o territorio e uma:
cidade media dinamica|Centro urbano intermediario que ganhou relevancia com servicos e economia regional e uma:
hierarquia urbana nacional|A organizacao das cidades brasileiras em diferentes niveis de centralidade e a:
conurbacao|A uniao fisica entre manchas urbanas de municipios vizinhos corresponde a:
regiao metropolitana|O conjunto de municipios fortemente articulados por uma grande cidade forma a:
periferizacao urbana|A expansao das moradias de baixa renda para areas distantes e a:
segregacao socioespacial|A separacao de grupos sociais em areas desiguais da cidade e a:
macrocefalia urbana|A concentracao excessiva de populacao e funcoes em poucas metropoles pode gerar:
rede policentrica emergente|O fortalecimento de varias cidades medias e capitais regionais sugere uma:
urbanizacao desigual|O acesso a moradia, saneamento e transporte nas cidades brasileiras ocorre de forma:
mobilidade pendular metropolitana|Nas grandes metropoles brasileiras sao comuns:
centralidade de servicos|Certas cidades se destacam por universidades, hospitais e comercio regional, reforcando sua:
infraestrutura urbana incompleta|Muitas periferias brasileiras revelam carencias de saneamento, transporte e:
expansao horizontal das cidades|O espraiamento do tecido urbano para zonas perifericas caracteriza a:
cidade-regiao|A articulacao funcional de uma metropole com municipios vizinhos e com cidades proximas forma uma:
economia urbana terciarizada|Grande parte do dinamismo recente das cidades brasileiras esta ligada ao:
problemas metropolitanos|Violencia, congestionamento, segregacao e poluicao compoem os:
urbanizacao brasileira contraditoria|A sintese sobre o urbano no Brasil atual combina modernizacao, desigualdade e:
`
);

const bloco4 = montarBloco(
  "Economia e reestruturacao produtiva",
  61,
  "O Brasil atual combina agroexportacao, industria desigual, servicos e financeirizacao em um territorio heterogeneo.",
  "analisar-economia-e-reestruturacao-produtiva-no-brasil",
  `
reestruturacao produtiva|As mudancas na localizacao de empresas, no trabalho e nos setores economicos formam a:
desindustrializacao relativa|A perda de peso da industria na estrutura produtiva e um processo de:
terciarizacao da economia|O aumento da participacao de comercio e servicos no emprego e na renda expressa:
agroexportacao moderna|A forte presenca do agronegocio voltado ao mercado externo caracteriza a:
economia de servicos|No Brasil atual uma parte expressiva do PIB e do emprego esta no setor de:
complexidade produtiva desigual|Algumas regioes concentram industrias e tecnologia, enquanto outras permanecem mais dependentes de:
concentracao financeira|Sedes bancarias, bolsas e grandes servicos empresariais reforcam a:
interiorizacao industrial seletiva|A ida de plantas industriais para novas regioes e uma forma de:
dependencia de commodities|Quando exportacoes ficam muito concentradas em produtos primarios ocorre:
cadeias produtivas territoriais|A articulacao entre fornecedores, logistica e mercado forma:
competitividade regional|Infraestrutura, qualificacao e mercado ajudam a explicar a:
economia informacional|O peso crescente de dados, telecomunicacoes e servicos complexos na producao integra a:
especializacao produtiva regional|Determinadas areas do pais se destacam por ramos especificos, formando:
mercado interno desigual|As diferencas de renda e de consumo entre as regioes afetam o:
trabalho flexibilizado|A ampliacao de terceirizacao, plataformas e contratos instaveis favorece:
conexao entre campo e industria|Agroindustria, insumos e logistica mostram a:
insercao subordinada em cadeias globais|Exportar muito valor primario e importar tecnologia pode reforcar:
economia brasileira heterogenea|A coexistencia de atividades modernas e atrasadas revela uma:
desenvolvimento regional desequilibrado|A sintese economica do Brasil atual destaca crescimento seletivo e:
`
);

const bloco5 = montarBloco(
  "Agropecuaria e questao agraria",
  81,
  "O campo brasileiro combina agronegocio moderno, conflitos por terra, desigualdade fundiaria e pressao ambiental.",
  "avaliar-agropecuaria-e-questao-agraria-no-brasil",
  `
agronegocio|O sistema que articula producao agropecuaria, industria, credito e exportacao e o:
concentracao fundiaria|A posse de grande parte das terras nas maos de poucos proprietarios revela:
fronteira agricola|A expansao de lavouras e pecuaria sobre novas areas do territorio compoe a:
monocultura exportadora|A producao em larga escala de poucos produtos voltados ao mercado externo e a:
agroindustria|A integracao entre o campo e a transformacao industrial dos produtos rurais forma a:
conflito pela terra|A disputa entre grandes proprietarios, comunidades e trabalhadores pelo uso fundiario gera:
reforma agraria|A politica de redistribuicao de terras e apoio a pequenos produtores corresponde a:
agricultura familiar|A producao baseada em pequenas propriedades e trabalho da familia integra a:
mecanizacao do campo|O uso intensivo de tratores, colheitadeiras e maquinas expressa a:
uso intensivo de insumos|Sementes melhoradas, fertilizantes e agroquimicos compoem o:
expulsao de trabalhadores rurais|A modernizacao do campo sem absorcao de mao de obra pode gerar:
desmatamento por expansao agropecuaria|A abertura de novas areas para pastos e lavouras provoca:
cadeia global de alimentos|A articulacao do campo brasileiro com tradings, portos e mercados externos forma a:
pressao sobre povos e comunidades tradicionais|A ampliacao da fronteira produtiva pode intensificar:
seguranca alimentar desigual|Mesmo com grande producao agricola, persistem desafios ligados ao:
especializacao regional do campo|Soja, cana, gado e frutas se distribuem de modo diferente pelo pais, revelando:
campo tecnificado e campo precario|A realidade rural brasileira combina modernizacao e:
questao agraria persistente|Concentracao fundiaria, conflitos e desigualdade mantem viva a:
leitura geografica do campo brasileiro|A sintese da agropecuaria atual exige articular tecnologia, terra, exportacao e:
`
);

const bloco6 = montarBloco(
  "Infraestrutura e integracao territorial",
  101,
  "Rodovias, portos, energia, telecomunicacoes e logistica estruturam a integracao desigual do territorio brasileiro.",
  "analisar-infraestrutura-e-integracao-territorial-no-brasil",
  `
integracao territorial|A conexao entre regioes brasileiras por transporte, energia e comunicacao forma a:
malha rodoviaria|No Brasil a principal base de circulacao terrestre de cargas e a:
corredor logistico|O conjunto de vias, terminais e servicos voltado ao escoamento de producao constitui um:
porto exportador|Instalacao fundamental para a saida de commodities e manufaturas ao exterior e um:
ferrovia de cargas|Modal usado para longas distancias e grande volume de mercadorias e a:
rede de energia|A articulacao entre geracao, transmissao e distribuicao eletrica forma a:
telecomunicacoes|Internet, telefonia e transmissao de dados compoem o setor de:
integracao seletiva do territorio|As obras de infraestrutura beneficiam algumas areas mais do que outras, revelando:
gargalo logistico|Quando a rede de transportes nao acompanha a producao surge um:
capacidade de escoamento|A eficiencia de levar bens das areas produtivas aos mercados expressa a:
densidade infraestrutural desigual|Algumas regioes possuem mais rodovias, energia e servicos, mostrando:
eixos de desenvolvimento|Grandes obras e circuitos produtivos podem formar:
interiorizacao conectada|A expansao economica para cidades medias e novas fronteiras depende de:
dependencia rodoviaria|A forte centralidade das estradas no transporte brasileiro expressa:
articulacao porto-hinterland|A ligacao entre o porto e sua area de abastecimento no interior e a:
infraestrutura como fator locacional|Empresas escolhem certas areas do territorio por causa da:
fluidez territorial|A facilidade de circulacao de mercadorias, informacoes e pessoas depende da:
desigualdade de acesso a redes tecnicas|Nem todos os lugares do Brasil possuem a mesma insercao em energia, dados e transporte, o que mostra:
territorio como suporte material da economia|A sintese sobre infraestrutura destaca o Brasil como um espaco organizado por obras, fluxos e:
`
);

const bloco7 = montarBloco(
  "Desigualdades regionais e sociais",
  121,
  "As diferencas de renda, servicos e oportunidades entre regioes e grupos sociais marcam fortemente o Brasil contemporaneo.",
  "avaliar-desigualdades-regionais-e-sociais-no-brasil",
  `
desigualdade regional|As diferencas de renda, infraestrutura e dinamismo entre partes do pais caracterizam:
concentracao de renda|Quando grande parcela da riqueza se acumula nas maos de poucos ocorre:
desigualdade socioespacial|A distribuicao desigual de servicos e oportunidades no territorio revela:
contraste centro-periferia|A oposicao entre areas valorizadas e areas precarias nas cidades forma o:
acesso desigual a servicos|Saude, educacao, transporte e saneamento nao chegam da mesma forma a todos, produzindo:
segregacao social urbana|A separacao territorial de grupos por renda e condicoes de vida e uma:
desigualdade no campo e na cidade|No Brasil atual as diferencas socioespaciais aparecem tanto em areas rurais quanto:
vulnerabilidade social|Grupos com baixa renda, servicos insuficientes e alta exposicao a riscos apresentam:
inclusao seletiva|Alguns territ orios entram nos circuitos modernos sem receber plenamente seus beneficios, revelando:
mobilidade social limitada|Quando oportunidades de ascensao permanecem restritas para muitos grupos ocorre:
servicos publicos desiguais|A diferenca de qualidade entre escolas, hospitais e infraestrutura expressa:
regionalizacao do desenvolvimento desigual|O fato de certas areas terem mais dinamismo economico e outras mais carencias mostra:
periferias metropolitanas|Nas grandes cidades brasileiras, muitas desigualdades se concentram nas:
desigualdade racial e territorial|No Brasil, cor, renda e localizacao muitas vezes se cruzam produzindo:
trabalho informal e renda baixa|Setores pouco protegidos e mal remunerados reforcam:
exclusao urbana|Quando moradores nao acessam plenamente servicos, mobilidade e centralidade ocorre:
persistencia historica de desigualdades|Colonizacao, escravidao e concentracao fundiaria ajudam a explicar a:
articulacao entre escala regional e social|Uma leitura geografica das desigualdades brasileiras exige relacionar territorio, renda e:
Brasil socialmente heterogeneo|A sintese sobre desigualdades no pais destaca a convivencia de modernizacao com:
`
);

const bloco8 = montarBloco(
  "Politicas territoriais e fronteiras",
  141,
  "Acoes do Estado, fronteiras internacionais e ocupacao de novas areas influenciam a organizacao do territorio brasileiro.",
  "analisar-politicas-territoriais-e-fronteiras-do-brasil",
  `
politica territorial|As acoes estatais voltadas a organizar o espaco nacional compoem a:
fronteira internacional|A linha de contato do Brasil com outros paises corresponde a:
faixa de fronteira|A area terrestre proxima ao limite internacional e a:
integracao sul-americana|A articulacao do Brasil com vizinhos por infraestrutura e comercio faz parte da:
ocupacao de fronteiras internas|A expansao para novas areas produtivas dentro do pais forma a:
presenca estatal no territorio|Bases, obras, fiscalizacao e servicos publicos revelam a:
planejamento regional|A definicao de prioridades para desenvolver certas areas integra o:
seguranca territorial|A protecao do territorio, de suas fronteiras e infraestruturas estrategicas compoe a:
cooperacao transfronteirica|A relacao cotidiana entre cidades e regioes em lados diferentes da fronteira mostra:
fronteira como zona de fluxos|Mais que linha fixa, a fronteira tambem pode ser entendida como:
vigilancia de fronteiras|O controle de circulacao de mercadorias, pessoas e atividades ilicitas exige:
projetos de integracao fisica|Rodovias, pontes e linhas de energia voltadas a articular o continente formam:
ocupacao planejada da Amazonia|Programas e obras voltados ao Norte do pais integram a:
questao fundiaria em areas de fronteira|A abertura de novas frentes produtivas pode intensificar:
fronteiras vivas|A forte circulacao de pessoas e mercadorias em areas limitrofes caracteriza:
Estado como agente territorial|No Brasil, o poder publico influencia o espaco por leis, obras e:
uso estrategico do territorio|Portos, fronteiras, energia e corredores de exportacao mostram o:
politicas regionais desiguais|Nem todos os espacos recebem o mesmo volume de investimento estatal, o que revela:
territorio nacional em disputa|A sintese sobre fronteiras e politicas territoriais reconhece que o Brasil atual e moldado por Estado, mercado e:
`
);

const bloco9 = montarBloco(
  "Brasil no mundo e insercao internacional",
  161,
  "O Brasil participa da economia mundial por exportacoes, diplomacia, agronegocio, energia e articulacoes regionais.",
  "analisar-o-brasil-no-mundo-e-sua-insercao-internacional",
  `
insercao internacional do Brasil|A forma como o pais participa do comercio, da diplomacia e das cadeias globais define sua:
exportacao de commodities|O peso de soja, minerio e petroleo nas vendas externas brasileiras mostra a:
dependencia de mercados externos|Quando a economia nacional fica sensivel a variacoes de demanda mundial ocorre:
potencia regional|Na America do Sul o Brasil frequentemente e visto como uma:
balanca comercial brasileira|A diferenca entre exportacoes e importacoes do pais compoe a:
agroexportacao competitiva|A forte presenca de produtos rurais nas vendas externas revela a:
semiperiferia|A posicao do Brasil entre dependencia e relevancia regional pode ser associada a:
relacoes sul-sul|A ampliacao de parcerias entre paises em desenvolvimento integra as:
participacao em blocos regionais|A atuacao do Brasil em esquemas de integracao sul-americana mostra:
diversificacao de parceiros comerciais|A busca por reduzir dependencia de poucos mercados envolve:
papel diplomatico regional|Mediacoes, negociacoes e lideranca em temas continentais expressam o:
industrializacao incompleta|A dificuldade de consolidar setores tecnologicos sofisticados limita a:
valor agregado insuficiente|Exportar muitos produtos primarios e poucos bens complexos revela:
geoeconomia brasileira|A relacao entre territorio, energia, agroexportacao e mercado mundial compoe a:
vulnerabilidade externa|Crises cambiais, oscilacao de commodities e dependencia tecnologica podem ampliar:
projecao internacional seletiva|O Brasil possui relevancia em alguns temas globais, mas com limites em:
papel ambiental global do Brasil|Amazonia, clima e biodiversidade ampliam a importancia do pais em:
estrategia nacional de desenvolvimento|Para melhorar sua insercao externa o Brasil precisa articular industria, ciencia, energia e:
Brasil entre autonomia e dependencia|A sintese sobre a posicao internacional do pais mostra uma combinacao de:
`
);

const bloco10 = montarBloco(
  "Leitura geografica do Brasil contemporaneo",
  181,
  "Interpretar o Brasil atual exige unir territorio, populacao, economia, urbanizacao, desigualdades e poder.",
  "sintetizar-a-leitura-geografica-do-brasil-contemporaneo",
  `
leitura multiescalar do Brasil|Para compreender o pais atual e preciso articular local, regional, nacional e:
territorio usado|O espaco brasileiro apropriado por Estado, empresas e sociedade e o:
formacao socioespacial brasileira|A relacao historica entre sociedade e territorio no pais compoe a:
modernizacao desigual|Infraestruturas, tecnologia e servicos nao avancam com a mesma intensidade em todo o pais, produzindo:
rede nacional de fluxos|Transportes, informacoes, capitais e pessoas articulam o Brasil em uma:
desenvolvimento territorial contraditorio|O pais combina dinamismo economico e permanencia de desigualdades, revelando:
articulacao campo-cidade|Agronegocio, agroindustria, servicos e consumo mostram a:
urbanizacao com periferizacao|A maioria urbana do Brasil nao eliminou, mas reorganizou a:
economia heterogenea|A convivencia de setores modernos e setores precarios indica uma:
regionalizacao viva|As regioes brasileiras nao sao apenas recortes estaticos, mas espacos de:
territorio integrado e fragmentado|Ao mesmo tempo que redes conectam o pais, desigualdades produzem um Brasil:
questao socioambiental brasileira|Agropecuaria, energia, cidades e biomas formam a:
Estado e mercado como agentes espaciais|A organizacao do territorio brasileiro depende fortemente de:
centralidades e periferias nacionais|Algumas regioes e cidades concentram comando, enquanto outras assumem posicao secundaria, criando:
escala regional das politicas publicas|Muitos problemas brasileiros exigem respostas diferenciadas conforme a:
Brasil urbano-industrial-agroexportador|Uma sintese da economia contemporanea do pais pode ser dada por sua condicao:
geografia dos contrastes|As diferencas de renda, infraestrutura, biomas e populacao formam a:
desafio de coesao territorial|Integrar o territorio com menor desigualdade regional e social exige enfrentar o:
analise geografica integrada do Brasil|A interpretacao mais madura do pais atual depende de unir territorio, sociedade, economia e:
Brasil contemporaneo complexo e desigual|A sintese final sobre o tema deve reconhecer o pais como:
  `
);

const complementos = [
  criarQuestao({
    id: "ba_060",
    subtopico: "Urbanizacao e rede urbana brasileira",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "A leitura da rede urbana brasileira fica mais precisa quando se articulam metropoles, cidades medias, fluxos regionais e desigualdade de infraestrutura, formando uma:",
    opcoes: ["urbanizacao nacional hierarquizada", "paisagem rural homogenea", "estrutura climatica unica", "rede sem centralidade"],
    correta: "urbanizacao nacional hierarquizada",
    comentario: "A urbanizacao brasileira combina integracao em rede e fortes contrastes territoriais.",
    habilidade: "sintetizar-a-rede-urbana-brasileira"
  }),
  criarQuestao({
    id: "ba_080",
    subtopico: "Economia e reestruturacao produtiva",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "Uma sintese geografica da economia brasileira atual deve unir agroexportacao, servicos, industria desigual, financas e:",
    opcoes: ["reorganizacao territorial da producao", "apenas clima tropical", "homogeneidade social", "ausencia de redes logisticas"],
    correta: "reorganizacao territorial da producao",
    comentario: "Os circuitos produtivos contemporaneos remodelam regioes, cidades e fluxos.",
    habilidade: "sintetizar-a-reestruturacao-produtiva-no-brasil"
  }),
  criarQuestao({
    id: "ba_100",
    subtopico: "Agropecuaria e questao agraria",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "No campo brasileiro contemporaneo, agronegocio, conflitos fundiarios, tecnologia e desmatamento precisam ser lidos como partes de uma mesma:",
    opcoes: ["questao agraria territorializada", "paisagem urbana integrada", "rede industrial fechada", "estrutura climatica estavel"],
    correta: "questao agraria territorializada",
    comentario: "A questao agraria envolve terra, poder, producao e ambiente ao mesmo tempo.",
    habilidade: "sintetizar-a-questao-agraria-no-brasil-atual"
  }),
  criarQuestao({
    id: "ba_120",
    subtopico: "Infraestrutura e integracao territorial",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "A infraestrutura brasileira integra o territorio, mas tambem evidencia seletividade espacial, gargalos e concentracao de investimentos. Isso define uma:",
    opcoes: ["integracao territorial desigual", "ocupacao totalmente equilibrada", "rede sem hierarquias", "economia sem logistica"],
    correta: "integracao territorial desigual",
    comentario: "As redes tecnicas conectam o pais, mas nao eliminam assimetrias regionais.",
    habilidade: "sintetizar-a-integracao-territorial-brasileira"
  }),
  criarQuestao({
    id: "ba_140",
    subtopico: "Desigualdades regionais e sociais",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "Uma interpretacao madura das desigualdades brasileiras deve relacionar renda, racismo, localizacao, acesso a servicos e:",
    opcoes: ["historia territorial do desenvolvimento", "somente relevo regional", "tipos de solo", "estrutura dos rios"],
    correta: "historia territorial do desenvolvimento",
    comentario: "As desigualdades do presente resultam de processos historicos longos e espacialmente seletivos.",
    habilidade: "sintetizar-desigualdades-regionais-e-sociais-no-brasil"
  }),
  criarQuestao({
    id: "ba_160",
    subtopico: "Politicas territoriais e fronteiras",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "Fronteiras, obras estrategicas e presenca estatal mostram que o territorio brasileiro e continuamente reorganizado por politicas, fluxos e:",
    opcoes: ["interesses geoeconomicos", "apenas fatores climaticos", "formas de relevo fixas", "zonas sem populacao"],
    correta: "interesses geoeconomicos",
    comentario: "As politicas territoriais combinam soberania, integracao e disputa por recursos e circulacao.",
    habilidade: "sintetizar-politicas-territoriais-e-fronteiras-do-brasil"
  }),
  criarQuestao({
    id: "ba_180",
    subtopico: "Brasil no mundo e insercao internacional",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "A insercao internacional do Brasil ganha sentido geografico quando se conectam agroexportacao, diplomacia, recursos naturais, mercado externo e:",
    opcoes: ["projeto nacional de desenvolvimento", "somente extensao territorial", "clima tropical dominante", "padrao fixo de migracao"],
    correta: "projeto nacional de desenvolvimento",
    comentario: "A posicao do pais no mundo depende tanto do mercado quanto das escolhas estrategicas internas.",
    habilidade: "sintetizar-a-insercao-internacional-do-brasil"
  })
];

export const brasilAtual = {
  id: "geografia_brasil_atual",
  materia: "Geografia",
  serie: [3],
  topico: "Brasil Atual",
  metadados: {
    disciplinaId: "geografia",
    base: "ESCOLAR",
    eixo: "Geografia",
    frente: "Geografia do Brasil contemporaneo",
    searchAliases: ["brasil atual", "territorio brasileiro", "desigualdades regionais", "rede urbana brasileira", "questao agraria", "brasil no mundo"],
    subtopicosBase: [
      "Territorio e regionalizacao do Brasil",
      "Populacao e dinamicas demograficas",
      "Urbanizacao e rede urbana brasileira",
      "Economia e reestruturacao produtiva",
      "Agropecuaria e questao agraria",
      "Infraestrutura e integracao territorial",
      "Desigualdades regionais e sociais",
      "Politicas territoriais e fronteiras",
      "Brasil no mundo e insercao internacional",
      "Leitura geografica do Brasil contemporaneo"
    ],
    habilidadesBase: [
      "identificar dimensoes territoriais e regionais do Brasil atual",
      "analisar dinamicas populacionais, urbanas e produtivas no pais",
      "relacionar agropecuaria, infraestrutura e insercao internacional ao territorio brasileiro",
      "avaliar desigualdades regionais, sociais e politicas territoriais",
      "sintetizar uma leitura geografica integrada do Brasil contemporaneo"
    ]
  },
  questoes: [...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8, ...bloco9, ...bloco10, ...complementos].sort((a, b) => a.id.localeCompare(b.id))
};

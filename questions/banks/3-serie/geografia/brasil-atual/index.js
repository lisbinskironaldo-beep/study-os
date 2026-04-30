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
  "Território e regionalizacao do Brasil",
  1,
  "O Brasil atual deve ser lido a partir de sua extensao territorial, diversidade regional e articulacao desigual dos espacos.",
  "identificar-territorio-e-regionalizacao-do-brasil",
  `
regiões brasileiras|A divisao oficial do território nacional em Norte, Nordeste, Centro-Oeste, Sudeste e Sul forma as:
regionalizacao|O ato de dividir o território em partes segundo critérios especificos é a:
diversidade regional|As grandes diferencas naturais, econômicas e sociais entre áreas do país revelam a:
território nacional|O espaço sob soberania do Estado brasileiro corresponde ao:
faixa de fronteira|A zona terrestre proxima aos limites internacionais do país é a:
zona costeira|A porcao do território articulada ao litoral e aos usos maritimos forma a:
dominio amazonico|A extensa área de florestas tropicais no Norte integra o:
semiarido nordestino|A porcao de clima mais seco do Nordeste corresponde ao:
centro-sul dinamico|A área de maior concentracao econômica e tecnico-cientifica do país pode ser chamada de:
complexidade regional|As diferencas de população, economia e infraestrutura entre as regiões mostram a:
integração territorial desigual|As redes de transporte e comunicação conectam o Brasil, mas de forma:
densidade técnica regional|Algumas regiões concentram mais infraestrutura, serviços e tecnologia, revelando maior:
ocupacao histórica seletiva|A forma desigual de povoamento e organizacao do território brasileiro resulta de:
espaço agrario e urbano articulado|No Brasil contemporaneo campo e cidade se relacionam em um:
rede regional de cidades|A articulacao de centros urbanos em diferentes escalas no interior das regiões forma uma:
reorganizacao territorial recente|Novos eixos de expansao produtiva mostram uma:
contrastes intrarregionais|Dentro da mesma região podem coexistir áreas modernas e áreas precarias, formando:
fronteira econômica interna|Áreas de expansao recente da agropecuaria, da mineracao e da infraestrutura constituem:
leitura multiescalar do Brasil|Interpretar o Brasil atual exige relacionar municipio, estado, região e:
território brasileiro desigual e integrado|A sintese sobre o espaço nacional deve reconhecer que o Brasil e ao mesmo tempo:
`
);

const bloco2 = montarBloco(
  "População e dinamicas demograficas",
  21,
  "O Brasil atual apresenta transicao demográfica avancada, urbanizacao elevada e desigualdades populacionais persistentes.",
  "analisar-populacao-e-dinamicas-demograficas-do-brasil",
  `
transicao demográfica|A passagem de altas taxas de natalidade e mortalidade para niveis mais baixos caracteriza a:
envelhecimento populacional|O aumento relativo da participacao de idosos na população brasileira indica:
queda da fecundidade|A reducao do número medio de filhos por mulher mostra a:
urbanizacao elevada|A grande maioria da população brasileira vivendo em cidades expressa:
estrutura etária em mudança|A diminuicao relativa da base da pirâmide é o aumento da faixa adulta revelam:
densidade demográfica desigual|A população brasileira não se distribui uniformemente, o que evidencia:
migracao interna|Os deslocamentos populacionais entre regiões e estados do país formam a:
mobilidade pendular|O deslocamento diario entre moradia e trabalho ou estudo nas áreas urbanas é a:
metropolizacao populacional|A concentracao humana em grandes aglomeracoes e regiões metropolitanas compoe a:
interiorizacao do povoamento|O crescimento de cidades medias e novas frentes econômicas revela:
reducao do crescimento vegetativo|Com menos nascimentos e maior envelhecimento ocorre:
distribuição desigual da população|O litoral e certas metropoles concentram mais habitantes, mostrando:
desigualdades sociodemograficas|Renda, escolaridade, acesso a saúde e composição etária revelam:
população economicamente ativa|O grupo em idade e condicao de trabalho compoe a:
transicao urbana consolidada|A predominancia histórica do modo de vida urbano no país indica:
mudança no perfil das familias|A reducao do tamanho medio dos lares brasileiros mostra:
pressão sobre políticas sociais|O envelhecimento e as desigualdades regionais ampliam desafios em:
seletividade migratoria|Certos fluxos internos concentram jovens e trabalhadores, revelando:
dinamica populacional complexa|No Brasil atual natalidade, migracoes, urbanizacao e envelhecimento formam uma:
leitura geográfica da população brasileira|A sintese demográfica do país exige articular distribuição espacial, estrutura etária e:
`
);

const bloco3 = montarBloco(
  "Urbanizacao e rede urbana brasileira",
  41,
  "A urbanizacao brasileira formou metropoles, cidades medias e fortes contrastes de infraestrutura e serviços.",
  "analisar-urbanizacao-e-rede-urbana-brasileira",
  `
rede urbana brasileira|O conjunto articulado de cidades e fluxos no país forma a:
metropole nacional|Grande cidade brasileira com ampla influencia econômica e funcional sobre o território é uma:
cidade média dinamica|Centro urbano intermediario que ganhou relevancia com serviços e economia regional é uma:
hierarquia urbana nacional|A organizacao das cidades brasileiras em diferentes niveis de centralidade é a:
conurbacao|A uniao física entre manchas urbanas de municipios vizinhos corresponde a:
região metropolitana|O conjunto de municipios fortemente articulados por uma grande cidade forma a:
periferizacao urbana|A expansao das moradias de baixa renda para áreas distantes é a:
segregacao socioespacial|A separacao de grupos sociais em áreas desiguais da cidade é a:
macrocefalia urbana|A concentracao excessiva de população e funções em poucas metropoles pode gerar:
rede policentrica emergente|O fortalecimento de varias cidades medias e capitais regionais sugere uma:
urbanizacao desigual|O acesso a moradia, saneamento e transporte nas cidades brasileiras ocorre de forma:
mobilidade pendular metropolitana|Nas grandes metropoles brasileiras são comuns:
centralidade de serviços|Certas cidades se destacam por universidades, hospitais e comércio regional, reforcando sua:
infraestrutura urbana incompleta|Muitas periferias brasileiras revelam carencias de saneamento, transporte e:
expansao horizontal das cidades|O espraiamento do tecido urbano para zonas perifericas caracteriza a:
cidade-região|A articulacao funcional de uma metropole com municipios vizinhos e com cidades proximas forma uma:
economia urbana terciarizada|Grande parte do dinamismo recente das cidades brasileiras esta ligada ao:
problemas metropolitanos|Violencia, congestionamento, segregacao e poluicao compoem os:
urbanizacao brasileira contraditoria|A sintese sobre o urbano no Brasil atual combina modernizacao, desigualdade e:
`
);

const bloco4 = montarBloco(
  "Economia e reestruturacao produtiva",
  61,
  "O Brasil atual combina agroexportacao, industria desigual, serviços e financeirizacao em um território heterogeneo.",
  "analisar-economia-e-reestruturacao-produtiva-no-brasil",
  `
reestruturacao produtiva|As mudancas na localizacao de empresas, no trabalho e nos setores econômicos formam a:
desindustrializacao relativa|A perda de peso da industria na estrutura produtiva é um processo de:
terciarizacao da economia|O aumento da participacao de comércio e serviços no emprego e na renda expressa:
agroexportacao moderna|A forte presenca do agronegocio voltado ao mercado externo caracteriza a:
economia de serviços|No Brasil atual uma parte expressiva do PIB e do emprego esta no setor de:
complexidade produtiva desigual|Algumas regiões concentram industrias e tecnologia, enquanto outras permanecem mais dependentes de:
concentracao financeira|Sedes bancarias, bolsas e grandes serviços empresariais reforcam a:
interiorizacao industrial seletiva|A ida de plantas industriais para novas regiões é uma forma de:
dependencia de commodities|Quando exportacoes ficam muito concentradas em produtos primarios ocorre:
cadeias produtivas territoriais|A articulacao entre fornecedores, logística e mercado forma:
competitividade regional|Infraestrutura, qualificacao e mercado ajudam a explicar a:
economia informacional|O peso crescente de dados, telecomunicacoes e serviços complexos na produção integra a:
especializacao produtiva regional|Determinadas áreas do país se destacam por ramos especificos, formando:
mercado interno desigual|As diferencas de renda e de consumo entre as regiões afetam o:
trabalho flexibilizado|A ampliacao de terceirizacao, plataformas e contratos instaveis favorece:
conexao entre campo e industria|Agroindustria, insumos e logística mostram a:
inserção subordinada em cadeias globais|Exportar muito valor primario e importar tecnologia pode reforcar:
economia brasileira heterogenea|A coexistencia de atividades modernas e atrasadas revela uma:
desenvolvimento regional desequilibrado|A sintese econômica do Brasil atual destaca crescimento seletivo e:
`
);

const bloco5 = montarBloco(
  "Agropecuaria e questao agraria",
  81,
  "O campo brasileiro combina agronegocio moderno, conflitos por terra, desigualdade fundiaria e pressão ambiental.",
  "avaliar-agropecuaria-e-questao-agraria-no-brasil",
  `
agronegocio|O sistema que articula produção agropecuaria, industria, credito e exportação é o:
concentracao fundiaria|A posse de grande parte das terras nas maos de poucos proprietarios revela:
fronteira agricola|A expansao de lavouras e pecuaria sobre novas áreas do território compoe a:
monocultura exportadora|A produção em larga escala de poucos produtos voltados ao mercado externo é a:
agroindustria|A integração entre o campo é a transformação industrial dos produtos rurais forma a:
conflito pela terra|A disputa entre grandes proprietarios, comunidades e trabalhadores pelo uso fundiario gera:
reforma agraria|A politica de redistribuicao de terras e apoio a pequenos produtores corresponde a:
agricultura familiar|A produção baseada em pequenas propriedades e trabalho da familia integra a:
mecanizacao do campo|O uso intensivo de tratores, colheitadeiras e maquinas expressa a:
uso intensivo de insumos|Sementes melhoradas, fertilizantes e agroquimicos compoem o:
expulsao de trabalhadores rurais|A modernizacao do campo sem absorcao de mao de obra pode gerar:
desmatamento por expansao agropecuaria|A abertura de novas áreas para pastos e lavouras provoca:
cadeia global de alimentos|A articulacao do campo brasileiro com tradings, portos e mercados externos forma a:
pressão sobre povos e comunidades tradicionais|A ampliacao da fronteira produtiva pode intensificar:
seguranca alimentar desigual|Mesmo com grande produção agricola, persistem desafios ligados ao:
especializacao regional do campo|Soja, cana, gado e frutas se distribuem de modo diferente pelo país, revelando:
campo tecnificado e campo precario|A realidade rural brasileira combina modernizacao e:
questao agraria persistente|Concentracao fundiaria, conflitos e desigualdade mantem viva a:
leitura geográfica do campo brasileiro|A sintese da agropecuaria atual exige articular tecnologia, terra, exportação e:
`
);

const bloco6 = montarBloco(
  "Infraestrutura e integração territorial",
  101,
  "Rodovias, portos, energia, telecomunicacoes e logística estruturam a integração desigual do território brasileiro.",
  "analisar-infraestrutura-e-integracao-territorial-no-brasil",
  `
integração territorial|A conexao entre regiões brasileiras por transporte, energia e comunicação forma a:
malha rodoviaria|No Brasil a principal base de circulação terrestre de cargas é a:
corredor logistico|O conjunto de vias, terminais e serviços voltado ao escoamento de produção constitui um:
porto exportador|Instalacao fundamental para a saida de commodities e manufaturas ao exterior é um:
ferrovia de cargas|Modal usado para longas distâncias e grande volume de mercadorias é a:
rede de energia|A articulacao entre geracao, transmissao e distribuição eletrica forma a:
telecomunicacoes|Internet, telefonia e transmissao de dados compoem o setor de:
integração seletiva do território|As obras de infraestrutura beneficiam algumas áreas mais do que outras, revelando:
gargalo logistico|Quando a rede de transportes não acompanha a produção surge um:
capacidade de escoamento|A eficiencia de levar bens das áreas produtivas aos mercados expressa a:
densidade infraestrutural desigual|Algumas regiões possuem mais rodovias, energia e serviços, mostrando:
eixos de desenvolvimento|Grandes obras e circuitos produtivos podem formar:
interiorizacao conectada|A expansao econômica para cidades medias e novas fronteiras depende de:
dependencia rodoviaria|A forte centralidade das estradas no transporte brasileiro expressa:
articulacao porto-hinterland|A ligacao entre o porto e sua área de abastecimento no interior é a:
infraestrutura como fator locacional|Empresas escolhem certas áreas do território por causa da:
fluidez territorial|A facilidade de circulação de mercadorias, informacoes e pessoas depende da:
desigualdade de acesso a redes técnicas|Nem todos os lugares do Brasil possuem a mesma inserção em energia, dados e transporte, o que mostra:
território como suporte material da economia|A sintese sobre infraestrutura destaca o Brasil como um espaço organizado por obras, fluxos e:
`
);

const bloco7 = montarBloco(
  "Desigualdades regionais e sociais",
  121,
  "As diferencas de renda, serviços e oportunidades entre regiões e grupos sociais marcam fortemente o Brasil contemporaneo.",
  "avaliar-desigualdades-regionais-e-sociais-no-brasil",
  `
desigualdade regional|As diferencas de renda, infraestrutura e dinamismo entre partes do país caracterizam:
concentracao de renda|Quando grande parcela da riqueza se acumula nas maos de poucos ocorre:
desigualdade socioespacial|A distribuição desigual de serviços e oportunidades no território revela:
contraste centro-periferia|A oposicao entre áreas valorizadas e áreas precarias nas cidades forma o:
acesso desigual a serviços|Saúde, educação, transporte e saneamento não chegam da mesma forma a todos, produzindo:
segregacao social urbana|A separacao territorial de grupos por renda e condições de vida é uma:
desigualdade no campo e na cidade|No Brasil atual as diferencas socioespaciais aparecem tanto em áreas rurais quanto:
vulnerabilidade social|Grupos com baixa renda, serviços insuficientes e alta exposicao a riscos apresentam:
inclusao seletiva|Alguns territ orios entram nos circuitos modernos sem receber plenamente seus beneficios, revelando:
mobilidade social limitada|Quando oportunidades de ascensao permanecem restritas para muitos grupos ocorre:
serviços publicos desiguais|A diferenca de qualidade entre escolas, hospitais e infraestrutura expressa:
regionalizacao do desenvolvimento desigual|O fato de certas áreas terem mais dinamismo economico e outras mais carencias mostra:
periferias metropolitanas|Nas grandes cidades brasileiras, muitas desigualdades se concentram nas:
desigualdade racial e territorial|No Brasil, cor, renda e localizacao muitas vezes se cruzam produzindo:
trabalho informal e renda baixa|Setores pouco protegidos e mal remunerados reforcam:
exclusao urbana|Quando moradores não acessam plenamente serviços, mobilidade e centralidade ocorre:
persistencia histórica de desigualdades|Colonizacao, escravidao e concentracao fundiaria ajudam a explicar a:
articulacao entre escala regional e social|Uma leitura geográfica das desigualdades brasileiras exige relacionar território, renda e:
Brasil socialmente heterogeneo|A sintese sobre desigualdades no país destaca a convivencia de modernizacao com:
`
);

const bloco8 = montarBloco(
  "Políticas territoriais e fronteiras",
  141,
  "Ações do Estado, fronteiras internacionais e ocupacao de novas áreas influenciam a organizacao do território brasileiro.",
  "analisar-politicas-territoriais-e-fronteiras-do-brasil",
  `
politica territorial|As ações estatais voltadas a organizar o espaço nacional compoem a:
fronteira internacional|A linha de contato do Brasil com outros países corresponde a:
faixa de fronteira|A área terrestre proxima ao limite internacional é a:
integração sul-americana|A articulacao do Brasil com vizinhos por infraestrutura e comércio faz parte da:
ocupacao de fronteiras internas|A expansao para novas áreas produtivas dentro do país forma a:
presenca estatal no território|Bases, obras, fiscalizacao e serviços publicos revelam a:
planejamento regional|A definicao de prioridades para desenvolver certas áreas integra o:
seguranca territorial|A protecao do território, de suas fronteiras e infraestruturas estrategicas compoe a:
cooperacao transfronteirica|A relação cotidiana entre cidades e regiões em lados diferentes da fronteira mostra:
fronteira como zona de fluxos|Mais que linha fixa, a fronteira também pode ser entendida como:
vigilancia de fronteiras|O controle de circulação de mercadorias, pessoas e atividades ilicitas exige:
projetos de integração física|Rodovias, pontes e linhas de energia voltadas a articular o continente formam:
ocupacao planejada da Amazonia|Programas e obras voltados ao Norte do país integram a:
questao fundiaria em áreas de fronteira|A abertura de novas frentes produtivas pode intensificar:
fronteiras vivas|A forte circulação de pessoas e mercadorias em áreas limitrofes caracteriza:
Estado como agente territorial|No Brasil, o poder publico influencia o espaço por leis, obras e:
uso estrategico do território|Portos, fronteiras, energia e corredores de exportação mostram o:
políticas regionais desiguais|Nem todos os espacos recebem o mesmo volume de investimento estatal, o que revela:
território nacional em disputa|A sintese sobre fronteiras e políticas territoriais reconhece que o Brasil atual e moldado por Estado, mercado e:
`
);

const bloco9 = montarBloco(
  "Brasil no mundo e inserção internacional",
  161,
  "O Brasil participa da economia mundial por exportacoes, diplomacia, agronegocio, energia e articulacoes regionais.",
  "analisar-o-brasil-no-mundo-e-sua-insercao-internacional",
  `
inserção internacional do Brasil|A forma como o país participa do comércio, da diplomacia e das cadeias globais define sua:
exportação de commodities|O peso de soja, minerio e petroleo nas vendas externas brasileiras mostra a:
dependencia de mercados externos|Quando a economia nacional fica sensivel a variacoes de demanda mundial ocorre:
potencia regional|Na America do Sul o Brasil frequentemente e visto como uma:
balança comercial brasileira|A diferenca entre exportacoes e importacoes do país compoe a:
agroexportacao competitiva|A forte presenca de produtos rurais nas vendas externas revela a:
semiperiferia|A posicao do Brasil entre dependencia e relevancia regional pode ser associada a:
relações sul-sul|A ampliacao de parcerias entre países em desenvolvimento integra as:
participacao em blocos regionais|A atuacao do Brasil em esquemas de integração sul-americana mostra:
diversificacao de parceiros comerciais|A busca por reduzir dependencia de poucos mercados envolve:
papel diplomatico regional|Mediacoes, negociacoes e lideranca em temas continentais expressam o:
industrializacao incompleta|A dificuldade de consolidar setores tecnologicos sofisticados limita a:
valor agregado insuficiente|Exportar muitos produtos primarios e poucos bens complexos revela:
geoeconomia brasileira|A relação entre território, energia, agroexportacao e mercado mundial compoe a:
vulnerabilidade externa|Crises cambiais, oscilação de commodities e dependencia tecnologica podem ampliar:
projecao internacional seletiva|O Brasil possui relevancia em alguns temas globais, mas com limites em:
papel ambiental global do Brasil|Amazonia, clima e biodiversidade ampliam a importancia do país em:
estrategia nacional de desenvolvimento|Para melhorar sua inserção externa o Brasil precisa articular industria, ciência, energia e:
Brasil entre autonomia e dependencia|A sintese sobre a posicao internacional do país mostra uma combinacao de:
`
);

const bloco10 = montarBloco(
  "Leitura geográfica do Brasil contemporaneo",
  181,
  "Interpretar o Brasil atual exige unir território, população, economia, urbanizacao, desigualdades e poder.",
  "sintetizar-a-leitura-geografica-do-brasil-contemporaneo",
  `
leitura multiescalar do Brasil|Para compreender o país atual e preciso articular local, regional, nacional e:
território usado|O espaço brasileiro apropriado por Estado, empresas e sociedade é o:
formação socioespacial brasileira|A relação histórica entre sociedade e território no país compoe a:
modernizacao desigual|Infraestruturas, tecnologia e serviços não avancam com a mesma intensidade em todo o país, produzindo:
rede nacional de fluxos|Transportes, informacoes, capitais e pessoas articulam o Brasil em uma:
desenvolvimento territorial contraditorio|O país combina dinamismo economico e permanencia de desigualdades, revelando:
articulacao campo-cidade|Agronegocio, agroindustria, serviços e consumo mostram a:
urbanizacao com periferizacao|A maioria urbana do Brasil não eliminou, mas reorganizou a:
economia heterogenea|A convivencia de setores modernos e setores precarios indica uma:
regionalizacao viva|As regiões brasileiras não são apenas recortes estaticos, mas espacos de:
território integrado e fragmentado|Ao mesmo tempo que redes conectam o país, desigualdades produzem um Brasil:
questao socioambiental brasileira|Agropecuaria, energia, cidades e biomas formam a:
Estado e mercado como agentes espaciais|A organizacao do território brasileiro depende fortemente de:
centralidades e periferias nacionais|Algumas regiões e cidades concentram comando, enquanto outras assumem posicao secundaria, criando:
escala regional das políticas publicas|Muitos problemas brasileiros exigem respostas diferenciadas conforme a:
Brasil urbano-industrial-agroexportador|Uma sintese da economia contemporanea do país pode ser dada por sua condicao:
geografia dos contrastes|As diferencas de renda, infraestrutura, biomas e população formam a:
desafio de coesao territorial|Integrar o território com menor desigualdade regional e social exige enfrentar o:
análise geográfica integrada do Brasil|A interpretação mais madura do país atual depende de unir território, sociedade, economia e:
Brasil contemporaneo complexo e desigual|A sintese final sobre o tema deve reconhecer o país como:
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
    comentario: "A urbanizacao brasileira combina integração em rede e fortes contrastes territoriais.",
    habilidade: "sintetizar-a-rede-urbana-brasileira"
  }),
  criarQuestao({
    id: "ba_080",
    subtopico: "Economia e reestruturacao produtiva",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "Uma sintese geográfica da economia brasileira atual deve unir agroexportacao, serviços, industria desigual, financas e:",
    opcoes: ["reorganizacao territorial da produção", "apenas clima tropical", "homogeneidade social", "ausencia de redes logisticas"],
    correta: "reorganizacao territorial da produção",
    comentario: "Os circuitos produtivos contemporaneos remodelam regiões, cidades e fluxos.",
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
    comentario: "A questao agraria envolve terra, poder, produção e ambiente ao mesmo tempo.",
    habilidade: "sintetizar-a-questao-agraria-no-brasil-atual"
  }),
  criarQuestao({
    id: "ba_120",
    subtopico: "Infraestrutura e integração territorial",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "A infraestrutura brasileira integra o território, mas também evidencia seletividade espacial, gargalos e concentracao de investimentos. Isso define uma:",
    opcoes: ["integração territorial desigual", "ocupacao totalmente equilibrada", "rede sem hierarquias", "economia sem logística"],
    correta: "integração territorial desigual",
    comentario: "As redes técnicas conectam o país, mas não eliminam assimetrias regionais.",
    habilidade: "sintetizar-a-integracao-territorial-brasileira"
  }),
  criarQuestao({
    id: "ba_140",
    subtopico: "Desigualdades regionais e sociais",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "Uma interpretação madura das desigualdades brasileiras deve relacionar renda, racismo, localizacao, acesso a serviços e:",
    opcoes: ["história territorial do desenvolvimento", "somente relevo regional", "tipos de solo", "estrutura dos rios"],
    correta: "história territorial do desenvolvimento",
    comentario: "As desigualdades do presente resultam de processos históricos longos e espacialmente seletivos.",
    habilidade: "sintetizar-desigualdades-regionais-e-sociais-no-brasil"
  }),
  criarQuestao({
    id: "ba_160",
    subtopico: "Políticas territoriais e fronteiras",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "Fronteiras, obras estrategicas e presenca estatal mostram que o território brasileiro e continuamente reorganizado por políticas, fluxos e:",
    opcoes: ["interesses geoeconomicos", "apenas fatores climaticos", "formas de relevo fixas", "zonas sem população"],
    correta: "interesses geoeconomicos",
    comentario: "As políticas territoriais combinam soberania, integração e disputa por recursos e circulação.",
    habilidade: "sintetizar-politicas-territoriais-e-fronteiras-do-brasil"
  }),
  criarQuestao({
    id: "ba_180",
    subtopico: "Brasil no mundo e inserção internacional",
    dificuldadeLabel: "dificil",
    dificuldadeNivel: 10,
    cognicao: "sintese",
    tempoEstimado: 60,
    enunciado: "A inserção internacional do Brasil ganha sentido geográfico quando se conectam agroexportacao, diplomacia, recursos naturais, mercado externo e:",
    opcoes: ["projeto nacional de desenvolvimento", "somente extensao territorial", "clima tropical dominante", "padrao fixo de migracao"],
    correta: "projeto nacional de desenvolvimento",
    comentario: "A posicao do país no mundo depende tanto do mercado quanto das escolhas estrategicas internas.",
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
    searchAliases: ["brasil atual", "território brasileiro", "desigualdades regionais", "rede urbana brasileira", "questao agraria", "brasil no mundo"],
    subtopicosBase: [
      "Território e regionalizacao do Brasil",
      "População e dinamicas demograficas",
      "Urbanizacao e rede urbana brasileira",
      "Economia e reestruturacao produtiva",
      "Agropecuaria e questao agraria",
      "Infraestrutura e integração territorial",
      "Desigualdades regionais e sociais",
      "Políticas territoriais e fronteiras",
      "Brasil no mundo e inserção internacional",
      "Leitura geográfica do Brasil contemporaneo"
    ],
    habilidadesBase: [
      "identificar dimensões territoriais e regionais do Brasil atual",
      "analisar dinamicas populacionais, urbanas e produtivas no país",
      "relacionar agropecuaria, infraestrutura e inserção internacional ao território brasileiro",
      "avaliar desigualdades regionais, sociais e políticas territoriais",
      "sintetizar uma leitura geográfica integrada do Brasil contemporaneo"
    ]
  },
  questoes: [...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8, ...bloco9, ...bloco10, ...complementos].sort((a, b) => a.id.localeCompare(b.id))
};

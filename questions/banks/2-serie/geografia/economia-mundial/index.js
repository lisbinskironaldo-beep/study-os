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
  topico: "Economia Mundial",
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

const montarBloco = (subtopico, inicio, comentario, habilidade, bruto) =>
  bruto
    .trim()
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean)
    .map((linha, index) => {
      const [enunciado, opcoesTxt, correta] = linha.split("|");
      const [dificuldadeLabel, dificuldadeNivel, cognicao, tempoEstimado] = PERFIS[index];
      return criarQuestao({
        id: `em_${String(inicio + index).padStart(3, "0")}`,
        subtopico,
        dificuldadeLabel,
        dificuldadeNivel,
        cognicao,
        tempoEstimado,
        enunciado,
        opcoes: opcoesTxt.split(";"),
        correta,
        comentario,
        habilidade
      });
    });

const bloco1 = montarBloco(
  "Indicadores e conceitos economicos",
  1,
  "A leitura da economia mundial exige relacionar indicadores de producao, renda e insercao internacional.",
  "interpretar-indicadores-economicos-da-economia-mundial",
  `
O indicador da soma de riquezas produzidas internamente e o|PIB;IDH;balanca comercial;taxa de cambio|PIB
Quando o PIB e dividido pela populacao obtemos o|PIB per capita;saldo comercial;juros basicos;parque industrial|PIB per capita
A diferenca entre exportacoes e importacoes forma a|balanca comercial;piramide etaria;taxa de fecundidade;densidade demografica|balanca comercial
Um superavit comercial ocorre quando o pais exporta valor|maior que importa;igual ao que importa;menor que importa;sempre nulo|maior que importa
Commodity e, em geral, um produto|padronizado e muito negociado;sem valor comercial;exclusivo do setor publico;apenas digital|padronizado e muito negociado
A alta persistente e generalizada de precos caracteriza|inflacao;dumping;urbanizacao;desindustrializacao|inflacao
Quando a moeda nacional perde valor frente ao dolar ocorre|desvalorizacao cambial;integracao aduaneira;reducao tarifaria;superavit fiscal|desvalorizacao cambial
PIB alto e desigualdade elevada mostram que a producao total nao revela sozinha a|distribuicao da renda;forma do relevo;localizacao absoluta;estrutura geologica|distribuicao da renda
Inflacao elevada tende a reduzir o|poder de compra;mercado externo;volume do territorio;numero de empresas|poder de compra
Dois paises com mesmo PIB podem ter realidades distintas quando se observa|PIB per capita e desigualdade;latitude e longitude;clima e relevo;vegetacao e hidrografia|PIB per capita e desigualdade
Se um pais importa mais do que exporta sua balanca comercial tende a ser|deficitaria;superavitaria;autonoma;estavel por definicao|deficitaria
Moeda muito valorizada pode dificultar exportacoes porque torna os produtos internos|mais caros externamente;mais baratos externamente;mais raros internamente;imunes a concorrencia|mais caros externamente
Exportar materias-primas e importar bens sofisticados indica menor dominio da|cadeia de valor internacional;dinamica climatica;rede hidrografica;estrutura etaria|cadeia de valor internacional
PIB elevado com baixa produtividade e renda concentrada nao garante alto nivel de|bem-estar social;erosao costeira;mobilidade pendular;regularidade climatica|bem-estar social
Economia dependente de um unico produto exportador fica mais vulneravel a|oscilacoes do mercado internacional;estabilidade automatica;queda das importacoes;fim da concorrencia|oscilacoes do mercado internacional
Em uma leitura mais completa o desempenho economico precisa ser comparado tambem com|qualidade de vida;tipos de solo;formas de relevo;distribuicao das chuvas|qualidade de vida
Se o PIB cresce mas a renda real e o emprego caem o crescimento pode estar|concentrado e pouco distributivo;equilibrado por definicao;desligado da producao;sempre ligado ao pleno emprego|concentrado e pouco distributivo
Moeda fragil, inflacao alta e dependencia externa dificultam manter|estabilidade macroeconomica;uniformidade cultural;padrao climatico;homogeneidade territorial|estabilidade macroeconomica
Ao comparar paises indicadores economicos ganham mais sentido quando lidos com desigualdade e|contexto historico;somente altitude;tipo de vegetacao;numero de rios|contexto historico
PIB, cambio e balanca comercial ajudam a explicar a economia, mas precisam ser ligados tambem a|distribuicao social da riqueza;somente relevo;apenas clima;estrutura das montanhas|distribuicao social da riqueza
`
);

const bloco2 = montarBloco(
  "Setores da economia e estrutura produtiva",
  21,
  "A estrutura produtiva revela como recursos, industria, servicos e tecnologia se articulam no territorio.",
  "analisar-a-estrutura-produtiva-na-economia-mundial",
  `
O setor ligado a extracao de recursos naturais e o|setor primario;setor secundario;setor terciario;setor quaternario|setor primario
A transformacao de materias-primas em mercadorias ocorre no|setor secundario;setor primario;setor agrario;setor informal|setor secundario
Comercio, transporte e bancos pertencem sobretudo ao|setor terciario;setor primario;setor mineral;setor extrativo|setor terciario
Pesquisa, tecnologia e informacao sao associados ao setor|quaternario;primario;informal;agricola|quaternario
Economia com forte presenca de servicos especializados tende a ter|maior complexidade produtiva;menor uso de tecnologia;ausencia de industria;mercado fechado|maior complexidade produtiva
Pais exportador de alta tecnologia tende a reter mais|valor agregado;erosao;dependencia climatica;isolamento logistico|valor agregado
Economia muito dependente do setor primario fica mais exposta a|variacoes de preco das commodities;estabilidade automatica;fim da concorrencia;controle das patentes|variacoes de preco das commodities
A industrializacao amplia o setor secundario e tambem impulsiona o|setor terciario;setor glacial;setor tectonico;setor pluvial|setor terciario
Base produtiva diversificada costuma aumentar a capacidade de|resistir a choques externos;depender de um unico produto;dispensar infraestrutura;eliminar o mercado interno|resistir a choques externos
Economias avancadas podem ter forte setor de servicos sem perder industria porque operam com|servicos complexos e cadeias globalizadas;agricultura de subsistencia;extracao artesanal;autarquia economica|servicos complexos e cadeias globalizadas
Quando um pais amplia pesquisa e engenharia ele tende a subir na cadeia produtiva pelo maior uso de|conhecimento;erosao;ruralizacao;dependencia natural|conhecimento
Servicos simples e informais muito predominantes podem indicar|baixa sofisticacao economica;dominio tecnologico;superavit industrial;autonomia financeira total|baixa sofisticacao economica
Agroexportacao forte com pouca transformacao interna tende a aumentar a dependencia de|centros externos de decisao e tecnologia;mercados locais fechados;mudancas geologicas;isolamento maritimo|centros externos de decisao e tecnologia
A passagem de uma economia agraria para outra urbano-industrial altera empregos, consumo e|organizacao do territorio;inclinacao do eixo terrestre;estrutura das placas;forma dos oceanos|organizacao do territorio
Industria de ponta, pesquisa e servicos sofisticados favorecem maior|capacidade de inovacao;dependencia exclusiva da natureza;reduzida qualificacao;fragilidade industrial permanente|capacidade de inovacao
Exportar soja bruta e importar maquinas sofisticadas indica etapa produtiva de|menor intensidade tecnologica;maior controle de patentes;maior dominio da engenharia;plena autonomia financeira|menor intensidade tecnologica
Setores economicos devem ser lidos em conjunto porque o desenvolvimento depende da articulacao entre producao, tecnologia, servicos e|infraestrutura;somente clima;estrutura geologica;altitude media|infraestrutura
Em cadeias globais um mesmo bem pode ter pesquisa, montagem e venda em paises distintos, mostrando|fragmentacao internacional da producao;autarquia economica;fim do comercio;desruralizacao global|fragmentacao internacional da producao
Uma economia nacional fica mais robusta quando amplia industria, servicos sofisticados, pesquisa e|mercado interno;somente exportacoes primarias;isolamento logistico;dependencia de um produto|mercado interno
Uma sintese correta sobre estrutura produtiva afirma que ela depende da conexao entre recursos, industria, servicos, tecnologia e|insercao internacional;apenas relevo;somente hidrografia;tipos de solo|insercao internacional
`
);

const bloco3 = montarBloco(
  "Divisao internacional do trabalho",
  41,
  "A divisao internacional do trabalho distribui de forma desigual etapas, funcao e poder entre os territorios.",
  "analisar-a-divisao-internacional-do-trabalho",
  `
A DIT corresponde a distribuicao desigual de atividades economicas entre|paises e regioes;rios e lagos;climas e vegetacoes;bacias sedimentares|paises e regioes
Na DIT classica muitos paises perifericos foram especializados em|materias-primas;software;servicos financeiros;patentes industriais|materias-primas
Historicamente os paises centrais concentraram atividades de maior|tecnologia e comando;extracao artesanal;dependencia externa;instabilidade demografica|tecnologia e comando
A nova DIT se relaciona fortemente com a|globalizacao da producao;estagnacao do comercio;desaparecimento das empresas globais;autossuficiencia geral|globalizacao da producao
Quando um pais recebe etapas de montagem mas nao controla marcas nem tecnologia ele ocupa posicao|subordinada na cadeia produtiva;superior no comando global;fora da economia mundial;equivalente ao centro financeiro|subordinada na cadeia produtiva
A transferencia de fabricas para locais com salarios menores mostra busca empresarial por|reducao de custos;isolamento territorial;maior taxacao;autarquia produtiva|reducao de custos
Na nova DIT centros de pesquisa e decisao permanecem onde se concentram|capital, tecnologia e servicos avancados;agricultura de subsistencia;extracao florestal;vazios demograficos|capital, tecnologia e servicos avancados
A DIT ajuda a explicar por que alguns paises exportam tecnologia enquanto outros exportam sobretudo|produtos primarios;mapas tematicos;correntes marinhas;tipos de nuvens|produtos primarios
Paises semiperifericos podem combinar industria, commodities e|dependencia tecnologica parcial;autonomia total de patentes;ausencia de comercio;fim da desigualdade|dependencia tecnologica parcial
A divisao internacional do trabalho muda conforme tecnologia, geopolica, empresas e|estrategias estatais;apenas altitude;formas de vegetacao;massa de ar dominante|estrategias estatais
Investir em educacao, tecnologia e industria pode ajudar um pais a subir na DIT por meio de|maior agregacao de valor;abandono da infraestrutura;especializacao primaria exclusiva;isolamento comercial|maior agregacao de valor
A concentracao de patentes, marcas e financas em poucos paises reforca o controle das|etapas mais lucrativas da cadeia;zonas rurais distantes;correntes atmosfericas;formas erosivas|etapas mais lucrativas da cadeia
Se um territorio atrai montadoras mas importa tecnologia e componentes-chave sua insercao permanece|dependente;autonoma;desligada;equilibrada por definicao|dependente
A nova DIT pode aprofundar desigualdades quando alguns paises concentram pesquisa e lucro e outros recebem etapas mais poluentes de|producao;navegacao;cartografia;meteorologia|producao
Uma mesma empresa pode localizar design, montagem e vendas em paises distintos para aproveitar custos, mercados e|especializacao territorial;homogeneidade cultural;ausencia de logistica;uniformidade monetaria|especializacao territorial
Quando um pais deixa de exportar apenas bens primarios e passa a produzir bens complexos ocorre|reposicionamento produtivo;desaparecimento do mercado externo;retorno a economia natural;fim das trocas globais|reposicionamento produtivo
Ao avaliar a DIT e incorreto supor beneficios iguais para todos porque tecnologia, financas e poder permanecem|desigualmente distribuidos;naturalmente iguais;fora do comercio;sem relacao com empresas|desigualmente distribuidos
Politicas de conteudo local, pesquisa e formacao tecnica podem reduzir dependencia ao ampliar|capacidade produtiva interna;uso exclusivo de importacoes;especializacao apenas primaria;fechamento logistico|capacidade produtiva interna
A DIT deve ser entendida como resultado historico de colonizacao, industrializacao, tecnologia, financas e|geopolitica;somente clima;tipos de solo;movimentos de mare|geopolitica
Uma sintese coerente sobre a DIT afirma que ela distribui entre paises etapas produtivas, funcoes de comando e|niveis distintos de apropriacao de valor;tipos iguais de vegetacao;formas identicas de relevo;a mesma composicao industrial|niveis distintos de apropriacao de valor
  `
);

const bloco4 = montarBloco(
  "Comercio internacional",
  61,
  "O comercio internacional articula producao, logistica, acordos e disputas entre Estados e empresas.",
  "interpretar-o-comercio-internacional-na-economia-mundial",
  `
A venda de mercadorias de um pais para outro e chamada de|exportacao;importacao;inflacao;estatizacao|exportacao
A compra de produtos vindos do exterior corresponde a|importacao;cotacao;reexportacao;poupanca interna|importacao
Tarifas alfandegarias sao cobrancas aplicadas sobre mercadorias|que entram ou saem do pais;produzidas apenas no campo;consumidas so internamente;vendidas no setor informal|que entram ou saem do pais
Elevar tarifas para proteger empresas nacionais e pratica de|protecionismo;livre-cambismo;desregulacao total;desindustrializacao|protecionismo
Reduzir barreiras tarifarias entre paises tende a estimular|maior fluxo de mercadorias;isolamento economico;fim da concorrencia;desaparecimento do mercado interno|maior fluxo de mercadorias
Pauta exportadora baseada em bens de baixo valor agregado fica mais sensivel a|variacoes de preco internacional;estabilidade automatica do lucro;fim da dependencia tecnologica;eliminacao da concorrencia|variacoes de preco internacional
Dumping ocorre quando uma empresa vende no exterior a preco artificialmente baixo para|ganhar mercado e enfraquecer concorrentes;evitar qualquer lucro;reduzir exportacoes;estimular tarifas dos rivais|ganhar mercado e enfraquecer concorrentes
Barreiras nao tarifarias incluem exigencias sanitarias e tecnicas que podem|restringir o acesso de produtos estrangeiros;eliminar a fiscalizacao;impedir o comercio interno;tornar todas as trocas gratuitas|restringir o acesso de produtos estrangeiros
Pais exportador de alimentos e importador de eletronicos revela|especializacao produtiva distinta;autossuficiencia total;fim da dependencia tecnologica;equilibrio automatico de renda|especializacao produtiva distinta
A expansao do comercio mundial depende de logistica, portos, financas, infraestrutura digital e|acordos comerciais;apenas relevo plano;desconexao monetaria;eliminacao do cambio|acordos comerciais
Guerras comerciais entre grandes economias podem gerar|encarecimento de mercadorias e insumos;fim das cadeias globais em um dia;eliminacao da concorrencia;reducao imediata da desigualdade|encarecimento de mercadorias e insumos
Economia aberta ao comercio externo pode ganhar mercados e insumos, mas fica mais exposta a|crises internacionais;isolamento tecnologico;desaparecimento da inflacao;controle total de precos globais|crises internacionais
Importar maquinas para modernizar a industria pode piorar a balanca no curto prazo, mas ajudar depois por|ganhos de produtividade;queda do conhecimento tecnico;isolamento logistico;desaparecimento do investimento|ganhos de produtividade
Exportar muito e importar pouco nao garante economia saudavel, pois e preciso observar a composicao das trocas e o|valor agregado;orientacao dos ventos;tipo de relevo;quantidade de ilhas|valor agregado
Pauta exportadora concentrada em poucos produtos torna o pais mais vulneravel a preco, demanda e|decisoes externas;tipos de nuvens;processos de intemperismo;formas do litoral|decisoes externas
No comercio mundial cadeias longas e dispersas por varios paises fazem com que problemas em um elo afetem|todo o fluxo produtivo;apenas a agricultura local;somente a geologia regional;exclusivamente o turismo|todo o fluxo produtivo
Para reduzir dependencia comercial um pais pode estimular producao interna de insumos estrategicos e|diversificar parceiros;fechar todos os portos;eliminar pesquisa;abandonar infraestrutura|diversificar parceiros
O discurso do livre comercio muitas vezes convive com protecionismo quando estao em jogo setores|estrategicos;sem qualquer valor;desligados de empregos;exclusivamente artesanais|estrategicos
Uma leitura geografica do comercio internacional deve articular trocas, transporte, tecnologia, politica comercial e|desigualdades entre territorios;somente clima local;tipos de solo;bacias sedimentares|desigualdades entre territorios
Exportacoes, importacoes, tarifas e acordos alteram nao apenas o fluxo de mercadorias, mas tambem a competitividade, a renda e|a insercao dos paises na economia mundial;a inclinacao do planeta;a geologia dos continentes;as correntes marinhas|a insercao dos paises na economia mundial
`
);

const bloco5 = montarBloco(
  "Blocos economicos e integracao regional",
  81,
  "Blocos economicos integram mercados e projetam poder regional, mas convivem com assimetrias e conflitos.",
  "analisar-blocos-economicos-e-integracao-regional",
  `
Blocos economicos sao associacoes de paises voltadas a ampliar|integracao comercial e economica;isolamento militar;uniformidade climatica;controle do relevo|integracao comercial e economica
Uma area de livre comercio reduz ou elimina tarifas entre membros sobre|mercadorias comercializadas entre eles;somente pessoas;apenas moedas;somente servicos publicos|mercadorias comercializadas entre eles
Uma uniao aduaneira se diferencia da area de livre comercio porque adota tarifa externa|comum;nula;regionalizada por clima;baseada apenas em populacao|comum
Mercado comum envolve livre circulacao mais ampla de mercadorias, capitais, servicos e|pessoas;placas tectonicas;rios internacionais;tipos de vegetacao|pessoas
Blocos economicos podem aumentar o poder de negociacao dos membros diante de|outros mercados e potencias;somente seus municipios;placas oceanicas;massas de ar|outros mercados e potencias
Mesmo em blocos integrados surgem tensoes por causa de interesses produtivos diferentes e|assimetria entre membros;uniformidade monetaria total;ausencia de fronteiras;fim da concorrencia externa|assimetria entre membros
Quando um bloco amplia fluxos internos empresas podem reorganizar a producao em funcao de mercado ampliado, custos e|logistica regional;tipos de rocha;altitude media;densidade florestal|logistica regional
A integracao regional pode beneficiar economias menores quando melhora acesso a mercado, investimentos e|infraestrutura de circulacao;isolamento comercial;autarquia financeira;queda automatica da desigualdade|infraestrutura de circulacao
Blocos economicos nao eliminam a soberania dos Estados, mas exigem coordenacao sobre|normas e politicas comerciais;estrutura geologica;tipos climaticos;formacao dos solos|normas e politicas comerciais
Quando um bloco enfrenta crise economica ou politica seus efeitos podem atingir comercio, investimentos e|confianca entre os membros;somente o relevo;a estrutura dos oceanos;a direcao dos ventos|confianca entre os membros
A existencia de um bloco pode favorecer complementaridade produtiva quando os paises articulam cadeias regionais de|producao;erosao;cartografia;meteorologia|producao
Em muitos blocos a livre circulacao nao avanca no mesmo ritmo para bens, capitais, servicos e pessoas, mostrando que a integracao e|gradual e desigual;instantanea e total;sempre homogenea;independente da politica|gradual e desigual
Se um bloco possui membros muito desiguais os maiores tendem a exercer mais influencia sobre|agendas e regras do bloco;tipos de chuva;estrutura do relevo;zonas de vegetacao|agendas e regras do bloco
Uma integracao regional consistente exige nao apenas livre comercio, mas tambem harmonizacao regulatoria, infraestrutura e|cooperacao politica;uniformidade geologica;padrao unico de clima;desaparecimento da concorrencia|cooperacao politica
A integracao por blocos pode fortalecer uma regiao, mas tambem reproduzir desigualdades quando os ganhos se concentram em|polos mais competitivos;areas sem infraestrutura;setores sem mercado;territorios sem populacao|polos mais competitivos
Uma uniao economica profunda pode incluir coordenacao monetaria, fiscal e institucional, exigindo|alto grau de convergencia entre paises;fim do Estado nacional;reduzido compromisso politico;ausencia de regulacao|alto grau de convergencia entre paises
Participar de um bloco pode ser vantajoso se ampliar mercado e investimento sem impedir|politicas de desenvolvimento interno;qualquer comercio externo;a producao de alimentos;a organizacao urbana|politicas de desenvolvimento interno
Blocos economicos devem ser entendidos como instrumentos geoeconomicos porque articulam comercio, investimentos, normas e|poder regional;apenas tipos de relevo;composicao dos solos;regimes de chuva|poder regional
Ao comparar blocos e importante observar nivel de integracao, peso economico, infraestrutura, assimetrias internas e|instituicoes de governanca;somente latitude;tipo de rocha dominante;numero de montanhas|instituicoes de governanca
Uma sintese correta sobre blocos economicos afirma que eles buscam integrar mercados e ampliar poder de negociacao, mas dependem de assimetrias, infraestrutura, coordenacao politica e|estrategias de desenvolvimento;somente geologia;clima tropical;densidade demografica isolada|estrategias de desenvolvimento
`
);

const bloco6 = montarBloco(
  "Desenvolvimento, desigualdades e centros de poder",
  101,
  "Riqueza, tecnologia e qualidade de vida se distribuem de forma desigual na economia mundial.",
  "avaliar-desenvolvimento-e-desigualdades-na-economia-mundial",
  `
Paises desenvolvidos costumam apresentar maior renda, maior infraestrutura e|maior complexidade produtiva;dependencia exclusiva do setor primario;ausencia de servicos;economia natural dominante|maior complexidade produtiva
Paises perifericos costumam enfrentar mais fragilidades em renda, infraestrutura e|inovacao tecnologica;clima regional;estrutura tectonica;latitude media|inovacao tecnologica
O termo semiperiferia indica paises em posicao|intermediaria na economia mundial;central absoluta;ruralizada e isolada;fora do comercio internacional|intermediaria na economia mundial
A desigualdade entre paises nao se explica apenas por recursos naturais, mas tambem por historia, colonizacao, industrializacao e|poder politico e tecnologico;apenas altitude;quantidade de rios;tipos de clima|poder politico e tecnologico
Um pais pode crescer economicamente e ainda manter baixa qualidade social se o crescimento ocorrer com|forte concentracao de renda;pleno acesso a servicos;reducoes persistentes de pobreza;difusao tecnologica ampla|forte concentracao de renda
Paises centrais concentram sedes de grandes empresas, centros financeiros e pesquisa, reforcando sua condicao de|comando economico mundial;isolamento geoeconomico;dependencia industrial;autarquia regional|comando economico mundial
A dependencia de exportacoes primarias e importacoes tecnologicas pode reproduzir subdesenvolvimento porque limita|autonomia produtiva;diversidade climatica;ocupacao litoranea;formacao de rios|autonomia produtiva
A melhoria de indicadores sociais depende de renda, mas tambem de politicas publicas, infraestrutura e|distribuicao mais equilibrada;somente abertura comercial;clima temperado;extensao territorial ampla|distribuicao mais equilibrada
A permanencia de centros e periferias mostra que o desenvolvimento global e|desigual;homogeneo;automatico;independente da historia|desigual
Investir em educacao, ciencia, infraestrutura e industria pode ajudar paises perifericos a reduzir|dependencia estrutural;circulacao de mercadorias;uso de portos;diversidade cultural|dependencia estrutural
A nocao de desenvolvimento humano amplia o olhar economico ao considerar renda, educacao, saude e|qualidade de vida;altitude media;projecoes cartograficas;correntes oceanicas|qualidade de vida
Economias dependentes de capital externo e tecnologia importada tendem a ter menor margem para decidir sozinhas sobre|seu projeto de desenvolvimento;a direcao dos ventos;a formacao do relevo;a insolacao anual|seu projeto de desenvolvimento
A desigualdade global pode aumentar mesmo com crescimento economico mundial quando a riqueza extra gerada se concentra em poucos paises, empresas e|grupos sociais;tipos climaticos;bacias hidrograficas;cadeias montanhosas|grupos sociais
Uma economia pode ser grande em populacao e territorio, mas ainda subordinada se nao dominar financas, tecnologia, marcas e|cadeias de valor;somente clima;tipos de relevo;fontes de agua subterranea|cadeias de valor
Paises semiperifericos revelam contradicoes porque podem ter industria relevante e ao mesmo tempo conviver com desigualdade social e|dependencia tecnologica parcial;ausencia de comercio;plena igualdade territorial;desindustrializacao total|dependencia tecnologica parcial
Uma leitura geografica das desigualdades mundiais precisa articular indicadores de renda, tecnologia, comercio, historia e|poder politico;apenas relevo;tipos de rocha;vegetacao costeira|poder politico
Quando empresas e capitais globais concentram investimentos nos espacos mais competitivos areas frageis podem aprofundar|marginalizacao economica;dominacao tecnologica;pleno emprego industrial;integracao equilibrada|marginalizacao economica
Politicas industriais, educacionais e cientificas sao importantes porque tentam alterar em favor do pais a distribuicao internacional de|poder economico;tipos de clima;modelado do relevo;bacias sedimentares|poder economico
Riqueza, tecnologia, poder e qualidade de vida se distribuem de forma desigual entre paises e tambem|dentro deles;entre placas tectonicas;apenas em regioes polares;fora das cidades|dentro deles
Uma sintese adequada sobre desenvolvimento mundial afirma que crescimento economico nao basta sem inovacao, distribuicao de renda, politicas publicas e|autonomia produtiva;somente clima;formas de relevo;vegetacao natural|autonomia produtiva
  `
);

const bloco7 = montarBloco(
  "Instituicoes financeiras e regulacao global",
  121,
  "Organismos multilaterais influenciam credito, comercio e a margem de acao dos Estados na economia mundial.",
  "analisar-instituicoes-financeiras-e-regulacao-global",
  `
O Fundo Monetario Internacional esta ligado principalmente a questoes de|estabilidade financeira e cambial;preservacao de biomas;planejamento urbano;controle de erosao|estabilidade financeira e cambial
O Banco Mundial e associado com frequencia a financiamentos para|projetos de desenvolvimento;guerras comerciais;controle de fronteiras urbanas;circulacao atmosferica|projetos de desenvolvimento
A OMC se relaciona diretamente com a regulacao de|regras do comercio internacional;politicas urbanas locais;estrutura demografica;ciclos de chuva|regras do comercio internacional
Quando um pais recorre ao FMI em crise externa isso costuma indicar dificuldade para manter|equilibrio das contas externas;o relevo local;a cobertura vegetal;a densidade populacional|equilibrio das contas externas
Emprestimos internacionais frequentemente trazem exigencias de ajuste fiscal, reformas e|condicionalidades;mudancas climaticas;terremotos;projecoes cartograficas|condicionalidades
Criticos afirmam que certas condicionalidades podem ampliar desemprego e desigualdade quando priorizam|ajustes recessivos;expansao universal de direitos;crescimento automatico;industrializacao espontanea|ajustes recessivos
A OMC busca reduzir barreiras e arbitrar conflitos, mas disputas persistem porque os paises defendem|interesses economicos nacionais;somente interesses geologicos;apenas fatores climaticos;uniformidade cultural mundial|interesses economicos nacionais
Instituicoes globais afetam a economia mundial porque influenciam credito, regras de comercio, confianca e|capacidade de financiamento dos Estados;origem das montanhas;tipos de rios;formacao dos desertos|capacidade de financiamento dos Estados
A distribuicao de poder de voto em organismos financeiros frequentemente reproduz|hierarquias economicas globais;igualdade total entre paises;independencia da riqueza nacional;ausencia de poder geopolitico|hierarquias economicas globais
Mesmo quando financiam obras relevantes emprestimos multilaterais podem aumentar dependencia se o pais nao fortalecer|crescimento autonomo;erosao costeira;controle climatico;homogeneidade territorial|crescimento autonomo
Uma governanca economica internacional mais equilibrada exigiria tornar as regras mais|democraticas;secretas;excludentes;uniformes por clima|democraticas
O financiamento externo pode ser util quando se combina com planejamento, investimento produtivo e|fortalecimento institucional;abandono da infraestrutura;retirada da educacao;isolamento tecnologico|fortalecimento institucional
Disputas na OMC revelam que, por tras das regras comerciais, existe conflito entre interesses de empresas, Estados e|blocos regionais;tipos de rocha;ciclos solares;formas de relevo|blocos regionais
A condicionalidade de creditos internacionais pode limitar politicas nacionais quando prioriza metas financeiras acima de necessidades sociais e|estrategias produtivas;movimentos tectonicos;distribuicao de ventos;tipos de vegetacao|estrategias produtivas
A existencia de regras multilaterais nao elimina o poder das grandes potencias, que continuam influenciando acordos por seu peso economico, diplomatico e|financeiro;geologico;climatico;hidrografico|financeiro
Crises de endividamento mostram que a insercao internacional de paises perifericos depende de juros globais, fluxo de capitais e|credibilidade externa;padrao de solos;estrutura de montanhas;tipos de nuvens|credibilidade externa
Uma leitura critica das instituicoes economicas globais deve considerar seu papel de regulacao, mas tambem as assimetrias de poder, as condicoes impostas e|os efeitos sociais das decisoes;somente a geologia regional;apenas os biomas locais;a latitude dos paises membros|os efeitos sociais das decisoes
A governanca economica internacional envolve disputa por normas, recursos e legitimidade. Por isso deve ser entendida como tema economico e|politico;somente geologico;apenas biologico;estritamente demografico|politico
FMI, Banco Mundial e OMC influenciam financiamento, comercio e estabilidade, mas seu funcionamento reflete desigualdades de poder, interesses nacionais e|conflitos geoeconomicos;somente clima regional;formacoes vegetais;processos erosivos|conflitos geoeconomicos
Uma sintese sobre regulacao global deve reconhecer que credito, comercio e ajuste macroeconomico estao ligados a normas multilaterais, condicionalidades e|disputas entre atores globais;tipos de relevo;zonas climaticas;projecoes cartograficas|disputas entre atores globais
`
);

const bloco8 = montarBloco(
  "Recursos, energia e materias-primas",
  141,
  "Recursos naturais so se convertem em poder economico quando se articulam a tecnologia, logistica e estrategia estatal.",
  "relacionar-recursos-energia-e-materias-primas-a-geoeconomia",
  `
Petroleo, minerios e gas natural sao exemplos de|recursos estrategicos;indicadores sociais;barreiras tarifarias;politicas urbanas|recursos estrategicos
Economia dependente do petroleo fica mais sensivel a|variacoes de preco e conflitos geopoliticos;padrao das chuvas;tipos de relevo;densidade demografica|variacoes de preco e conflitos geopoliticos
O controle de fontes de energia e rotas de abastecimento aumenta poder internacional porque energia e base para|producao e circulacao economica;erosao continental;classificacao climatica;forma das bacias|producao e circulacao economica
Transicao energetica significa ampliar o uso de fontes|menos poluentes e renovaveis;mais caras por definicao;somente minerais;desligadas da tecnologia|menos poluentes e renovaveis
Paises exportadores de commodities minerais podem crescer em momentos de alta de precos, mas continuam vulneraveis a|ciclos do mercado internacional;autonomia tecnologica total;estabilidade permanente;fim dos conflitos externos|ciclos do mercado internacional
A disputa por litio, cobre e terras raras cresce porque esses recursos sao importantes para|tecnologias e transicao energetica;desertificacao;cartografia escolar;erosao marinha|tecnologias e transicao energetica
Exportar oleo cru e importar derivados sofisticados mostra dependencia em etapa de|refino e agregacao de valor;natalidade e mortalidade;urbanizacao e mobilidade;clima e vegetacao|refino e agregacao de valor
O uso intensivo de combustiveis fosseis amplia problemas ambientais como|emissao de gases de efeito estufa;reducao do consumo de energia;fim da dependencia externa;eliminacao de conflitos por recursos|emissao de gases de efeito estufa
Investimentos em energia eolica, solar e biomassa podem reduzir dependencia externa quando combinados com tecnologia, redes e|planejamento energetico;fim do consumo urbano;desligamento industrial;ausencia de pesquisa|planejamento energetico
A localizacao de oleodutos, gasodutos e portos energeticos mostra que a geografia da energia depende de recursos, mercado, tecnologia e|logistica;tipos de nuvens;latitude;projecoes cartograficas|logistica
Quando um pais concentra sua pauta externa em petroleo ou minerios a arrecadacao publica pode oscilar conforme|precos internacionais;tipos de vegetacao;estruturas geologicas locais;chuvas de inverno|precos internacionais
Conflitos por energia e materias-primas mostram que recursos naturais sao questao economica e de|seguranca e poder geopolitico;meteorologia local;estrutura etaria;taxa de urbanizacao|seguranca e poder geopolitico
Uma transicao energetica justa exige ampliar renovaveis sem reproduzir dependencia em equipamentos, patentes e|minerais estrategicos controlados por poucos atores;chuvas orograficas;divisao administrativa;fronteiras culturais|minerais estrategicos controlados por poucos atores
Exportar recursos naturais sem processamento e importar produtos finais significa ceder parte importante do ganho ligado a tecnologia, industria e|valor agregado;cartografia;estrutura do relevo;circulacao de ventos|valor agregado
A seguranca energetica de um pais depende de disponibilidade de fontes, redes de distribuicao, reservas e|diversificacao da matriz;somente clima quente;altitude media;homogeneidade territorial|diversificacao da matriz
Economia dependente de combustiveis fosseis importados pode sofrer com aumento de custos e|inflacao interna;erosao do solo;queda da latitude;reducao da densidade urbana|inflacao interna
O acesso a agua, energia e materias-primas influencia a localizacao industrial porque reduz custos e amplia|seguranca de abastecimento;desconexao logistica;isolamento comercial;instabilidade institucional|seguranca de abastecimento
No mundo atual energia, minerais estrategicos e tecnologia formam um triangulo central para entender a disputa por|lideranca economica;tipos climaticos;formas de relevo;limites demograficos|lideranca economica
Uma leitura geografica de energia e materias-primas deve integrar recursos, cadeias produtivas, tecnologia, ambiente e|geopolitica;somente clima;tipos de solo;vegetacao local|geopolitica
Recursos naturais so se convertem em poder quando o Estado e as empresas conseguem explorar, processar, transportar, regular e|controlar estrategicamente;homogeneizar o clima;mudar o relevo;eliminar a demanda|controlar estrategicamente
`
);

const bloco9 = montarBloco(
  "Agricultura, commodities e geoeconomia alimentar",
  161,
  "A agricultura globalizada conecta campo, industria, logistica, financas e disputa por acesso a alimentos.",
  "analisar-agricultura-commodities-e-geoeconomia-alimentar",
  `
Soja, trigo, milho e cafe sao exemplos frequentes de produtos ligados a|agroexportacao;industrializacao pesada;servicos financeiros;setor quaternario|agroexportacao
Quando um pais se destaca na exportacao de alimentos e fibras ele participa do mercado mundial por meio de|commodities agricolas;barreiras geologicas;servicos urbanos;controle climatico|commodities agricolas
A agricultura moderna de exportacao costuma combinar mecanizacao, insumos industriais, grandes propriedades e|integracao ao mercado externo;ausencia de tecnologia;producao apenas local;fim da logistica|integracao ao mercado externo
A dependencia de poucas commodities agricolas torna a economia vulneravel a secas, variacao de preco e|mudancas na demanda internacional;estabilidade automatica;queda da produtividade industrial;projecoes cartograficas|mudancas na demanda internacional
A expansao de monoculturas de exportacao pode gerar divisas, mas tambem pressao sobre terras, agua e|ambientes naturais;ciclos lunares;placas tectonicas;correntes oceanicas|ambientes naturais
O agronegocio pode ampliar produtividade e exportacoes, mas nao elimina por si so problemas de concentracao fundiaria e|desigualdade no campo;industrializacao de ponta;mobilidade urbana;regularidade climatica|desigualdade no campo
Paises que dominam sementes, maquinario e agroquimicos exercem poder sobre a agricultura mundial por controlarem tecnologia e|insumos estrategicos;tipos de relevo;ciclos de chuvas;projecoes geodesicas|insumos estrategicos
A seguranca alimentar de um pais nao depende apenas de produzir muito, mas tambem de garantir acesso, distribuicao e|regularidade de abastecimento;isolamento externo total;reducao permanente da produtividade;ausencia de transporte|regularidade de abastecimento
Quando terras agricolas sao orientadas prioritariamente para exportacao pode haver tensao entre divisas externas e|abastecimento interno;cartografia urbana;estrutura geologica;homogeneidade cultural|abastecimento interno
Corredores logisticos, armazens e portos sao fundamentais ao agronegocio porque permitem escoar safras e reduzir|custos de circulacao;fertilidade dos solos;variedade climatica;mobilidade urbana|custos de circulacao
A alta do preco internacional dos alimentos pode beneficiar exportadores, mas pressionar consumidores urbanos e ampliar|inseguranca alimentar;industrializacao;seguranca cambial;autarquia comercial|inseguranca alimentar
A expansao agricola intensiva em capital mostra que o campo contemporaneo esta conectado a financas, tecnologia, industria e|mercado global;somente chuva local;tipos de rocha;estrutura dos vales|mercado global
Uma pauta agricola pouco diversificada aumenta riscos de receita externa e arrecadacao quando ocorrem crises de preco ou|quebra de safra;expansao de pesquisa;ganho logistico;industrializacao|quebra de safra
Territorios especializados em commodities alimentares podem crescer, mas continuar subordinados se nao desenvolverem processamento, tecnologia e|capacidade de decisao sobre as cadeias;fim do comercio externo;ausencia de logistica;desconexao com cidades|capacidade de decisao sobre as cadeias
A agricultura globalizada evidencia a conexao entre terra, trabalho, tecnologia, financas e|poder corporativo;somente relevo;tipos de vegetacao;ciclos de mare|poder corporativo
A producao de alimentos para o mercado mundial pode se expandir em areas de fronteira agricola, intensificando conflitos por terra, agua e|uso do territorio;correntes marinhas;projecoes cartograficas;erosao glacial|uso do territorio
Politicas de estocagem, apoio a pequenos produtores e infraestrutura de distribuicao podem reforcar a seguranca alimentar porque reduzem vulnerabilidades de mercado e|abastecimento;geomorfologia;temperatura media;projecao de mapas|abastecimento
Uma leitura critica da agricultura mundial deve considerar produtividade e exportacoes, mas tambem desigualdade fundiaria, ambiente, tecnologia e|soberania alimentar;apenas clima;tipos de solo;estrutura urbana|soberania alimentar
Commodities agricolas, tecnologia, logistica e demanda externa geram dinamismo, mas tambem podem aprofundar dependencia, impactos ambientais e|desigualdades territoriais;uniformidade climatica;estabilidade automatica de renda;fim das tensoes sociais|desigualdades territoriais
A geoeconomia alimentar envolve ao mesmo tempo mercado externo, estrategias empresariais, politicas publicas e|direito de acesso aos alimentos;somente vegetacao;tipos de relevo;clima local|direito de acesso aos alimentos
`
);

const bloco10 = montarBloco(
  "Geopolitica economica e interpretacao aplicada",
  181,
  "Tecnologia, financas, energia e comercio operam como instrumentos de poder e disputa no sistema internacional.",
  "avaliar-geopolitica-economica-e-interpretacao-aplicada",
  `
Quando um pais usa sua capacidade economica para influenciar outros mercados fala-se em|poder geoeconomico;erosao fluvial;segregacao urbana;transicao demografica|poder geoeconomico
Sancoes economicas buscam pressionar outro pais por meio de restricoes a comercio, financas e|investimentos;relevo;temperatura;rede hidrografica|investimentos
As disputas por semicondutores cresceram porque esses componentes sao essenciais para industria, defesa, comunicacoes e|tecnologia digital;agricultura manual;cartografia escolar;navegacao astronomica|tecnologia digital
A disputa entre potencias por cadeias tecnologicas, energia e minerais mostra que a economia mundial tambem e campo de|competicao estrategica;equilibrio automatico;neutralidade politica;homogeneidade produtiva|competicao estrategica
Quando uma potencia controla tecnologia, moeda forte, financas e cadeias produtivas ela amplia sua capacidade de|condicionar outros paises;abolir o comercio;eliminar toda a concorrencia;definir o clima regional|condicionar outros paises
Uma guerra ou bloqueio em rota maritima estrategica pode afetar rapidamente precos e abastecimento de energia, graos e|insumos industriais;mapas topograficos;estrutura fundiaria;climas regionais|insumos industriais
A dominacao do dolar em transacoes e reservas internacionais fortalece os Estados Unidos porque amplia sua influencia financeira e|monetaria global;cartografica;geomorfologica;demografica|monetaria global
Tentar nacionalizar etapas sensiveis de cadeias produtivas pode ser estrategia para reduzir dependencia externa em areas como energia, defesa e|tecnologia critica;cartografia escolar;tipos de solo;chuvas convectivas|tecnologia critica
Uma leitura geografica madura da economia mundial deve integrar comercio, financas, recursos, tecnologia, trabalho e|relacoes de poder;somente clima;tipos de vegetacao;orientacao cartografica|relacoes de poder
Crises globais como guerras, pandemias ou choques financeiros mostram que a interdependencia economica amplia a circulacao de bens, mas tambem de|riscos sistemicos;estabilidade absoluta;igualdade social imediata;isolamento produtivo|riscos sistemicos
A tentativa de aproximar producao e mercado consumidor em tempos de crise logistica tem relacao com busca por maior resiliencia, menor dependencia e|seguranca nas cadeias;expansao da erosao;homogeneidade cultural;reducao da produtividade|seguranca nas cadeias
A economia mundial contemporanea pode ser entendida como rede hierarquizada em que fluxos de capital, mercadorias e dados se organizam segundo infraestrutura, tecnologia e|comando politico-economico;tipos de solo;formas de relevo;vegetacao|comando politico-economico
Uma politica de desenvolvimento que queira reduzir vulnerabilidade externa precisa olhar para exportacoes, tecnologia, energia, financas e|capacidade estatal de planejamento;apenas clima tropical;formacao geologica;distribuicao das chuvas|capacidade estatal de planejamento
A dependencia de plataformas digitais, chips, financas e energia controlados por poucos centros mostra que a economia mundial atual combina globalizacao com|concentracao de poder;igualdade produtiva;autonomia de todos os paises;fim da concorrencia|concentracao de poder
Uma analise critica das sancoes economicas deve considerar seus efeitos sobre governos, empresas, comercio e|populacoes civis;tipos de relevo;cartografia escolar;estrutura de solos|populacoes civis
Diversificar parceiros, fortalecer industria local e investir em tecnologia sao medidas que podem ampliar a autonomia economica diante de|choques e pressoes externas;somente variacao climatica;mudancas de latitude;desgaste do relevo|choques e pressoes externas
Ao analisar economia mundial e importante perceber que tecnologia, financas, energia e alimento sao dimensoes simultaneamente economicas, sociais e|geopoliticas;estritamente geologicas;somente demograficas;exclusivamente climaticas|geopoliticas
Indicadores, cadeias produtivas, comercio, instituicoes e recursos so fazem sentido quando analisados com desigualdade, estrategia estatal e|relacoes de poder entre atores globais;localizacao absoluta;tipos de projecao cartografica;formas de intemperismo|relacoes de poder entre atores globais
Uma sintese sobre geoeconomia deve reconhecer que a disputa por tecnologia, moeda, energia e logistica interfere no desenvolvimento, na soberania e|na hierarquia entre territorios;na classificacao dos solos;na estrutura dos rios;na orientacao dos mapas|na hierarquia entre territorios
Economia mundial e geopolitica se conectam porque fluxos de mercadorias, capitais e dados dependem de redes materiais, normas internacionais, estrategia estatal e|conflitos de poder;somente clima;tipos de rocha;altitude media|conflitos de poder
`
);

export const economiaMundial = {
  id: "geografia_economia_mundial",
  materia: "Geografia",
  serie: [2],
  topico: "Economia Mundial",
  metadados: {
    disciplinaId: "geografia",
    base: "ESCOLAR",
    eixo: "Geografia",
    frente: "Geografia economica mundial",
    searchAliases: ["economia mundial", "dit", "comercio internacional", "blocos economicos", "geoeconomia", "commodities", "desenvolvimento"],
    subtopicosBase: [
      "Indicadores e conceitos economicos",
      "Setores da economia e estrutura produtiva",
      "Divisao internacional do trabalho",
      "Comercio internacional",
      "Blocos economicos e integracao regional",
      "Desenvolvimento, desigualdades e centros de poder",
      "Instituicoes financeiras e regulacao global",
      "Recursos, energia e materias-primas",
      "Agricultura, commodities e geoeconomia alimentar",
      "Geopolitica economica e interpretacao aplicada"
    ],
    habilidadesBase: [
      "identificar conceitos e indicadores da economia mundial",
      "analisar divisao internacional do trabalho e cadeias globais",
      "interpretar comercio internacional, blocos e instituicoes multilaterais",
      "relacionar recursos, energia e agricultura a disputas geoeconomicas",
      "avaliar desigualdades, poder e estrategias de insercao internacional"
    ]
  },
  questoes: [...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8, ...bloco9, ...bloco10]
};

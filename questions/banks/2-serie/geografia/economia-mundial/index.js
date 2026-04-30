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
  "Indicadores e conceitos econômicos",
  1,
  "A leitura da economia mundial exige relacionar indicadores de produção, renda e inserção internacional.",
  "interpretar-indicadores-economicos-da-economia-mundial",
  `
O indicador da soma de riquezas produzidas internamente é o|PIB;IDH;balança comercial;taxa de câmbio|PIB
Quando o PIB é dividido pela população obtemos o|PIB per capita;saldo comercial;juros basicos;parque industrial|PIB per capita
A diferenca entre exportacoes e importacoes forma a|balança comercial;pirâmide etária;taxa de fecundidade;densidade demográfica|balança comercial
Um superavit comercial ocorre quando o país exporta valor|maior que importa;igual ao que importa;menor que importa;sempre nulo|maior que importa
Commodity e, em geral, um produto|padronizado e muito negociado;sem valor comercial;exclusivo do setor publico;apenas digital|padronizado e muito negociado
A alta persistente e generalizada de precos caracteriza|inflação;dumping;urbanizacao;desindustrializacao|inflação
Quando a moeda nacional perde valor frente ao dolar ocorre|desvalorizacao cambial;integração aduaneira;reducao tarifaria;superavit fiscal|desvalorizacao cambial
PIB alto e desigualdade elevada mostram que a produção total não revela sozinha a|distribuição da renda;forma do relevo;localizacao absoluta;estrutura geológica|distribuição da renda
Inflação elevada tende a reduzir o|poder de compra;mercado externo;volume do território;número de empresas|poder de compra
Dois países com mesmo PIB podem ter realidades distintas quando se observa|PIB per capita e desigualdade;latitude e longitude;clima e relevo;vegetação e hidrografia|PIB per capita e desigualdade
Se um país importa mais do que exporta sua balança comercial tende a ser|deficitaria;superavitaria;autonoma;estavel por definicao|deficitaria
Moeda muito valorizada pode dificultar exportacoes porque torna os produtos internos|mais caros externamente;mais baratos externamente;mais raros internamente;imunes a concorrencia|mais caros externamente
Exportar matérias-primas e importar bens sofisticados indica menor dominio da|cadeia de valor internacional;dinamica climatica;rede hidrografica;estrutura etária|cadeia de valor internacional
PIB elevado com baixa produtividade e renda concentrada não garante alto nivel de|bem-estar social;erosao costeira;mobilidade pendular;regularidade climatica|bem-estar social
Economia dependente de um unico produto exportador fica mais vulneravel a|oscilações do mercado internacional;estabilidade automatica;queda das importacoes;fim da concorrencia|oscilações do mercado internacional
Em uma leitura mais completa o desempenho economico precisa ser comparado também com|qualidade de vida;tipos de solo;formas de relevo;distribuição das chuvas|qualidade de vida
Se o PIB cresce mas a renda real é o emprego caem o crescimento pode estar|concentrado e pouco distributivo;equilibrado por definicao;desligado da produção;sempre ligado ao pleno emprego|concentrado e pouco distributivo
Moeda fragil, inflação alta e dependencia externa dificultam manter|estabilidade macroeconomica;uniformidade cultural;padrao climatico;homogeneidade territorial|estabilidade macroeconomica
Ao comparar países indicadores econômicos ganham mais sentido quando lidos com desigualdade e|contexto historico;somente altitude;tipo de vegetação;número de rios|contexto historico
PIB, câmbio e balança comercial ajudam a explicar a economia, mas precisam ser ligados também a|distribuição social da riqueza;somente relevo;apenas clima;estrutura das montanhas|distribuição social da riqueza
`
);

const bloco2 = montarBloco(
  "Setores da economia e estrutura produtiva",
  21,
  "A estrutura produtiva revela como recursos, industria, serviços e tecnologia se articulam no território.",
  "analisar-a-estrutura-produtiva-na-economia-mundial",
  `
O setor ligado a extração de recursos naturais é o|setor primario;setor secundário;setor terciário;setor quaternario|setor primario
A transformação de matérias-primas em mercadorias ocorre no|setor secundário;setor primario;setor agrario;setor informal|setor secundário
Comércio, transporte e bancos pertencem sobretudo ao|setor terciário;setor primario;setor mineral;setor extrativo|setor terciário
Pesquisa, tecnologia e informacao são associados ao setor|quaternario;primario;informal;agricola|quaternario
Economia com forte presenca de serviços especializados tende a ter|maior complexidade produtiva;menor uso de tecnologia;ausencia de industria;mercado fechado|maior complexidade produtiva
País exportador de alta tecnologia tende a reter mais|valor agregado;erosao;dependencia climatica;isolamento logistico|valor agregado
Economia muito dependente do setor primario fica mais exposta a|variacoes de preco das commodities;estabilidade automatica;fim da concorrencia;controle das patentes|variacoes de preco das commodities
A industrializacao amplia o setor secundário e também impulsiona o|setor terciário;setor glacial;setor tectonico;setor pluvial|setor terciário
Base produtiva diversificada costuma aumentar a capacidade de|resistir a choques externos;depender de um unico produto;dispensar infraestrutura;eliminar o mercado interno|resistir a choques externos
Economias avancadas podem ter forte setor de serviços sem perder industria porque operam com|serviços complexos e cadeias globalizadas;agricultura de subsistencia;extração artesanal;autarquia econômica|serviços complexos e cadeias globalizadas
Quando um país amplia pesquisa e engenharia ele tende a subir na cadeia produtiva pelo maior uso de|conhecimento;erosao;ruralizacao;dependencia natural|conhecimento
Serviços simples e informais muito predominantes podem indicar|baixa sofisticacao econômica;dominio tecnologico;superavit industrial;autonomia financeira total|baixa sofisticacao econômica
Agroexportacao forte com pouca transformação interna tende a aumentar a dependencia de|centros externos de decisão e tecnologia;mercados locais fechados;mudancas geológicas;isolamento maritimo|centros externos de decisão e tecnologia
A passagem de uma economia agraria para outra urbano-industrial altera empregos, consumo e|organizacao do território;inclinacao do eixo terrestre;estrutura das placas;forma dos oceanos|organizacao do território
Industria de ponta, pesquisa e serviços sofisticados favorecem maior|capacidade de inovacao;dependencia exclusiva da natureza;reduzida qualificacao;fragilidade industrial permanente|capacidade de inovacao
Exportar soja bruta e importar maquinas sofisticadas indica etapa produtiva de|menor intensidade tecnologica;maior controle de patentes;maior dominio da engenharia;plena autonomia financeira|menor intensidade tecnologica
Setores econômicos devem ser lidos em conjunto porque o desenvolvimento depende da articulacao entre produção, tecnologia, serviços e|infraestrutura;somente clima;estrutura geológica;altitude média|infraestrutura
Em cadeias globais um mesmo bem pode ter pesquisa, montagem e venda em países distintos, mostrando|fragmentacao internacional da produção;autarquia econômica;fim do comércio;desruralizacao global|fragmentacao internacional da produção
Uma economia nacional fica mais robusta quando amplia industria, serviços sofisticados, pesquisa e|mercado interno;somente exportacoes primarias;isolamento logistico;dependencia de um produto|mercado interno
Uma sintese correta sobre estrutura produtiva afirma que ela depende da conexao entre recursos, industria, serviços, tecnologia e|inserção internacional;apenas relevo;somente hidrografia;tipos de solo|inserção internacional
`
);

const bloco3 = montarBloco(
  "Divisao internacional do trabalho",
  41,
  "A divisao internacional do trabalho distribui de forma desigual etapas, função e poder entre os territorios.",
  "analisar-a-divisao-internacional-do-trabalho",
  `
A DIT corresponde a distribuição desigual de atividades econômicas entre|países e regiões;rios e lagos;climas e vegetacoes;bacias sedimentares|países e regiões
Na DIT classica muitos países perifericos foram especializados em|matérias-primas;software;serviços financeiros;patentes industriais|matérias-primas
Historicamente os países centrais concentraram atividades de maior|tecnologia e comando;extração artesanal;dependencia externa;instabilidade demográfica|tecnologia e comando
A nova DIT se relaciona fortemente com a|globalizacao da produção;estagnacao do comércio;desaparecimento das empresas globais;autossuficiencia geral|globalizacao da produção
Quando um país recebe etapas de montagem mas não controla marcas nem tecnologia ele ocupa posicao|subordinada na cadeia produtiva;superior no comando global;fora da economia mundial;equivalente ao centro financeiro|subordinada na cadeia produtiva
A transferencia de fabricas para locais com salarios menores mostra busca empresarial por|reducao de custos;isolamento territorial;maior taxacao;autarquia produtiva|reducao de custos
Na nova DIT centros de pesquisa e decisão permanecem onde se concentram|capital, tecnologia e serviços avancados;agricultura de subsistencia;extração florestal;vazios demográficos|capital, tecnologia e serviços avancados
A DIT ajuda a explicar por que alguns países exportam tecnologia enquanto outros exportam sobretudo|produtos primarios;mapas tematicos;correntes marinhas;tipos de nuvens|produtos primarios
Países semiperifericos podem combinar industria, commodities e|dependencia tecnologica parcial;autonomia total de patentes;ausencia de comércio;fim da desigualdade|dependencia tecnologica parcial
A divisao internacional do trabalho muda conforme tecnologia, geopolica, empresas e|estrategias estatais;apenas altitude;formas de vegetação;massa de ar dominante|estrategias estatais
Investir em educação, tecnologia e industria pode ajudar um país a subir na DIT por meio de|maior agregacao de valor;abandono da infraestrutura;especializacao primaria exclusiva;isolamento comercial|maior agregacao de valor
A concentracao de patentes, marcas e financas em poucos países reforca o controle das|etapas mais lucrativas da cadeia;zonas rurais distantes;correntes atmosfericas;formas erosivas|etapas mais lucrativas da cadeia
Se um território atrai montadoras mas importa tecnologia e componentes-chave sua inserção permanece|dependente;autonoma;desligada;equilibrada por definicao|dependente
A nova DIT pode aprofundar desigualdades quando alguns países concentram pesquisa e lucro e outros recebem etapas mais poluentes de|produção;navegacao;cartografia;meteorologia|produção
Uma mesma empresa pode localizar design, montagem e vendas em países distintos para aproveitar custos, mercados e|especializacao territorial;homogeneidade cultural;ausencia de logística;uniformidade monetaria|especializacao territorial
Quando um país deixa de exportar apenas bens primarios e passa a produzir bens complexos ocorre|reposicionamento produtivo;desaparecimento do mercado externo;retorno a economia natural;fim das trocas globais|reposicionamento produtivo
Ao avaliar a DIT e incorreto supor beneficios iguais para todos porque tecnologia, financas e poder permanecem|desigualmente distribuidos;naturalmente iguais;fora do comércio;sem relação com empresas|desigualmente distribuidos
Políticas de conteudo local, pesquisa e formação técnica podem reduzir dependencia ao ampliar|capacidade produtiva interna;uso exclusivo de importacoes;especializacao apenas primaria;fechamento logistico|capacidade produtiva interna
A DIT deve ser entendida como resultado historico de colonizacao, industrializacao, tecnologia, financas e|geopolitica;somente clima;tipos de solo;movimentos de mare|geopolitica
Uma sintese coerente sobre a DIT afirma que ela distribui entre países etapas produtivas, funções de comando e|niveis distintos de apropriacao de valor;tipos iguais de vegetação;formas identicas de relevo;a mesma composição industrial|niveis distintos de apropriacao de valor
  `
);

const bloco4 = montarBloco(
  "Comércio internacional",
  61,
  "O comércio internacional articula produção, logística, acordos e disputas entre Estados e empresas.",
  "interpretar-o-comercio-internacional-na-economia-mundial",
  `
A venda de mercadorias de um país para outro é chamada de|exportação;importação;inflação;estatização|exportação
A compra de produtos vindos do exterior corresponde a|importação;cotacao;reexportacao;poupanca interna|importação
Tarifas alfandegarias são cobrancas aplicadas sobre mercadorias|que entram ou saem do país;produzidas apenas no campo;consumidas so internamente;vendidas no setor informal|que entram ou saem do país
Elevar tarifas para proteger empresas nacionais e pratica de|protecionismo;livre-cambismo;desregulacao total;desindustrializacao|protecionismo
Reduzir barreiras tarifarias entre países tende a estimular|maior fluxo de mercadorias;isolamento economico;fim da concorrencia;desaparecimento do mercado interno|maior fluxo de mercadorias
Pauta exportadora baseada em bens de baixo valor agregado fica mais sensivel a|variacoes de preco internacional;estabilidade automatica do lucro;fim da dependencia tecnologica;eliminacao da concorrencia|variacoes de preco internacional
Dumping ocorre quando uma empresa vende no exterior a preco artificialmente baixo para|ganhar mercado e enfraquecer concorrentes;evitar qualquer lucro;reduzir exportacoes;estimular tarifas dos rivais|ganhar mercado e enfraquecer concorrentes
Barreiras não tarifarias incluem exigencias sanitarias e técnicas que podem|restringir o acesso de produtos estrangeiros;eliminar a fiscalizacao;impedir o comércio interno;tornar todas as trocas gratuitas|restringir o acesso de produtos estrangeiros
País exportador de alimentos e importador de eletronicos revela|especializacao produtiva distinta;autossuficiencia total;fim da dependencia tecnologica;equilíbrio automatico de renda|especializacao produtiva distinta
A expansao do comércio mundial depende de logística, portos, financas, infraestrutura digital e|acordos comerciais;apenas relevo plano;desconexao monetaria;eliminacao do câmbio|acordos comerciais
Guerras comerciais entre grandes economias podem gerar|encarecimento de mercadorias e insumos;fim das cadeias globais em um dia;eliminacao da concorrencia;reducao imediata da desigualdade|encarecimento de mercadorias e insumos
Economia aberta ao comércio externo pode ganhar mercados e insumos, mas fica mais exposta a|crises internacionais;isolamento tecnologico;desaparecimento da inflação;controle total de precos globais|crises internacionais
Importar maquinas para modernizar a industria pode piorar a balança no curto prazo, mas ajudar depois por|ganhos de produtividade;queda do conhecimento tecnico;isolamento logistico;desaparecimento do investimento|ganhos de produtividade
Exportar muito e importar pouco não garante economia saudavel, pois e preciso observar a composição das trocas é o|valor agregado;orientacao dos ventos;tipo de relevo;quantidade de ilhas|valor agregado
Pauta exportadora concentrada em poucos produtos torna o país mais vulneravel a preco, demanda e|decisões externas;tipos de nuvens;processos de intemperismo;formas do litoral|decisões externas
No comércio mundial cadeias longas e dispersas por varios países fazem com que problemas em um elo afetem|todo o fluxo produtivo;apenas a agricultura local;somente a geologia regional;exclusivamente o turismo|todo o fluxo produtivo
Para reduzir dependencia comercial um país pode estimular produção interna de insumos estrategicos e|diversificar parceiros;fechar todos os portos;eliminar pesquisa;abandonar infraestrutura|diversificar parceiros
O discurso do livre comércio muitas vezes convive com protecionismo quando estao em jogo setores|estrategicos;sem qualquer valor;desligados de empregos;exclusivamente artesanais|estrategicos
Uma leitura geográfica do comércio internacional deve articular trocas, transporte, tecnologia, politica comercial e|desigualdades entre territorios;somente clima local;tipos de solo;bacias sedimentares|desigualdades entre territorios
Exportacoes, importacoes, tarifas e acordos alteram não apenas o fluxo de mercadorias, mas também a competitividade, a renda e|a inserção dos países na economia mundial;a inclinacao do planeta;a geologia dos continentes;as correntes marinhas|a inserção dos países na economia mundial
`
);

const bloco5 = montarBloco(
  "Blocos econômicos e integração regional",
  81,
  "Blocos econômicos integram mercados e projetam poder regional, mas convivem com assimetrias e conflitos.",
  "analisar-blocos-economicos-e-integracao-regional",
  `
Blocos econômicos são associacoes de países voltadas a ampliar|integração comercial e econômica;isolamento militar;uniformidade climatica;controle do relevo|integração comercial e econômica
Uma área de livre comércio reduz ou elimina tarifas entre membros sobre|mercadorias comercializadas entre eles;somente pessoas;apenas moedas;somente serviços publicos|mercadorias comercializadas entre eles
Uma uniao aduaneira se diferencia da área de livre comércio porque adota tarifa externa|comum;nula;regionalizada por clima;baseada apenas em população|comum
Mercado comum envolve livre circulação mais ampla de mercadorias, capitais, serviços e|pessoas;placas tectônicas;rios internacionais;tipos de vegetação|pessoas
Blocos econômicos podem aumentar o poder de negociacao dos membros diante de|outros mercados e potencias;somente seus municipios;placas oceanicas;massas de ar|outros mercados e potencias
Mesmo em blocos integrados surgem tensoes por causa de interesses produtivos diferentes e|assimetria entre membros;uniformidade monetaria total;ausencia de fronteiras;fim da concorrencia externa|assimetria entre membros
Quando um bloco amplia fluxos internos empresas podem reorganizar a produção em função de mercado ampliado, custos e|logística regional;tipos de rocha;altitude média;densidade florestal|logística regional
A integração regional pode beneficiar economias menores quando melhora acesso a mercado, investimentos e|infraestrutura de circulação;isolamento comercial;autarquia financeira;queda automatica da desigualdade|infraestrutura de circulação
Blocos econômicos não eliminam a soberania dos Estados, mas exigem coordenacao sobre|normas e políticas comerciais;estrutura geológica;tipos climaticos;formação dos solos|normas e políticas comerciais
Quando um bloco enfrenta crise econômica ou politica seus efeitos podem atingir comércio, investimentos e|confianca entre os membros;somente o relevo;a estrutura dos oceanos;a direcao dos ventos|confianca entre os membros
A existencia de um bloco pode favorecer complementaridade produtiva quando os países articulam cadeias regionais de|produção;erosao;cartografia;meteorologia|produção
Em muitos blocos a livre circulação não avanca no mesmo ritmo para bens, capitais, serviços e pessoas, mostrando que a integração e|gradual e desigual;instantanea e total;sempre homogenea;independente da politica|gradual e desigual
Se um bloco possui membros muito desiguais os maiores tendem a exercer mais influencia sobre|agendas e regras do bloco;tipos de chuva;estrutura do relevo;zonas de vegetação|agendas e regras do bloco
Uma integração regional consistente exige não apenas livre comércio, mas também harmonizacao regulatoria, infraestrutura e|cooperacao politica;uniformidade geológica;padrao unico de clima;desaparecimento da concorrencia|cooperacao politica
A integração por blocos pode fortalecer uma região, mas também reproduzir desigualdades quando os ganhos se concentram em|polos mais competitivos;áreas sem infraestrutura;setores sem mercado;territorios sem população|polos mais competitivos
Uma uniao econômica profunda pode incluir coordenacao monetaria, fiscal e institucional, exigindo|alto grau de convergencia entre países;fim do Estado nacional;reduzido compromisso politico;ausencia de regulacao|alto grau de convergencia entre países
Participar de um bloco pode ser vantajoso se ampliar mercado e investimento sem impedir|políticas de desenvolvimento interno;qualquer comércio externo;a produção de alimentos;a organizacao urbana|políticas de desenvolvimento interno
Blocos econômicos devem ser entendidos como instrumentos geoeconomicos porque articulam comércio, investimentos, normas e|poder regional;apenas tipos de relevo;composição dos solos;regimes de chuva|poder regional
Ao comparar blocos e importante observar nivel de integração, peso economico, infraestrutura, assimetrias internas e|instituicoes de governanca;somente latitude;tipo de rocha dominante;número de montanhas|instituicoes de governanca
Uma sintese correta sobre blocos econômicos afirma que eles buscam integrar mercados e ampliar poder de negociacao, mas dependem de assimetrias, infraestrutura, coordenacao politica e|estrategias de desenvolvimento;somente geologia;clima tropical;densidade demográfica isolada|estrategias de desenvolvimento
`
);

const bloco6 = montarBloco(
  "Desenvolvimento, desigualdades e centros de poder",
  101,
  "Riqueza, tecnologia e qualidade de vida se distribuem de forma desigual na economia mundial.",
  "avaliar-desenvolvimento-e-desigualdades-na-economia-mundial",
  `
Países desenvolvidos costumam apresentar maior renda, maior infraestrutura e|maior complexidade produtiva;dependencia exclusiva do setor primario;ausencia de serviços;economia natural dominante|maior complexidade produtiva
Países perifericos costumam enfrentar mais fragilidades em renda, infraestrutura e|inovacao tecnologica;clima regional;estrutura tectonica;latitude média|inovacao tecnologica
O termo semiperiferia indica países em posicao|intermediaria na economia mundial;central absoluta;ruralizada e isolada;fora do comércio internacional|intermediaria na economia mundial
A desigualdade entre países não se explica apenas por recursos naturais, mas também por história, colonizacao, industrializacao e|poder politico e tecnologico;apenas altitude;quantidade de rios;tipos de clima|poder politico e tecnologico
Um país pode crescer economicamente e ainda manter baixa qualidade social se o crescimento ocorrer com|forte concentracao de renda;pleno acesso a serviços;reducoes persistentes de pobreza;difusao tecnologica ampla|forte concentracao de renda
Países centrais concentram sedes de grandes empresas, centros financeiros e pesquisa, reforcando sua condicao de|comando economico mundial;isolamento geoeconomico;dependencia industrial;autarquia regional|comando economico mundial
A dependencia de exportacoes primarias e importacoes tecnologicas pode reproduzir subdesenvolvimento porque limita|autonomia produtiva;diversidade climatica;ocupacao litoranea;formação de rios|autonomia produtiva
A melhoria de indicadores sociais depende de renda, mas também de políticas publicas, infraestrutura e|distribuição mais equilibrada;somente abertura comercial;clima temperado;extensao territorial ampla|distribuição mais equilibrada
A permanencia de centros e periferias mostra que o desenvolvimento global e|desigual;homogeneo;automatico;independente da história|desigual
Investir em educação, ciência, infraestrutura e industria pode ajudar países perifericos a reduzir|dependencia estrutural;circulação de mercadorias;uso de portos;diversidade cultural|dependencia estrutural
A nocao de desenvolvimento humano amplia o olhar economico ao considerar renda, educação, saúde e|qualidade de vida;altitude média;projeções cartográficas;correntes oceanicas|qualidade de vida
Economias dependentes de capital externo e tecnologia importada tendem a ter menor margem para decidir sozinhas sobre|seu projeto de desenvolvimento;a direcao dos ventos;a formação do relevo;a insolacao anual|seu projeto de desenvolvimento
A desigualdade global pode aumentar mesmo com crescimento economico mundial quando a riqueza extra gerada se concentra em poucos países, empresas e|grupos sociais;tipos climaticos;bacias hidrograficas;cadeias montanhosas|grupos sociais
Uma economia pode ser grande em população e território, mas ainda subordinada se não dominar financas, tecnologia, marcas e|cadeias de valor;somente clima;tipos de relevo;fontes de água subterranea|cadeias de valor
Países semiperifericos revelam contradicoes porque podem ter industria relevante e ao mesmo tempo conviver com desigualdade social e|dependencia tecnologica parcial;ausencia de comércio;plena igualdade territorial;desindustrializacao total|dependencia tecnologica parcial
Uma leitura geográfica das desigualdades mundiais precisa articular indicadores de renda, tecnologia, comércio, história e|poder politico;apenas relevo;tipos de rocha;vegetação costeira|poder politico
Quando empresas e capitais globais concentram investimentos nos espacos mais competitivos áreas frageis podem aprofundar|marginalizacao econômica;dominacao tecnologica;pleno emprego industrial;integração equilibrada|marginalizacao econômica
Políticas industriais, educacionais e cientificas são importantes porque tentam alterar em favor do país a distribuição internacional de|poder economico;tipos de clima;modelado do relevo;bacias sedimentares|poder economico
Riqueza, tecnologia, poder e qualidade de vida se distribuem de forma desigual entre países e também|dentro deles;entre placas tectônicas;apenas em regiões polares;fora das cidades|dentro deles
Uma sintese adequada sobre desenvolvimento mundial afirma que crescimento economico não basta sem inovacao, distribuição de renda, políticas publicas e|autonomia produtiva;somente clima;formas de relevo;vegetação natural|autonomia produtiva
  `
);

const bloco7 = montarBloco(
  "Instituicoes financeiras e regulacao global",
  121,
  "Organismos multilaterais influenciam credito, comércio é a margem de ação dos Estados na economia mundial.",
  "analisar-instituicoes-financeiras-e-regulacao-global",
  `
O Fundo Monetario Internacional esta ligado principalmente a questoes de|estabilidade financeira e cambial;preservacao de biomas;planejamento urbano;controle de erosao|estabilidade financeira e cambial
O Banco Mundial e associado com frequência a financiamentos para|projetos de desenvolvimento;guerras comerciais;controle de fronteiras urbanas;circulação atmosférica|projetos de desenvolvimento
A OMC se relaciona diretamente com a regulacao de|regras do comércio internacional;políticas urbanas locais;estrutura demográfica;ciclos de chuva|regras do comércio internacional
Quando um país recorre ao FMI em crise externa isso costuma indicar dificuldade para manter|equilíbrio das contas externas;o relevo local;a cobertura vegetal;a densidade populacional|equilíbrio das contas externas
Emprestimos internacionais frequentemente trazem exigencias de ajuste fiscal, reformas e|condicionalidades;mudancas climaticas;terremotos;projeções cartográficas|condicionalidades
Criticos afirmam que certas condicionalidades podem ampliar desemprego e desigualdade quando priorizam|ajustes recessivos;expansao universal de direitos;crescimento automatico;industrializacao espontanea|ajustes recessivos
A OMC busca reduzir barreiras e arbitrar conflitos, mas disputas persistem porque os países defendem|interesses econômicos nacionais;somente interesses geologicos;apenas fatores climaticos;uniformidade cultural mundial|interesses econômicos nacionais
Instituicoes globais afetam a economia mundial porque influenciam credito, regras de comércio, confianca e|capacidade de financiamento dos Estados;origem das montanhas;tipos de rios;formação dos desertos|capacidade de financiamento dos Estados
A distribuição de poder de voto em organismos financeiros frequentemente reproduz|hierarquias econômicas globais;igualdade total entre países;independencia da riqueza nacional;ausencia de poder geopolitico|hierarquias econômicas globais
Mesmo quando financiam obras relevantes emprestimos multilaterais podem aumentar dependencia se o país não fortalecer|crescimento autonomo;erosao costeira;controle climatico;homogeneidade territorial|crescimento autonomo
Uma governanca econômica internacional mais equilibrada exigiria tornar as regras mais|democraticas;secretas;excludentes;uniformes por clima|democraticas
O financiamento externo pode ser util quando se combina com planejamento, investimento produtivo e|fortalecimento institucional;abandono da infraestrutura;retirada da educação;isolamento tecnologico|fortalecimento institucional
Disputas na OMC revelam que, por tras das regras comerciais, existe conflito entre interesses de empresas, Estados e|blocos regionais;tipos de rocha;ciclos solares;formas de relevo|blocos regionais
A condicionalidade de creditos internacionais pode limitar políticas nacionais quando prioriza metas financeiras acima de necessidades sociais e|estrategias produtivas;movimentos tectonicos;distribuição de ventos;tipos de vegetação|estrategias produtivas
A existencia de regras multilaterais não elimina o poder das grandes potencias, que continuam influenciando acordos por seu peso economico, diplomatico e|financeiro;geologico;climatico;hidrografico|financeiro
Crises de endividamento mostram que a inserção internacional de países perifericos depende de juros globais, fluxo de capitais e|credibilidade externa;padrao de solos;estrutura de montanhas;tipos de nuvens|credibilidade externa
Uma leitura critica das instituicoes econômicas globais deve considerar seu papel de regulacao, mas também as assimetrias de poder, as condições impostas e|os efeitos sociais das decisões;somente a geologia regional;apenas os biomas locais;a latitude dos países membros|os efeitos sociais das decisões
A governanca econômica internacional envolve disputa por normas, recursos e legitimidade. Por isso deve ser entendida como tema economico e|politico;somente geologico;apenas biologico;estritamente demografico|politico
FMI, Banco Mundial e OMC influenciam financiamento, comércio e estabilidade, mas seu funcionamento reflete desigualdades de poder, interesses nacionais e|conflitos geoeconomicos;somente clima regional;formacoes vegetais;processos erosivos|conflitos geoeconomicos
Uma sintese sobre regulacao global deve reconhecer que credito, comércio e ajuste macroeconomico estao ligados a normas multilaterais, condicionalidades e|disputas entre atores globais;tipos de relevo;zonas climaticas;projeções cartográficas|disputas entre atores globais
`
);

const bloco8 = montarBloco(
  "Recursos, energia e matérias-primas",
  141,
  "Recursos naturais so se convertem em poder economico quando se articulam a tecnologia, logística e estrategia estatal.",
  "relacionar-recursos-energia-e-materias-primas-a-geoeconomia",
  `
Petroleo, minerios e gas natural são exemplos de|recursos estrategicos;indicadores sociais;barreiras tarifarias;políticas urbanas|recursos estrategicos
Economia dependente do petroleo fica mais sensivel a|variacoes de preco e conflitos geopoliticos;padrao das chuvas;tipos de relevo;densidade demográfica|variacoes de preco e conflitos geopoliticos
O controle de fontes de energia e rotas de abastecimento aumenta poder internacional porque energia e base para|produção e circulação econômica;erosao continental;classificação climatica;forma das bacias|produção e circulação econômica
Transicao energetica significa ampliar o uso de fontes|menos poluentes e renovaveis;mais caras por definicao;somente minerais;desligadas da tecnologia|menos poluentes e renovaveis
Países exportadores de commodities minerais podem crescer em momentos de alta de precos, mas continuam vulneraveis a|ciclos do mercado internacional;autonomia tecnologica total;estabilidade permanente;fim dos conflitos externos|ciclos do mercado internacional
A disputa por litio, cobre e terras raras cresce porque esses recursos são importantes para|tecnologias e transicao energetica;desertificacao;cartografia escolar;erosao marinha|tecnologias e transicao energetica
Exportar oleo cru e importar derivados sofisticados mostra dependencia em etapa de|refino e agregacao de valor;natalidade e mortalidade;urbanizacao e mobilidade;clima e vegetação|refino e agregacao de valor
O uso intensivo de combustiveis fosseis amplia problemas ambientais como|emissao de gases de efeito estufa;reducao do consumo de energia;fim da dependencia externa;eliminacao de conflitos por recursos|emissao de gases de efeito estufa
Investimentos em energia eolica, solar e biomassa podem reduzir dependencia externa quando combinados com tecnologia, redes e|planejamento energetico;fim do consumo urbano;desligamento industrial;ausencia de pesquisa|planejamento energetico
A localizacao de oleodutos, gasodutos e portos energeticos mostra que a geografia da energia depende de recursos, mercado, tecnologia e|logística;tipos de nuvens;latitude;projeções cartográficas|logística
Quando um país concentra sua pauta externa em petroleo ou minerios a arrecadacao publica pode oscilar conforme|precos internacionais;tipos de vegetação;estruturas geológicas locais;chuvas de inverno|precos internacionais
Conflitos por energia e matérias-primas mostram que recursos naturais são questao econômica e de|seguranca e poder geopolitico;meteorologia local;estrutura etária;taxa de urbanizacao|seguranca e poder geopolitico
Uma transicao energetica justa exige ampliar renovaveis sem reproduzir dependencia em equipamentos, patentes e|minerais estrategicos controlados por poucos atores;chuvas orograficas;divisao administrativa;fronteiras culturais|minerais estrategicos controlados por poucos atores
Exportar recursos naturais sem processamento e importar produtos finais significa ceder parte importante do ganho ligado a tecnologia, industria e|valor agregado;cartografia;estrutura do relevo;circulação de ventos|valor agregado
A seguranca energetica de um país depende de disponibilidade de fontes, redes de distribuição, reservas e|diversificacao da matriz;somente clima quente;altitude média;homogeneidade territorial|diversificacao da matriz
Economia dependente de combustiveis fosseis importados pode sofrer com aumento de custos e|inflação interna;erosao do solo;queda da latitude;reducao da densidade urbana|inflação interna
O acesso a água, energia e matérias-primas influencia a localizacao industrial porque reduz custos e amplia|seguranca de abastecimento;desconexao logística;isolamento comercial;instabilidade institucional|seguranca de abastecimento
No mundo atual energia, minerais estrategicos e tecnologia formam um triângulo central para entender a disputa por|lideranca econômica;tipos climaticos;formas de relevo;limites demográficos|lideranca econômica
Uma leitura geográfica de energia e matérias-primas deve integrar recursos, cadeias produtivas, tecnologia, ambiente e|geopolitica;somente clima;tipos de solo;vegetação local|geopolitica
Recursos naturais so se convertem em poder quando o Estado e as empresas conseguem explorar, processar, transportar, regular e|controlar estrategicamente;homogeneizar o clima;mudar o relevo;eliminar a demanda|controlar estrategicamente
`
);

const bloco9 = montarBloco(
  "Agricultura, commodities e geoeconomia alimentar",
  161,
  "A agricultura globalizada conecta campo, industria, logística, financas e disputa por acesso a alimentos.",
  "analisar-agricultura-commodities-e-geoeconomia-alimentar",
  `
Soja, trigo, milho e cafe são exemplos frequentes de produtos ligados a|agroexportacao;industrializacao pesada;serviços financeiros;setor quaternario|agroexportacao
Quando um país se destaca na exportação de alimentos e fibras ele participa do mercado mundial por meio de|commodities agricolas;barreiras geológicas;serviços urbanos;controle climatico|commodities agricolas
A agricultura moderna de exportação costuma combinar mecanizacao, insumos industriais, grandes propriedades e|integração ao mercado externo;ausencia de tecnologia;produção apenas local;fim da logística|integração ao mercado externo
A dependencia de poucas commodities agricolas torna a economia vulneravel a secas, variação de preco e|mudancas na demanda internacional;estabilidade automatica;queda da produtividade industrial;projeções cartográficas|mudancas na demanda internacional
A expansao de monoculturas de exportação pode gerar divisas, mas também pressão sobre terras, água e|ambientes naturais;ciclos lunares;placas tectônicas;correntes oceanicas|ambientes naturais
O agronegocio pode ampliar produtividade e exportacoes, mas não elimina por si so problemas de concentracao fundiaria e|desigualdade no campo;industrializacao de ponta;mobilidade urbana;regularidade climatica|desigualdade no campo
Países que dominam sementes, maquinario e agroquimicos exercem poder sobre a agricultura mundial por controlarem tecnologia e|insumos estrategicos;tipos de relevo;ciclos de chuvas;projeções geodesicas|insumos estrategicos
A seguranca alimentar de um país não depende apenas de produzir muito, mas também de garantir acesso, distribuição e|regularidade de abastecimento;isolamento externo total;reducao permanente da produtividade;ausencia de transporte|regularidade de abastecimento
Quando terras agricolas são orientadas prioritariamente para exportação pode haver tensao entre divisas externas e|abastecimento interno;cartografia urbana;estrutura geológica;homogeneidade cultural|abastecimento interno
Corredores logisticos, armazens e portos são fundamentais ao agronegocio porque permitem escoar safras e reduzir|custos de circulação;fertilidade dos solos;variedade climatica;mobilidade urbana|custos de circulação
A alta do preco internacional dos alimentos pode beneficiar exportadores, mas pressionar consumidores urbanos e ampliar|inseguranca alimentar;industrializacao;seguranca cambial;autarquia comercial|inseguranca alimentar
A expansao agricola intensiva em capital mostra que o campo contemporaneo esta conectado a financas, tecnologia, industria e|mercado global;somente chuva local;tipos de rocha;estrutura dos vales|mercado global
Uma pauta agricola pouco diversificada aumenta riscos de receita externa e arrecadacao quando ocorrem crises de preco ou|quebra de safra;expansao de pesquisa;ganho logistico;industrializacao|quebra de safra
Territorios especializados em commodities alimentares podem crescer, mas continuar subordinados se não desenvolverem processamento, tecnologia e|capacidade de decisão sobre as cadeias;fim do comércio externo;ausencia de logística;desconexao com cidades|capacidade de decisão sobre as cadeias
A agricultura globalizada evidencia a conexao entre terra, trabalho, tecnologia, financas e|poder corporativo;somente relevo;tipos de vegetação;ciclos de mare|poder corporativo
A produção de alimentos para o mercado mundial pode se expandir em áreas de fronteira agricola, intensificando conflitos por terra, água e|uso do território;correntes marinhas;projeções cartográficas;erosao glacial|uso do território
Políticas de estocagem, apoio a pequenos produtores e infraestrutura de distribuição podem reforcar a seguranca alimentar porque reduzem vulnerabilidades de mercado e|abastecimento;geomorfologia;temperatura média;projecao de mapas|abastecimento
Uma leitura critica da agricultura mundial deve considerar produtividade e exportacoes, mas também desigualdade fundiaria, ambiente, tecnologia e|soberania alimentar;apenas clima;tipos de solo;estrutura urbana|soberania alimentar
Commodities agricolas, tecnologia, logística e demanda externa geram dinamismo, mas também podem aprofundar dependencia, impactos ambientais e|desigualdades territoriais;uniformidade climatica;estabilidade automatica de renda;fim das tensoes sociais|desigualdades territoriais
A geoeconomia alimentar envolve ao mesmo tempo mercado externo, estrategias empresariais, políticas publicas e|direito de acesso aos alimentos;somente vegetação;tipos de relevo;clima local|direito de acesso aos alimentos
`
);

const bloco10 = montarBloco(
  "Geopolitica econômica e interpretação aplicada",
  181,
  "Tecnologia, financas, energia e comércio operam como instrumentos de poder e disputa no sistema internacional.",
  "avaliar-geopolitica-economica-e-interpretacao-aplicada",
  `
Quando um país usa sua capacidade econômica para influenciar outros mercados fala-se em|poder geoeconomico;erosao fluvial;segregacao urbana;transicao demográfica|poder geoeconomico
Sancoes econômicas buscam pressionar outro país por meio de restricoes a comércio, financas e|investimentos;relevo;temperatura;rede hidrografica|investimentos
As disputas por semicondutores cresceram porque esses componentes são essenciais para industria, defesa, comunicacoes e|tecnologia digital;agricultura manual;cartografia escolar;navegacao astronomica|tecnologia digital
A disputa entre potencias por cadeias tecnologicas, energia e minerais mostra que a economia mundial também e campo de|competicao estrategica;equilíbrio automatico;neutralidade politica;homogeneidade produtiva|competicao estrategica
Quando uma potencia controla tecnologia, moeda forte, financas e cadeias produtivas ela amplia sua capacidade de|condicionar outros países;abolir o comércio;eliminar toda a concorrencia;definir o clima regional|condicionar outros países
Uma guerra ou bloqueio em rota maritima estrategica pode afetar rapidamente precos e abastecimento de energia, graos e|insumos industriais;mapas topograficos;estrutura fundiaria;climas regionais|insumos industriais
A dominacao do dolar em transacoes e reservas internacionais fortalece os Estados Unidos porque amplia sua influencia financeira e|monetaria global;cartografica;geomorfologica;demográfica|monetaria global
Tentar nacionalizar etapas sensiveis de cadeias produtivas pode ser estrategia para reduzir dependencia externa em áreas como energia, defesa e|tecnologia critica;cartografia escolar;tipos de solo;chuvas convectivas|tecnologia critica
Uma leitura geográfica madura da economia mundial deve integrar comércio, financas, recursos, tecnologia, trabalho e|relações de poder;somente clima;tipos de vegetação;orientacao cartografica|relações de poder
Crises globais como guerras, pandemias ou choques financeiros mostram que a interdependencia econômica amplia a circulação de bens, mas também de|riscos sistemicos;estabilidade absoluta;igualdade social imediata;isolamento produtivo|riscos sistemicos
A tentativa de aproximar produção e mercado consumidor em tempos de crise logística tem relação com busca por maior resiliencia, menor dependencia e|seguranca nas cadeias;expansao da erosao;homogeneidade cultural;reducao da produtividade|seguranca nas cadeias
A economia mundial contemporanea pode ser entendida como rede hierarquizada em que fluxos de capital, mercadorias e dados se organizam segundo infraestrutura, tecnologia e|comando politico-economico;tipos de solo;formas de relevo;vegetação|comando politico-economico
Uma politica de desenvolvimento que queira reduzir vulnerabilidade externa precisa olhar para exportacoes, tecnologia, energia, financas e|capacidade estatal de planejamento;apenas clima tropical;formação geológica;distribuição das chuvas|capacidade estatal de planejamento
A dependencia de plataformas digitais, chips, financas e energia controlados por poucos centros mostra que a economia mundial atual combina globalizacao com|concentracao de poder;igualdade produtiva;autonomia de todos os países;fim da concorrencia|concentracao de poder
Uma análise critica das sancoes econômicas deve considerar seus efeitos sobre governos, empresas, comércio e|populacoes civis;tipos de relevo;cartografia escolar;estrutura de solos|populacoes civis
Diversificar parceiros, fortalecer industria local e investir em tecnologia são medidas que podem ampliar a autonomia econômica diante de|choques e pressoes externas;somente variação climatica;mudancas de latitude;desgaste do relevo|choques e pressoes externas
Ao analisar economia mundial e importante perceber que tecnologia, financas, energia e alimento são dimensões simultaneamente econômicas, sociais e|geopoliticas;estritamente geológicas;somente demograficas;exclusivamente climaticas|geopoliticas
Indicadores, cadeias produtivas, comércio, instituicoes e recursos so fazem sentido quando analisados com desigualdade, estrategia estatal e|relações de poder entre atores globais;localizacao absoluta;tipos de projecao cartografica;formas de intemperismo|relações de poder entre atores globais
Uma sintese sobre geoeconomia deve reconhecer que a disputa por tecnologia, moeda, energia e logística interfere no desenvolvimento, na soberania e|na hierarquia entre territorios;na classificação dos solos;na estrutura dos rios;na orientacao dos mapas|na hierarquia entre territorios
Economia mundial e geopolitica se conectam porque fluxos de mercadorias, capitais e dados dependem de redes materiais, normas internacionais, estrategia estatal e|conflitos de poder;somente clima;tipos de rocha;altitude média|conflitos de poder
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
    frente: "Geografia econômica mundial",
    searchAliases: ["economia mundial", "dit", "comércio internacional", "blocos econômicos", "geoeconomia", "commodities", "desenvolvimento"],
    subtopicosBase: [
      "Indicadores e conceitos econômicos",
      "Setores da economia e estrutura produtiva",
      "Divisao internacional do trabalho",
      "Comércio internacional",
      "Blocos econômicos e integração regional",
      "Desenvolvimento, desigualdades e centros de poder",
      "Instituicoes financeiras e regulacao global",
      "Recursos, energia e matérias-primas",
      "Agricultura, commodities e geoeconomia alimentar",
      "Geopolitica econômica e interpretação aplicada"
    ],
    habilidadesBase: [
      "identificar conceitos e indicadores da economia mundial",
      "analisar divisao internacional do trabalho e cadeias globais",
      "interpretar comércio internacional, blocos e instituicoes multilaterais",
      "relacionar recursos, energia e agricultura a disputas geoeconomicas",
      "avaliar desigualdades, poder e estrategias de inserção internacional"
    ]
  },
  questoes: [...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8, ...bloco9, ...bloco10]
};

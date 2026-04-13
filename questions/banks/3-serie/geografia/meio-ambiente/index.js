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
  topico: "Meio Ambiente",
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
      id: `ma_${String(inicio + index).padStart(3, "0")}`,
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
  "Conceitos ambientais e sustentabilidade",
  1,
  "Meio ambiente deve ser entendido como relacao entre natureza, sociedade, uso de recursos e capacidade de suporte do planeta.",
  "identificar-conceitos-ambientais-e-sustentabilidade",
  `
meio ambiente|O conjunto das relacoes entre elementos naturais e sociedade forma o:
sustentabilidade|A ideia de atender necessidades presentes sem comprometer as futuras e a:
recurso natural|Elemento da natureza apropriado e utilizado pela sociedade e um:
equilibrio ecologico|A relacao dinamica entre seres vivos e ambiente define o:
preservacao ambiental|A protecao mais restritiva de ecossistemas e especies integra a:
conservacao ambiental|O uso controlado e a manutencao de recursos naturais compoem a:
degradacao ambiental|A perda de qualidade do ambiente por acao humana ou uso inadequado gera:
desenvolvimento sustentavel|A estrategia que combina economia, justica social e cuidado ambiental define o:
capacidade de suporte|O limite de uso que um ecossistema suporta sem colapso corresponde a:
impacto ambiental|A alteracao causada por atividade humana ou natural no meio e um:
servicos ecossistemicos|Beneficios fornecidos pelos ecossistemas a sociedade formam os:
biodiversidade|A variedade de especies, genes e ecossistemas define a:
uso racional dos recursos|A exploracao com menor desperdicio e maior planejamento integra o:
responsabilidade ambiental|A obrigacao social e institucional de prevenir danos ao ambiente corresponde a:
consumo consciente|A escolha de produtos e praticas com menor impacto integra o:
justica socioambiental|A discussao sobre quem sofre mais riscos e danos ambientais remete a:
pegada ecologica|O indicador que mede a pressao do consumo sobre a natureza e a:
educacao ambiental|A formacao critica voltada a cuidado e uso responsavel do ambiente e a:
crise ambiental contemporanea|A sintese do periodo atual marcada por mudancas climaticas, poluicao e perda de biodiversidade e a:
`
);

const bloco2 = montarBloco(
  "Biomas, biodiversidade e uso da terra",
  21,
  "A diversidade de biomas e ecossistemas depende do uso da terra, da conservacao e da pressao economica sobre os ambientes.",
  "analisar-biomas-biodiversidade-e-uso-da-terra",
  `
bioma|O conjunto de vegetacao, clima e formas de vida predominantes em grande area define um:
biodiversidade|A variedade de especies, genes e ecossistemas forma a:
ecossistema|A interacao entre seres vivos e elementos fisicos de um lugar compoe um:
uso da terra|A forma como sociedade ocupa e explora o solo corresponde ao:
fragmentacao de habitats|A divisao de ecossistemas continuos em porcoes menores provoca:
desmatamento|A retirada da cobertura vegetal original em larga escala e o:
unidade de conservacao|A area legalmente protegida para conservar a natureza e uma:
corredor ecologico|A faixa que liga fragmentos de vegetacao para manter fluxos biologicos e um:
especie endemica|Aquela que ocorre naturalmente em area restrita e uma:
especie ameacada|Organismo com risco elevado de desaparecer integra as:
expansao da fronteira agricola|O avanco de lavouras e pastagens sobre novas areas do territorio e a:
pressao antropica sobre biomas|As transformacoes causadas por atividades humanas nos ecossistemas geram:
uso multiplo da paisagem|A coexistencia de conservacao, agricultura, cidades e infraestrutura produz:
servicos da biodiversidade|Polinizacao, regulacao climatica e ciclagem de nutrientes sao:
degradacao de habitats|A perda de qualidade dos ambientes por desmatamento e poluicao constitui:
restauracao ambiental|A recuperacao de areas degradadas por revegetacao e manejo e a:
conectividade ecologica|A possibilidade de circulacao de especies entre areas naturais expressa:
economia e conservacao em tensao|A disputa entre producao e protecao dos biomas revela:
leitura geografica dos biomas|A sintese do tema exige articular natureza, uso da terra, economia e:
`
);

const bloco3 = montarBloco(
  "Mudancas climaticas",
  41,
  "O aquecimento global resulta da intensificacao do efeito estufa e produz impactos desiguais entre regioes e grupos sociais.",
  "analisar-mudancas-climaticas",
  `
mudanca climatica|A alteracao de longo prazo nos padroes climaticos em escala global define a:
aquecimento global|A elevacao da temperatura media do planeta e o:
efeito estufa|O processo natural de retencao de calor na atmosfera e o:
intensificacao do efeito estufa|O aumento excessivo da retencao de calor por gases adicionais forma a:
gas de efeito estufa|Substancia atmosferica capaz de reter calor na atmosfera e um:
emissao de carbono|A liberacao de CO2 e outros gases por atividades humanas corresponde a:
combustiveis fosseis|A principal fonte de emissoes industriais e energeticas ainda vem dos:
desmatamento como fonte emissora|A retirada da vegetacao tambem contribui para:
eventos climaticos extremos|Secas, enchentes e ondas de calor mais intensas sao:
adaptacao climatica|As medidas para reduzir vulnerabilidades diante das novas condicoes do clima formam a:
mitigacao climatica|As acoes voltadas a reduzir emissoes e conter o aquecimento compoem a:
justica climatica|O debate sobre responsabilidades e impactos desiguais da crise do clima e a:
vulnerabilidade climatica|A maior exposicao de certos grupos e territorios aos impactos expressa:
transicao para baixo carbono|A mudanca para economia menos emissora integra a:
acordo climatico internacional|O compromisso entre paises para enfrentar o aquecimento compoe um:
risco socioambiental ampliado|O clima em mudanca pode aumentar desastres e:
interdependencia planetaria do clima|As emissoes de um lugar repercutem globalmente, mostrando:
crise climatica como problema geografico|A sintese do tema exige unir atmosfera, energia, uso da terra e:
`
);

const bloco4 = montarBloco(
  "Agua e recursos hidricos",
  61,
  "A agua e recurso estrategico para consumo, producao, energia e equilibrio ambiental, mas esta sujeita a pressao e conflitos.",
  "analisar-agua-e-recursos-hidricos",
  `
bacia hidrografica|A area drenada por um rio principal e seus afluentes forma uma:
recurso hidrico|A agua apropriada para consumo, producao e servicos e um:
ciclo hidrologico|A circulacao da agua entre atmosfera, superficie e subsolo e o:
escassez hidrica|A falta ou insuficiencia de agua disponivel para usos diversos caracteriza:
estresse hidrico|A pressao elevada sobre a disponibilidade de agua em determinada area e o:
poluicao da agua|A contaminacao de rios, lagos e lencois por residuos gera:
uso multiplo da agua|Consumo humano, irrigacao, industria e energia compoem o:
conflito pelo uso da agua|A disputa entre diferentes usuarios e territorios expressa:
abastecimento urbano|A captacao, tratamento e distribuicao de agua para as cidades formam o:
saneamento hidrico|A gestao de agua e esgoto em perspectiva de saude e ambiente integra o:
aquifero|A reserva subterranea de agua armazenada em rochas e sedimentos e um:
degradacao de mananciais|A perda de qualidade de nascentes e reservatorios constitui:
seguranca hidrica|A garantia de agua em quantidade e qualidade adequadas define a:
gestao de bacias|O planejamento e controle dos usos de um sistema fluvial compoem a:
crise de abastecimento|Quando a oferta de agua nao atende a demanda urbana ou produtiva ocorre:
impermeabilizacao urbana|A cobertura do solo por asfalto e concreto dificulta infiltracao e agrava:
uso intensivo na irrigacao|Na agricultura a grande retirada de agua para producao forma:
agua como recurso geopolitico|Em algumas regioes a agua torna-se fator de tensao e:
leitura geografica da agua|A sintese do tema exige relacionar bacias, consumo, poluicao, conflito e:
`
);

const bloco5 = montarBloco(
  "Solo, relevo e degradacao",
  81,
  "O manejo inadequado do solo e do relevo pode intensificar erosao, assoreamento, desertificacao e perda de fertilidade.",
  "analisar-solo-relevo-e-degradacao-ambiental",
  `
erosao do solo|A retirada de particulas por agua ou vento caracteriza a:
assoreamento|O acumulo de sedimentos em rios e reservatorios e o:
vocoroca|A forma erosiva profunda aberta no terreno por escoamento concentrado e a:
desertificacao|A degradacao intensa em areas secas e semiaridas leva a:
compactacao do solo|O fechamento dos poros por peso excessivo ou manejo inadequado gera:
perda de fertilidade|A reducao da capacidade produtiva do solo constitui:
uso inadequado do relevo|Cultivo e ocupacao sem considerar declividade e fragilidade intensificam:
degradacao pedologica|A perda de qualidade dos solos e uma:
conservacao do solo|Praticas como terraceamento e cobertura vegetal integram a:
erosao laminar|A retirada superficial e gradual de camadas do solo e a:
escorregamento de encostas|Em areas inclinadas e saturadas de agua pode ocorrer:
fragilidade ambiental do relevo|Encostas ingremes e solos rasos apresentam maior:
manejo conservacionista|Praticas voltadas a proteger o solo e a agua compoem o:
associacao entre desmatamento e erosao|A retirada da cobertura vegetal favorece:
perda de capacidade produtiva da terra|A degradacao fisica e quimica do solo reduz:
risco geomorfologico|A maior probabilidade de movimentos de massa ou erosao intensa constitui:
ocupacao de areas instaveis|A urbanizacao ou agricultura em locais frageis amplia:
solo como recurso natural estrategico|A base para agricultura, infraestrutura e ecossistemas faz do solo um:
leitura geografica da degradacao do relevo|A sintese do tema exige unir clima, uso da terra, cobertura vegetal e:
`
);

const bloco6 = montarBloco(
  "Poluicao e residuos",
  101,
  "A producao e o consumo modernos ampliam residuos e diferentes formas de poluicao com efeitos territoriais e sociais.",
  "avaliar-poluicao-e-residuos",
  `
poluicao atmosferica|A contaminacao do ar por gases, particulas e fumaca define a:
poluicao hidrica|A contaminacao de rios, lagos e mares e a:
poluicao do solo|A contaminacao da terra por lixo e substancias quimicas constitui:
residuo solido|O material descartado por domicilios, industrias e comercio forma o:
lixao|A area de disposicao inadequada de residuos a ceu aberto e um:
aterro sanitario|O sistema controlado de disposicao final de residuos urbanos e o:
coleta seletiva|A separacao do lixo por tipo de material para reciclagem corresponde a:
reciclagem|O reaproveitamento de materiais descartados em novos processos e a:
economia circular|A estrategia de reduzir descarte e manter materiais em uso integra a:
residuo industrial perigoso|O descarte toxico, inflamavel ou corrosivo da producao industrial e um:
poluicao sonora|O excesso de ruido ambiental caracteriza a:
poluicao visual|O excesso de elementos que degradam a paisagem urbana forma a:
contaminacao por efluentes|O despejo de liquidos poluentes em corpos d'agua gera:
consumo descartavel|O modelo baseado em uso rapido e descarte constante amplia:
gestao integrada de residuos|A combinacao entre reducao, coleta, reciclagem e destinacao final compoe a:
responsabilidade compartilhada pelo lixo|Fabricantes, consumidores e poder publico participam da:
externalizacao dos impactos do consumo|Quando o descarte e a poluicao recaem sobre certos grupos ou lugares ocorre:
justica ambiental urbana|A distribuicao desigual dos danos do lixo e da poluicao nas cidades remete a:
leitura geografica da poluicao|A sintese do tema exige articular producao, consumo, territorio, saude e:
`
);

const bloco7 = montarBloco(
  "Desmatamento, queimadas e uso da terra",
  121,
  "Mudancas na cobertura vegetal refletem pressao economica, conflitos territoriais e efeitos ambientais em varias escalas.",
  "analisar-desmatamento-queimadas-e-uso-da-terra",
  `
desmatamento|A retirada da cobertura vegetal original em larga escala e o:
queimada|O uso do fogo para limpar area ou a ocorrencia de incendio no ambiente e a:
mudanca no uso da terra|A substituicao de vegetacao por agropecuaria, cidade ou infraestrutura corresponde a:
fronteira de ocupacao|A area de expansao recente de atividades economicas sobre novos espacos e a:
degradacao florestal|A perda parcial de qualidade da mata sem sua remocao total constitui:
fogo antropico|A maioria das queimadas ligadas a manejo ou abertura de area e causada por:
emissao por mudanca no uso da terra|A conversao de florestas e cerrados tambem gera:
expansao agropecuaria|Um dos principais motores do desmatamento no pais e a:
pressao sobre areas protegidas|Unidades de conservacao e terras tradicionais podem sofrer:
grilagem de terras|A apropriacao ilegal de area para ocupacao e especulacao e a:
fragmentacao florestal|A divisao de grandes blocos de vegetacao em porcoes menores e a:
perda de biodiversidade por queimadas|Incendios frequentes podem intensificar:
uso predatorio da terra|A exploracao sem conservacao e planejamento corresponde a:
monitoramento por satelite|A identificacao de desmatamento e queimadas em larga escala depende de:
recuperacao de areas degradadas|A restauracao de vegetacao e solo em espacos afetados integra:
economia e floresta em disputa|A tensao entre exploracao produtiva e conservacao revela:
impacto hidrologico do desmatamento|A retirada da vegetacao altera infiltracao, rios e:
questao territorial ambiental|A sintese sobre uso da terra mostra conflitos entre Estado, mercado, comunidades e:
`
);

const bloco8 = montarBloco(
  "Riscos ambientais e desastres",
  141,
  "Desastres resultam da interacao entre eventos naturais, vulnerabilidade social e ocupacao inadequada do territorio.",
  "analisar-riscos-ambientais-e-desastres",
  `
risco ambiental|A probabilidade de danos resultantes de perigos naturais ou antropicos forma o:
desastre natural|O evento de grande impacto associado a chuvas, secas, deslizamentos ou enchentes e um:
vulnerabilidade socioambiental|A maior exposicao e menor capacidade de resposta de certos grupos define a:
enchente|A elevacao do nivel dos rios e a inundacao de areas adjacentes caracteriza:
alagamento urbano|O acumulo temporario de agua por drenagem insuficiente gera:
deslizamento de encosta|O movimento de massa em areas inclinadas e saturadas de agua e o:
seca prolongada|A ausencia de chuvas por periodo extenso define a:
onda de calor|O periodo de temperaturas muito elevadas acima do normal e uma:
evento extremo|Fenomeno intenso com grande potencial de dano social e territorial e um:
defesa civil|O sistema de prevencao, resposta e assistencia em desastres e a:
mapeamento de risco|A identificacao de areas sujeitas a enchentes e deslizamentos compoe o:
ocupacao de area de risco|A instalacao de moradias em encostas, varzeas e margens de rio aumenta:
resiliencia comunitaria|A capacidade de uma populacao de resistir e recuperar-se de desastres define:
adaptacao territorial|As medidas para reduzir vulnerabilidades a eventos extremos formam a:
prevencao de desastres|Obras, planejamento urbano e alerta antecipado visam:
injustica dos desastres|Os impactos costumam recair mais fortemente sobre grupos com menor renda e:
mudanca climatica e extremos|O aquecimento global tende a aumentar frequencia ou intensidade de:
risco como construcao social e ambiental|A sintese geografica do tema mostra que desastres dependem de evento, vulnerabilidade e:
`
);

const bloco9 = montarBloco(
  "Politicas ambientais e acordos internacionais",
  161,
  "A regulacao ambiental envolve Estado, sociedade, ciencia e acordos multilaterais para reduzir danos e conservar recursos.",
  "analisar-politicas-ambientais-e-acordos-internacionais",
  `
politica ambiental|O conjunto de leis, programas e acoes para proteger o ambiente define a:
licenciamento ambiental|O processo de avaliacao e autorizacao de atividades potencialmente poluidoras e o:
estudo de impacto ambiental|A analise tecnica previa dos efeitos de um empreendimento forma o:
unidade de conservacao|A area legalmente protegida para fins de preservacao ou uso controlado e uma:
fiscalizacao ambiental|A vigilancia e aplicacao de normas pelo poder publico compoem a:
acordo internacional ambiental|O compromisso entre Estados para enfrentar problemas ecologicos e um:
governanca ambiental global|O conjunto de regras, conferencias e organismos voltados ao tema ambiental compoe a:
protocolo internacional|Um instrumento formal aprovado entre paises para orientar metas e regras e um:
meta de reducao de emissoes|Compromisso assumido para cortar gases de efeito estufa e uma:
area protegida|Espaco com controle legal de uso e ocupacao para preservar natureza constitui:
principio da precaucao|A ideia de agir preventivamente mesmo diante de incerteza cientifica e o:
responsabilidade compartilhada|No tema ambiental, governos, empresas e sociedade dividem a:
participacao social em politicas ambientais|Conselhos, audiencias e consulta publica fortalecem a:
planejamento ambiental|A definicao de usos adequados do territorio a partir de criterios ecologicos integra o:
educacao para sustentabilidade|Formacao critica para conservacao e uso responsavel dos recursos faz parte da:
Estado como regulador ambiental|No tema ecologico o poder publico atua por leis, controle e:
cooperacao internacional para o clima|As negociacoes entre paises para enfrentar o aquecimento global integram a:
conflito entre economia e regulacao|A sintese sobre politicas ambientais mostra tensao entre producao, conservacao e:
`
);

const bloco10 = montarBloco(
  "Leitura geografica do meio ambiente",
  181,
  "O meio ambiente precisa ser lido como resultado da interacao entre processos naturais, uso do territorio e desigualdades sociais.",
  "sintetizar-a-leitura-geografica-do-meio-ambiente",
  `
natureza apropriada socialmente|Na Geografia o ambiente nao e apenas natural, mas tambem:
espaco geografico ambientalizado|A relacao entre sociedade, tecnica e natureza forma um:
crise ecologica contemporanea|A combinacao de aquecimento, poluicao, perda de biodiversidade e riscos forma a:
territorio em disputa ambiental|O uso de agua, terra, florestas e energia envolve:
escala local e global dos problemas ambientais|Questoes ambientais devem ser entendidas desde o bairro ate o:
justica socioambiental|A distribuicao desigual de riscos, danos e acesso a recursos integra a:
impacto territorial do modelo produtivo|A forma de produzir, transportar e consumir deixa marcas no:
interdependencia ecologica planetaria|As relacoes ambientais entre diferentes regioes mostram uma:
ambiente como dimensao do desenvolvimento|A qualidade do meio nao pode ser separada de economia, saude e:
questao ambiental como questao politica|Decidir quem usa recursos e quem arca com danos torna o tema:
vulnerabilidade diferenciada|Grupos e territorios sofrem impactos em intensidades distintas, revelando:
planejamento territorial sustentavel|A organizacao do espaco considerando limites ambientais integra o:
ambiente e poder|Empresas, Estados e comunidades disputam o controle e o significado do:
leitura integrada dos ecossistemas|Entender um bioma ou bacia exige observar clima, relevo, vegetacao e:
meio ambiente como totalidade relacional|A sintese geografica do tema destaca a uniao entre natureza, sociedade e:
problema ambiental multicausal|A degradacao raramente tem causa unica, mas combina varios fatores de:
escala social dos danos ambientais|Os impactos recaem de modo desigual segundo renda, localizacao e:
interpretacao geografica da sustentabilidade|Pensar sustentabilidade exige articular territorio, uso de recursos, politica e:
meio ambiente como tema estruturante|A conclusao geral e que a questao ambiental atravessa economia, cidade, campo, energia e:
  `
);

const complementos = [
  criarQuestao({ id: "ma_020", subtopico: "Conceitos ambientais e sustentabilidade", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Uma leitura ambiental madura precisa relacionar recursos, consumo, justica social e:", opcoes: ["limites ecologicos", "apenas relevo", "somente crescimento urbano", "estrutura etaria"], correta: "limites ecologicos", comentario: "A sustentabilidade exige reconhecer que natureza e sociedade se condicionam mutuamente.", habilidade: "sintetizar-conceitos-ambientais-e-sustentabilidade" }),
  criarQuestao({ id: "ma_040", subtopico: "Biomas, biodiversidade e uso da terra", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Biomas e biodiversidade so podem ser protegidos de forma consistente quando se articulam conservacao, uso da terra e:", opcoes: ["planejamento territorial", "somente turismo", "uniformidade climatica", "ausencia de economia"], correta: "planejamento territorial", comentario: "A protecao da natureza depende diretamente das escolhas espaciais de uso do solo.", habilidade: "sintetizar-biomas-biodiversidade-e-uso-da-terra" }),
  criarQuestao({ id: "ma_059", subtopico: "Mudancas climaticas", dificuldadeLabel: "dificil", dificuldadeNivel: 9, cognicao: "avaliacao", tempoEstimado: 60, enunciado: "Mitigacao e adaptacao sao respostas diferentes a crise do clima, mas ambas dependem de:", opcoes: ["politicas publicas e cooperacao", "somente relevo", "falta de planejamento", "uniformidade territorial"], correta: "politicas publicas e cooperacao", comentario: "Enfrentar o aquecimento global exige acao combinada em varias escalas.", habilidade: "avaliar-respostas-a-crise-climatica" }),
  criarQuestao({ id: "ma_060", subtopico: "Mudancas climaticas", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Uma leitura geografica da crise climatica deve unir emissoes, energia, uso da terra, vulnerabilidade e:", opcoes: ["justica climatica", "somente temperatura", "tipos de vegetacao isolados", "projecoes cartograficas"], correta: "justica climatica", comentario: "Os impactos e as responsabilidades da crise nao se distribuem igualmente entre paises e grupos sociais.", habilidade: "sintetizar-mudancas-climaticas-em-perspectiva-geografica" }),
  criarQuestao({ id: "ma_080", subtopico: "Agua e recursos hidricos", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "A agua deve ser compreendida como recurso natural, bem comum, fator de producao e:", opcoes: ["tema geopolitico", "somente insumo industrial", "recurso ilimitado", "elemento sem conflito"], correta: "tema geopolitico", comentario: "A gestao da agua envolve abastecimento, energia, agricultura e disputa territorial.", habilidade: "sintetizar-agua-e-recursos-hidricos" }),
  criarQuestao({ id: "ma_100", subtopico: "Solo, relevo e degradacao", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Solo e relevo devem ser lidos em conjunto com cobertura vegetal, clima, uso da terra e:", opcoes: ["fragilidade ambiental", "somente densidade populacional", "uniformidade geologica", "ausencia de erosao"], correta: "fragilidade ambiental", comentario: "Os danos ao solo resultam da combinacao entre natureza e manejo inadequado.", habilidade: "sintetizar-solo-relevo-e-degradacao" }),
  criarQuestao({ id: "ma_120", subtopico: "Poluicao e residuos", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Uma interpretacao critica dos residuos exige relacionar producao, consumo, descarte, territorio e:", opcoes: ["responsabilidade compartilhada", "somente coleta urbana", "ausencia de mercado", "reducao do relevo"], correta: "responsabilidade compartilhada", comentario: "A questao do lixo envolve empresas, Estado e sociedade ao longo de toda a cadeia.", habilidade: "sintetizar-poluicao-e-residuos" }),
  criarQuestao({ id: "ma_139", subtopico: "Desmatamento, queimadas e uso da terra", dificuldadeLabel: "dificil", dificuldadeNivel: 9, cognicao: "avaliacao", tempoEstimado: 60, enunciado: "Desmatamento e queimadas precisam ser interpretados como resultado de pressao economica, uso da terra e:", opcoes: ["conflitos territoriais", "apenas clima seco", "somente vegetacao natural", "ausencia de politicas"], correta: "conflitos territoriais", comentario: "A abertura de novas frentes produtivas combina interesses privados e disputa pelo controle do espaco.", habilidade: "avaliar-desmatamento-e-queimadas" }),
  criarQuestao({ id: "ma_140", subtopico: "Desmatamento, queimadas e uso da terra", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Uma sintese do uso da terra no Brasil e no mundo deve unir agropecuaria, floresta, clima, mercados e:", opcoes: ["governanca territorial", "somente chuva", "apenas relevo", "estrutura etaria"], correta: "governanca territorial", comentario: "A forma de usar a terra depende de normas, fiscalizacao, poder economico e planejamento.", habilidade: "sintetizar-uso-da-terra-e-desmatamento" }),
  criarQuestao({ id: "ma_159", subtopico: "Riscos ambientais e desastres", dificuldadeLabel: "dificil", dificuldadeNivel: 9, cognicao: "avaliacao", tempoEstimado: 60, enunciado: "Desastres ambientais nao podem ser explicados apenas pelo evento natural, mas tambem por ocupacao, pobreza e:", opcoes: ["vulnerabilidade social", "somente tipo de solo", "latitude", "cartografia"], correta: "vulnerabilidade social", comentario: "A dimensao social do risco ajuda a entender quem mais sofre e por que sofre.", habilidade: "avaliar-riscos-ambientais-e-desastres" }),
  criarQuestao({ id: "ma_160", subtopico: "Riscos ambientais e desastres", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Uma leitura geografica dos desastres deve integrar perigo natural, vulnerabilidade, planejamento urbano e:", opcoes: ["capacidade de resposta institucional", "somente precipitacao", "clima estavel", "uso exclusivo do relevo"], correta: "capacidade de resposta institucional", comentario: "Risco e desastre dependem tanto do evento quanto das condicoes sociais e da gestao publica.", habilidade: "sintetizar-riscos-e-desastres-em-perspectiva-geografica" }),
  criarQuestao({ id: "ma_179", subtopico: "Politicas ambientais e acordos internacionais", dificuldadeLabel: "dificil", dificuldadeNivel: 9, cognicao: "avaliacao", tempoEstimado: 60, enunciado: "Politicas ambientais efetivas dependem de lei, fiscalizacao, participacao social e:", opcoes: ["capacidade de implementacao", "somente discursos internacionais", "ausencia de economia", "uniformidade regional"], correta: "capacidade de implementacao", comentario: "Normas ambientais so produzem efeito quando se convertem em acao concreta no territorio.", habilidade: "avaliar-politicas-ambientais-e-acordos" }),
  criarQuestao({ id: "ma_180", subtopico: "Politicas ambientais e acordos internacionais", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "A governanca ambiental global deve ser compreendida como articulacao entre Estados, sociedade, ciencia e:", opcoes: ["interesses em disputa", "somente clima", "tipos de vegetacao", "ausencia de poder"], correta: "interesses em disputa", comentario: "Os acordos ambientais sao negociados em meio a diferencas de responsabilidade e capacidade entre os paises.", habilidade: "sintetizar-governanca-ambiental-global" }),
  criarQuestao({ id: "ma_200", subtopico: "Leitura geografica do meio ambiente", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "A sintese geografica do meio ambiente precisa unir natureza, sociedade, uso do territorio, riscos e:", opcoes: ["desigualdade social", "somente clima", "estrutura etaria", "tipos de rocha"], correta: "desigualdade social", comentario: "Os problemas ambientais sempre se expressam territorialmente e atingem grupos sociais de forma desigual.", habilidade: "sintetizar-a-leitura-geografica-do-meio-ambiente" })
];

export const meioAmbiente = {
  id: "geografia_meio_ambiente",
  materia: "Geografia",
  serie: [3],
  topico: "Meio Ambiente",
  metadados: {
    disciplinaId: "geografia",
    base: "ESCOLAR",
    eixo: "Geografia",
    frente: "Geografia ambiental",
    searchAliases: ["meio ambiente", "sustentabilidade", "mudancas climaticas", "agua", "poluicao", "biodiversidade"],
    subtopicosBase: [
      "Conceitos ambientais e sustentabilidade",
      "Biomas, biodiversidade e uso da terra",
      "Mudancas climaticas",
      "Agua e recursos hidricos",
      "Solo, relevo e degradacao",
      "Poluicao e residuos",
      "Desmatamento, queimadas e uso da terra",
      "Riscos ambientais e desastres",
      "Politicas ambientais e acordos internacionais",
      "Leitura geografica do meio ambiente"
    ],
    habilidadesBase: [
      "identificar conceitos ambientais e de sustentabilidade",
      "analisar clima, agua, solo, biodiversidade e uso da terra",
      "relacionar poluicao, residuos e degradacao a processos sociais e produtivos",
      "avaliar riscos, desastres e politicas ambientais",
      "sintetizar uma leitura geografica integrada do meio ambiente"
    ]
  },
  questoes: [...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8, ...bloco9, ...bloco10, ...complementos].sort((a, b) => a.id.localeCompare(b.id))
};

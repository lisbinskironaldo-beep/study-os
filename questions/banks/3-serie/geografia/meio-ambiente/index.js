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
  "Meio ambiente deve ser entendido como relação entre natureza, sociedade, uso de recursos e capacidade de suporte do planeta.",
  "identificar-conceitos-ambientais-e-sustentabilidade",
  `
meio ambiente|O conjunto das relações entre elementos naturais e sociedade forma o:
sustentabilidade|A ideia de atender necessidades presentes sem comprometer as futuras é a:
recurso natural|Elemento da natureza apropriado e utilizado pela sociedade é um:
equilíbrio ecologico|A relação dinamica entre seres vivos e ambiente define o:
preservacao ambiental|A protecao mais restritiva de ecossistemas e especies integra a:
conservacao ambiental|O uso controlado é a manutencao de recursos naturais compoem a:
degradacao ambiental|A perda de qualidade do ambiente por ação humana ou uso inadequado gera:
desenvolvimento sustentavel|A estrategia que combina economia, justica social e cuidado ambiental define o:
capacidade de suporte|O limite de uso que um ecossistema suporta sem colapso corresponde a:
impacto ambiental|A alteracao causada por atividade humana ou natural no meio é um:
serviços ecossistemicos|Beneficios fornecidos pelos ecossistemas a sociedade formam os:
biodiversidade|A variedade de especies, genes e ecossistemas define a:
uso racional dos recursos|A exploracao com menor desperdicio e maior planejamento integra o:
responsabilidade ambiental|A obrigacao social e institucional de prevenir danos ao ambiente corresponde a:
consumo consciente|A escolha de produtos e praticas com menor impacto integra o:
justica socioambiental|A discussao sobre quem sofre mais riscos e danos ambientais remete a:
pegada ecologica|O indicador que mede a pressão do consumo sobre a natureza é a:
educação ambiental|A formação critica voltada a cuidado e uso responsavel do ambiente é a:
crise ambiental contemporanea|A sintese do periodo atual marcada por mudancas climaticas, poluicao e perda de biodiversidade é a:
`
);

const bloco2 = montarBloco(
  "Biomas, biodiversidade e uso da terra",
  21,
  "A diversidade de biomas e ecossistemas depende do uso da terra, da conservacao e da pressão econômica sobre os ambientes.",
  "analisar-biomas-biodiversidade-e-uso-da-terra",
  `
bioma|O conjunto de vegetação, clima e formas de vida predominantes em grande área define um:
biodiversidade|A variedade de especies, genes e ecossistemas forma a:
ecossistema|A interacao entre seres vivos e elementos fisicos de um lugar compoe um:
uso da terra|A forma como sociedade ocupa e explora o solo corresponde ao:
fragmentacao de habitats|A divisao de ecossistemas continuos em porcoes menores provoca:
desmatamento|A retirada da cobertura vegetal original em larga escala é o:
unidade de conservacao|A área legalmente protegida para conservar a natureza é uma:
corredor ecologico|A faixa que liga fragmentos de vegetação para manter fluxos biologicos é um:
especie endemica|Aquela que ocorre naturalmente em área restrita é uma:
especie ameacada|Organismo com risco elevado de desaparecer integra as:
expansao da fronteira agricola|O avanco de lavouras e pastagens sobre novas áreas do território é a:
pressão antropica sobre biomas|As transformações causadas por atividades humanas nos ecossistemas geram:
uso multiplo da paisagem|A coexistencia de conservacao, agricultura, cidades e infraestrutura produz:
serviços da biodiversidade|Polinizacao, regulacao climatica e ciclagem de nutrientes são:
degradacao de habitats|A perda de qualidade dos ambientes por desmatamento e poluicao constitui:
restauracao ambiental|A recuperacao de áreas degradadas por revegetacao e manejo é a:
conectividade ecologica|A possibilidade de circulação de especies entre áreas naturais expressa:
economia e conservacao em tensao|A disputa entre produção e protecao dos biomas revela:
leitura geográfica dos biomas|A sintese do tema exige articular natureza, uso da terra, economia e:
`
);

const bloco3 = montarBloco(
  "Mudancas climaticas",
  41,
  "O aquecimento global resulta da intensificacao do efeito estufa e produz impactos desiguais entre regiões e grupos sociais.",
  "analisar-mudancas-climaticas",
  `
mudança climatica|A alteracao de longo prazo nos padroes climaticos em escala global define a:
aquecimento global|A elevacao da temperatura média do planeta é o:
efeito estufa|O processo natural de retencao de calor na atmosfera é o:
intensificacao do efeito estufa|O aumento excessivo da retencao de calor por gases adicionais forma a:
gas de efeito estufa|Substancia atmosférica capaz de reter calor na atmosfera é um:
emissao de carbono|A liberacao de CO2 e outros gases por atividades humanas corresponde a:
combustiveis fosseis|A principal fonte de emissoes industriais e energeticas ainda vem dos:
desmatamento como fonte emissora|A retirada da vegetação também contribui para:
eventos climaticos extremos|Secas, enchentes e ondas de calor mais intensas são:
adaptacao climatica|As medidas para reduzir vulnerabilidades diante das novas condições do clima formam a:
mitigacao climatica|As ações voltadas a reduzir emissoes e conter o aquecimento compoem a:
justica climatica|O debate sobre responsabilidades e impactos desiguais da crise do clima é a:
vulnerabilidade climatica|A maior exposicao de certos grupos e territorios aos impactos expressa:
transicao para baixo carbono|A mudança para economia menos emissora integra a:
acordo climatico internacional|O compromisso entre países para enfrentar o aquecimento compoe um:
risco socioambiental ampliado|O clima em mudança pode aumentar desastres e:
interdependencia planetaria do clima|As emissoes de um lugar repercutem globalmente, mostrando:
crise climatica como problema geográfico|A sintese do tema exige unir atmosfera, energia, uso da terra e:
`
);

const bloco4 = montarBloco(
  "Água e recursos hidricos",
  61,
  "A água e recurso estrategico para consumo, produção, energia e equilíbrio ambiental, mas esta sujeita a pressão e conflitos.",
  "analisar-agua-e-recursos-hidricos",
  `
bacia hidrografica|A área drenada por um rio principal e seus afluentes forma uma:
recurso hidrico|A água apropriada para consumo, produção e serviços é um:
ciclo hidrologico|A circulação da água entre atmosfera, superfície e subsolo é o:
escassez hidrica|A falta ou insuficiencia de água disponivel para usos diversos caracteriza:
estresse hidrico|A pressão elevada sobre a disponibilidade de água em determinada área é o:
poluicao da água|A contaminacao de rios, lagos e lencois por residuos gera:
uso multiplo da água|Consumo humano, irrigacao, industria e energia compoem o:
conflito pelo uso da água|A disputa entre diferentes usuarios e territorios expressa:
abastecimento urbano|A captacao, tratamento e distribuição de água para as cidades formam o:
saneamento hidrico|A gestao de água e esgoto em perspectiva de saúde e ambiente integra o:
aquifero|A reserva subterranea de água armazenada em rochas e sedimentos é um:
degradacao de mananciais|A perda de qualidade de nascentes e reservatorios constitui:
seguranca hidrica|A garantia de água em quantidade e qualidade adequadas define a:
gestao de bacias|O planejamento e controle dos usos de um sistema fluvial compoem a:
crise de abastecimento|Quando a oferta de água não atende a demanda urbana ou produtiva ocorre:
impermeabilizacao urbana|A cobertura do solo por asfalto e concreto dificulta infiltracao e agrava:
uso intensivo na irrigacao|Na agricultura a grande retirada de água para produção forma:
água como recurso geopolitico|Em algumas regiões a água torna-se fator de tensao e:
leitura geográfica da água|A sintese do tema exige relacionar bacias, consumo, poluicao, conflito e:
`
);

const bloco5 = montarBloco(
  "Solo, relevo e degradacao",
  81,
  "O manejo inadequado do solo e do relevo pode intensificar erosao, assoreamento, desertificacao e perda de fertilidade.",
  "analisar-solo-relevo-e-degradacao-ambiental",
  `
erosao do solo|A retirada de particulas por água ou vento caracteriza a:
assoreamento|O acumulo de sedimentos em rios e reservatorios é o:
vocoroca|A forma erosiva profunda aberta no terreno por escoamento concentrado é a:
desertificacao|A degradacao intensa em áreas secas e semiaridas leva a:
compactacao do solo|O fechamento dos poros por peso excessivo ou manejo inadequado gera:
perda de fertilidade|A reducao da capacidade produtiva do solo constitui:
uso inadequado do relevo|Cultivo e ocupacao sem considerar declividade e fragilidade intensificam:
degradacao pedologica|A perda de qualidade dos solos é uma:
conservacao do solo|Praticas como terraceamento e cobertura vegetal integram a:
erosao laminar|A retirada superficial e gradual de camadas do solo é a:
escorregamento de encostas|Em áreas inclinadas e saturadas de água pode ocorrer:
fragilidade ambiental do relevo|Encostas ingremes e solos rasos apresentam maior:
manejo conservacionista|Praticas voltadas a proteger o solo é a água compoem o:
associacao entre desmatamento e erosao|A retirada da cobertura vegetal favorece:
perda de capacidade produtiva da terra|A degradacao física e química do solo reduz:
risco geomorfologico|A maior probabilidade de movimentos de massa ou erosao intensa constitui:
ocupacao de áreas instaveis|A urbanizacao ou agricultura em locais frageis amplia:
solo como recurso natural estrategico|A base para agricultura, infraestrutura e ecossistemas faz do solo um:
leitura geográfica da degradacao do relevo|A sintese do tema exige unir clima, uso da terra, cobertura vegetal e:
`
);

const bloco6 = montarBloco(
  "Poluicao e residuos",
  101,
  "A produção é o consumo modernos ampliam residuos e diferentes formas de poluicao com efeitos territoriais e sociais.",
  "avaliar-poluicao-e-residuos",
  `
poluicao atmosférica|A contaminacao do ar por gases, particulas e fumaca define a:
poluicao hidrica|A contaminacao de rios, lagos e mares é a:
poluicao do solo|A contaminacao da terra por lixo e substancias quimicas constitui:
residuo solido|O material descartado por domicilios, industrias e comércio forma o:
lixao|A área de disposicao inadequada de residuos a ceu aberto é um:
aterro sanitario|O sistema controlado de disposicao final de residuos urbanos é o:
coleta seletiva|A separacao do lixo por tipo de material para reciclagem corresponde a:
reciclagem|O reaproveitamento de materiais descartados em novos processos é a:
economia circular|A estrategia de reduzir descarte e manter materiais em uso integra a:
residuo industrial perigoso|O descarte toxico, inflamavel ou corrosivo da produção industrial é um:
poluicao sonora|O excesso de ruido ambiental caracteriza a:
poluicao visual|O excesso de elementos que degradam a paisagem urbana forma a:
contaminacao por efluentes|O despejo de liquidos poluentes em corpos d'água gera:
consumo descartavel|O modelo baseado em uso rapido e descarte constante amplia:
gestao integrada de residuos|A combinacao entre reducao, coleta, reciclagem e destinacao final compoe a:
responsabilidade compartilhada pelo lixo|Fabricantes, consumidores e poder publico participam da:
externalizacao dos impactos do consumo|Quando o descarte é a poluicao recaem sobre certos grupos ou lugares ocorre:
justica ambiental urbana|A distribuição desigual dos danos do lixo e da poluicao nas cidades remete a:
leitura geográfica da poluicao|A sintese do tema exige articular produção, consumo, território, saúde e:
`
);

const bloco7 = montarBloco(
  "Desmatamento, queimadas e uso da terra",
  121,
  "Mudancas na cobertura vegetal refletem pressão econômica, conflitos territoriais e efeitos ambientais em varias escalas.",
  "analisar-desmatamento-queimadas-e-uso-da-terra",
  `
desmatamento|A retirada da cobertura vegetal original em larga escala é o:
queimada|O uso do fogo para limpar área ou a ocorrencia de incendio no ambiente é a:
mudança no uso da terra|A substituicao de vegetação por agropecuaria, cidade ou infraestrutura corresponde a:
fronteira de ocupacao|A área de expansao recente de atividades econômicas sobre novos espacos é a:
degradacao florestal|A perda parcial de qualidade da mata sem sua remocao total constitui:
fogo antropico|A maioria das queimadas ligadas a manejo ou abertura de área e causada por:
emissao por mudança no uso da terra|A conversao de florestas e cerrados também gera:
expansao agropecuaria|Um dos principais motores do desmatamento no país é a:
pressão sobre áreas protegidas|Unidades de conservacao e terras tradicionais podem sofrer:
grilagem de terras|A apropriacao ilegal de área para ocupacao e especulacao é a:
fragmentacao florestal|A divisao de grandes blocos de vegetação em porcoes menores é a:
perda de biodiversidade por queimadas|Incendios frequentes podem intensificar:
uso predatorio da terra|A exploracao sem conservacao e planejamento corresponde a:
monitoramento por satelite|A identificacao de desmatamento e queimadas em larga escala depende de:
recuperacao de áreas degradadas|A restauracao de vegetação e solo em espacos afetados integra:
economia e floresta em disputa|A tensao entre exploracao produtiva e conservacao revela:
impacto hidrologico do desmatamento|A retirada da vegetação altera infiltracao, rios e:
questao territorial ambiental|A sintese sobre uso da terra mostra conflitos entre Estado, mercado, comunidades e:
`
);

const bloco8 = montarBloco(
  "Riscos ambientais e desastres",
  141,
  "Desastres resultam da interacao entre eventos naturais, vulnerabilidade social e ocupacao inadequada do território.",
  "analisar-riscos-ambientais-e-desastres",
  `
risco ambiental|A probabilidade de danos resultantes de perigos naturais ou antropicos forma o:
desastre natural|O evento de grande impacto associado a chuvas, secas, deslizamentos ou enchentes é um:
vulnerabilidade socioambiental|A maior exposicao e menor capacidade de resposta de certos grupos define a:
enchente|A elevacao do nivel dos rios é a inundacao de áreas adjacentes caracteriza:
alagamento urbano|O acumulo temporario de água por drenagem insuficiente gera:
deslizamento de encosta|O movimento de massa em áreas inclinadas e saturadas de água é o:
seca prolongada|A ausencia de chuvas por periodo extenso define a:
onda de calor|O periodo de temperaturas muito elevadas acima do normal é uma:
evento extremo|Fenomeno intenso com grande potencial de dano social e territorial é um:
defesa civil|O sistema de prevencao, resposta e assistencia em desastres é a:
mapeamento de risco|A identificacao de áreas sujeitas a enchentes e deslizamentos compoe o:
ocupacao de área de risco|A instalacao de moradias em encostas, varzeas e margens de rio aumenta:
resiliencia comunitaria|A capacidade de uma população de resistir e recuperar-se de desastres define:
adaptacao territorial|As medidas para reduzir vulnerabilidades a eventos extremos formam a:
prevencao de desastres|Obras, planejamento urbano e alerta antecipado visam:
injustica dos desastres|Os impactos costumam recair mais fortemente sobre grupos com menor renda e:
mudança climatica e extremos|O aquecimento global tende a aumentar frequência ou intensidade de:
risco como construcao social e ambiental|A sintese geográfica do tema mostra que desastres dependem de evento, vulnerabilidade e:
`
);

const bloco9 = montarBloco(
  "Políticas ambientais e acordos internacionais",
  161,
  "A regulacao ambiental envolve Estado, sociedade, ciência e acordos multilaterais para reduzir danos e conservar recursos.",
  "analisar-politicas-ambientais-e-acordos-internacionais",
  `
politica ambiental|O conjunto de leis, programas e ações para proteger o ambiente define a:
licenciamento ambiental|O processo de avaliação e autorizacao de atividades potencialmente poluidoras é o:
estudo de impacto ambiental|A análise técnica previa dos efeitos de um empreendimento forma o:
unidade de conservacao|A área legalmente protegida para fins de preservacao ou uso controlado é uma:
fiscalizacao ambiental|A vigilancia e aplicacao de normas pelo poder publico compoem a:
acordo internacional ambiental|O compromisso entre Estados para enfrentar problemas ecologicos é um:
governanca ambiental global|O conjunto de regras, conferencias e organismos voltados ao tema ambiental compoe a:
protocolo internacional|Um instrumento formal aprovado entre países para orientar metas e regras é um:
meta de reducao de emissoes|Compromisso assumido para cortar gases de efeito estufa é uma:
área protegida|Espaço com controle legal de uso e ocupacao para preservar natureza constitui:
principio da precaucao|A ideia de agir preventivamente mesmo diante de incerteza cientifica é o:
responsabilidade compartilhada|No tema ambiental, governos, empresas e sociedade dividem a:
participacao social em políticas ambientais|Conselhos, audiencias e consulta publica fortalecem a:
planejamento ambiental|A definicao de usos adequados do território a partir de critérios ecologicos integra o:
educação para sustentabilidade|Formação critica para conservacao e uso responsavel dos recursos faz parte da:
Estado como regulador ambiental|No tema ecologico o poder publico atua por leis, controle e:
cooperacao internacional para o clima|As negociacoes entre países para enfrentar o aquecimento global integram a:
conflito entre economia e regulacao|A sintese sobre políticas ambientais mostra tensao entre produção, conservacao e:
`
);

const bloco10 = montarBloco(
  "Leitura geográfica do meio ambiente",
  181,
  "O meio ambiente precisa ser lido como resultado da interacao entre processos naturais, uso do território e desigualdades sociais.",
  "sintetizar-a-leitura-geografica-do-meio-ambiente",
  `
natureza apropriada socialmente|Na Geografia o ambiente não é apenas natural, mas também:
espaço geográfico ambientalizado|A relação entre sociedade, técnica e natureza forma um:
crise ecologica contemporanea|A combinacao de aquecimento, poluicao, perda de biodiversidade e riscos forma a:
território em disputa ambiental|O uso de água, terra, florestas e energia envolve:
escala local e global dos problemas ambientais|Questoes ambientais devem ser entendidas desde o bairro ate o:
justica socioambiental|A distribuição desigual de riscos, danos e acesso a recursos integra a:
impacto territorial do modelo produtivo|A forma de produzir, transportar e consumir deixa marcas no:
interdependencia ecologica planetaria|As relações ambientais entre diferentes regiões mostram uma:
ambiente como dimensao do desenvolvimento|A qualidade do meio não pode ser separada de economia, saúde e:
questao ambiental como questao politica|Decidir quem usa recursos e quem arca com danos torna o tema:
vulnerabilidade diferenciada|Grupos e territorios sofrem impactos em intensidades distintas, revelando:
planejamento territorial sustentavel|A organizacao do espaço considerando limites ambientais integra o:
ambiente e poder|Empresas, Estados e comunidades disputam o controle é o significado do:
leitura integrada dos ecossistemas|Entender um bioma ou bacia exige observar clima, relevo, vegetação e:
meio ambiente como totalidade relacional|A sintese geográfica do tema destaca a uniao entre natureza, sociedade e:
problema ambiental multicausal|A degradacao raramente tem causa unica, mas combina varios fatores de:
escala social dos danos ambientais|Os impactos recaem de modo desigual segundo renda, localizacao e:
interpretação geográfica da sustentabilidade|Pensar sustentabilidade exige articular território, uso de recursos, politica e:
meio ambiente como tema estruturante|A conclusao geral e que a questao ambiental atravessa economia, cidade, campo, energia e:
  `
);

const complementos = [
  criarQuestao({ id: "ma_020", subtopico: "Conceitos ambientais e sustentabilidade", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Uma leitura ambiental madura precisa relacionar recursos, consumo, justica social e:", opcoes: ["limites ecologicos", "apenas relevo", "somente crescimento urbano", "estrutura etária"], correta: "limites ecologicos", comentario: "A sustentabilidade exige reconhecer que natureza e sociedade se condicionam mutuamente.", habilidade: "sintetizar-conceitos-ambientais-e-sustentabilidade" }),
  criarQuestao({ id: "ma_040", subtopico: "Biomas, biodiversidade e uso da terra", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Biomas e biodiversidade so podem ser protegidos de forma consistente quando se articulam conservacao, uso da terra e:", opcoes: ["planejamento territorial", "somente turismo", "uniformidade climatica", "ausencia de economia"], correta: "planejamento territorial", comentario: "A protecao da natureza depende diretamente das escolhas espaciais de uso do solo.", habilidade: "sintetizar-biomas-biodiversidade-e-uso-da-terra" }),
  criarQuestao({ id: "ma_059", subtopico: "Mudancas climaticas", dificuldadeLabel: "dificil", dificuldadeNivel: 9, cognicao: "avaliacao", tempoEstimado: 60, enunciado: "Mitigacao e adaptacao são respostas diferentes a crise do clima, mas ambas dependem de:", opcoes: ["políticas publicas e cooperacao", "somente relevo", "falta de planejamento", "uniformidade territorial"], correta: "políticas publicas e cooperacao", comentario: "Enfrentar o aquecimento global exige ação combinada em varias escalas.", habilidade: "avaliar-respostas-a-crise-climatica" }),
  criarQuestao({ id: "ma_060", subtopico: "Mudancas climaticas", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Uma leitura geográfica da crise climatica deve unir emissoes, energia, uso da terra, vulnerabilidade e:", opcoes: ["justica climatica", "somente temperatura", "tipos de vegetação isolados", "projeções cartográficas"], correta: "justica climatica", comentario: "Os impactos e as responsabilidades da crise não se distribuem igualmente entre países e grupos sociais.", habilidade: "sintetizar-mudancas-climaticas-em-perspectiva-geografica" }),
  criarQuestao({ id: "ma_080", subtopico: "Água e recursos hidricos", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "A água deve ser compreendida como recurso natural, bem comum, fator de produção e:", opcoes: ["tema geopolitico", "somente insumo industrial", "recurso ilimitado", "elemento sem conflito"], correta: "tema geopolitico", comentario: "A gestao da água envolve abastecimento, energia, agricultura e disputa territorial.", habilidade: "sintetizar-agua-e-recursos-hidricos" }),
  criarQuestao({ id: "ma_100", subtopico: "Solo, relevo e degradacao", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Solo e relevo devem ser lidos em conjunto com cobertura vegetal, clima, uso da terra e:", opcoes: ["fragilidade ambiental", "somente densidade populacional", "uniformidade geológica", "ausencia de erosao"], correta: "fragilidade ambiental", comentario: "Os danos ao solo resultam da combinacao entre natureza e manejo inadequado.", habilidade: "sintetizar-solo-relevo-e-degradacao" }),
  criarQuestao({ id: "ma_120", subtopico: "Poluicao e residuos", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Uma interpretação critica dos residuos exige relacionar produção, consumo, descarte, território e:", opcoes: ["responsabilidade compartilhada", "somente coleta urbana", "ausencia de mercado", "reducao do relevo"], correta: "responsabilidade compartilhada", comentario: "A questao do lixo envolve empresas, Estado e sociedade ao longo de toda a cadeia.", habilidade: "sintetizar-poluicao-e-residuos" }),
  criarQuestao({ id: "ma_139", subtopico: "Desmatamento, queimadas e uso da terra", dificuldadeLabel: "dificil", dificuldadeNivel: 9, cognicao: "avaliacao", tempoEstimado: 60, enunciado: "Desmatamento e queimadas precisam ser interpretados como resultado de pressão econômica, uso da terra e:", opcoes: ["conflitos territoriais", "apenas clima seco", "somente vegetação natural", "ausencia de políticas"], correta: "conflitos territoriais", comentario: "A abertura de novas frentes produtivas combina interesses privados e disputa pelo controle do espaço.", habilidade: "avaliar-desmatamento-e-queimadas" }),
  criarQuestao({ id: "ma_140", subtopico: "Desmatamento, queimadas e uso da terra", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Uma sintese do uso da terra no Brasil e no mundo deve unir agropecuaria, floresta, clima, mercados e:", opcoes: ["governanca territorial", "somente chuva", "apenas relevo", "estrutura etária"], correta: "governanca territorial", comentario: "A forma de usar a terra depende de normas, fiscalizacao, poder economico e planejamento.", habilidade: "sintetizar-uso-da-terra-e-desmatamento" }),
  criarQuestao({ id: "ma_159", subtopico: "Riscos ambientais e desastres", dificuldadeLabel: "dificil", dificuldadeNivel: 9, cognicao: "avaliacao", tempoEstimado: 60, enunciado: "Desastres ambientais não podem ser explicados apenas pelo evento natural, mas também por ocupacao, pobreza e:", opcoes: ["vulnerabilidade social", "somente tipo de solo", "latitude", "cartografia"], correta: "vulnerabilidade social", comentario: "A dimensao social do risco ajuda a entender quem mais sofre e por que sofre.", habilidade: "avaliar-riscos-ambientais-e-desastres" }),
  criarQuestao({ id: "ma_160", subtopico: "Riscos ambientais e desastres", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "Uma leitura geográfica dos desastres deve integrar perigo natural, vulnerabilidade, planejamento urbano e:", opcoes: ["capacidade de resposta institucional", "somente precipitacao", "clima estavel", "uso exclusivo do relevo"], correta: "capacidade de resposta institucional", comentario: "Risco e desastre dependem tanto do evento quanto das condições sociais e da gestao publica.", habilidade: "sintetizar-riscos-e-desastres-em-perspectiva-geografica" }),
  criarQuestao({ id: "ma_179", subtopico: "Políticas ambientais e acordos internacionais", dificuldadeLabel: "dificil", dificuldadeNivel: 9, cognicao: "avaliacao", tempoEstimado: 60, enunciado: "Políticas ambientais efetivas dependem de lei, fiscalizacao, participacao social e:", opcoes: ["capacidade de implementacao", "somente discursos internacionais", "ausencia de economia", "uniformidade regional"], correta: "capacidade de implementacao", comentario: "Normas ambientais so produzem efeito quando se convertem em ação concreta no território.", habilidade: "avaliar-politicas-ambientais-e-acordos" }),
  criarQuestao({ id: "ma_180", subtopico: "Políticas ambientais e acordos internacionais", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "A governanca ambiental global deve ser compreendida como articulacao entre Estados, sociedade, ciência e:", opcoes: ["interesses em disputa", "somente clima", "tipos de vegetação", "ausencia de poder"], correta: "interesses em disputa", comentario: "Os acordos ambientais são negociados em meio a diferencas de responsabilidade e capacidade entre os países.", habilidade: "sintetizar-governanca-ambiental-global" }),
  criarQuestao({ id: "ma_200", subtopico: "Leitura geográfica do meio ambiente", dificuldadeLabel: "dificil", dificuldadeNivel: 10, cognicao: "sintese", tempoEstimado: 60, enunciado: "A sintese geográfica do meio ambiente precisa unir natureza, sociedade, uso do território, riscos e:", opcoes: ["desigualdade social", "somente clima", "estrutura etária", "tipos de rocha"], correta: "desigualdade social", comentario: "Os problemas ambientais sempre se expressam territorialmente e atingem grupos sociais de forma desigual.", habilidade: "sintetizar-a-leitura-geografica-do-meio-ambiente" })
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
      "Água e recursos hidricos",
      "Solo, relevo e degradacao",
      "Poluicao e residuos",
      "Desmatamento, queimadas e uso da terra",
      "Riscos ambientais e desastres",
      "Políticas ambientais e acordos internacionais",
      "Leitura geográfica do meio ambiente"
    ],
    habilidadesBase: [
      "identificar conceitos ambientais e de sustentabilidade",
      "analisar clima, água, solo, biodiversidade e uso da terra",
      "relacionar poluicao, residuos e degradacao a processos sociais e produtivos",
      "avaliar riscos, desastres e políticas ambientais",
      "sintetizar uma leitura geográfica integrada do meio ambiente"
    ]
  },
  questoes: [...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8, ...bloco9, ...bloco10, ...complementos].sort((a, b) => a.id.localeCompare(b.id))
};

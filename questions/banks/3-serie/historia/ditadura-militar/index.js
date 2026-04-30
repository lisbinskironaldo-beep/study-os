import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "Golpe de 1964 e contexto historico",
    habilidade: "identificar-o-contexto-do-golpe-de-1964-e-a-estrutura-do-regime-militar",
    tags: ["ditadura-militar", "golpe-de-1964"],
    fatos: [
      {
        lead: "a derrubada de Joao Goulart em 1964",
        answer: "o golpe civil-militar",
        why: "ele interrompeu a ordem democratica vigente"
      },
      {
        lead: "o clima de polarizacao política no inicio dos anos 1960",
        answer: "um elemento do contexto do golpe",
        why: "setores conservadores e reformistas disputavam projetos de pais"
      },
      {
        lead: "as propostas de mudancas estruturais defendidas por Joao Goulart",
        answer: "as Reformas de Base",
        why: "elas mobilizaram apoios populares e forte oposicao conservadora"
      },
      {
        lead: "a articulacao entre militares, empresarios, parte da imprensa e grupos civis conservadores",
        answer: "a base de sustentacao do golpe",
        why: "o movimento contou com amplo apoio anticomunista"
      },
      {
        lead: "a ideia de combater o inimigo interno em nome da ordem e da seguranca",
        answer: "a doutrina de seguranca nacional",
        why: "ela orientou a legitimacao ideologica do regime"
      }
    ]
  },
  {
    subtopico: "Atos institucionais e autoritarismo",
    habilidade: "analisar-autoritarismo-repressao-censura-e-resistencia-politica",
    tags: ["ditadura-militar", "atos-institucionais"],
    fatos: [
      {
        lead: "o mecanismo juridico usado para ampliar poderes excepcionais do regime",
        answer: "os Atos Institucionais",
        why: "eles permitiram alterar regras sem processo democratico regular"
      },
      {
        lead: "o ato que cassou mandatos e suspendeu direitos logo no inicio do regime",
        answer: "o AI-1",
        why: "ele consolidou os primeiros instrumentos de excecao"
      },
      {
        lead: "o ato que extinguiu partidos e implantou o bipartidarismo",
        answer: "o AI-2",
        why: "ele reorganizou o sistema político sob controle do governo"
      },
      {
        lead: "o ato de 1968 que aprofundou a repressao e fechou o regime",
        answer: "o AI-5",
        why: "ele marcou o período mais duro da ditadura"
      },
      {
        lead: "a concentracao de poder no Executivo é a limitacao de liberdades",
        answer: "uma marca do autoritarismo do regime",
        why: "o Estado restringiu direitos políticos e civis"
      }
    ]
  },
  {
    subtopico: "Repressao política e censura",
    habilidade: "analisar-autoritarismo-repressao-censura-e-resistencia-politica",
    tags: ["ditadura-militar", "repressao"],
    fatos: [
      {
        lead: "os orgaos de investigacao e tortura ligados ao regime",
        answer: "o aparato repressivo do Estado",
        why: "instituicoes como DOI-CODI atuaram na perseguicao aos opositores"
      },
      {
        lead: "o controle previo sobre jornais, livros, musicas e espetaculos",
        answer: "a censura",
        why: "ela restringiu a circulação de ideias e criticas ao governo"
      },
      {
        lead: "a prisao, a tortura é o desaparecimento de opositores políticos",
        answer: "praticas de violencia de Estado",
        why: "o regime utilizou meios ilegais para eliminar resistencias"
      },
      {
        lead: "a vigilancia sobre sindicatos, universidades e artistas",
        answer: "uma estrategia de controle social",
        why: "o governo monitorava espacos vistos como focos de oposicao"
      },
      {
        lead: "o silenciamento imposto a imprensa é a produção cultural",
        answer: "um efeito da repressao política",
        why: "a ditadura buscou limitar a livre expressao"
      }
    ]
  },
  {
    subtopico: "Milagre economico e modelo de desenvolvimento",
    habilidade: "relacionar-milagre-economico-crise-e-desigualdades-do-periodo",
    tags: ["ditadura-militar", "milagre-economico"],
    fatos: [
      {
        lead: "o período de forte crescimento economico entre o fim dos anos 1960 e inicio dos 1970",
        answer: "o milagre economico",
        why: "ele foi amplamente usado na propaganda do regime"
      },
      {
        lead: "o investimento estatal em grandes obras de infraestrutura",
        answer: "uma caracteristica do modelo de desenvolvimento da ditadura",
        why: "o governo apostou em projetos de integracao e expansão econômica"
      },
      {
        lead: "a compressao salarial em meio ao crescimento do PIB",
        answer: "o arrocho salarial",
        why: "a política econômica elevou desigualdades sociais"
      },
      {
        lead: "o aumento da dependência de emprestimos externos",
        answer: "um limite do crescimento do período",
        why: "o endividamento pesou na crise posterior"
      },
      {
        lead: "a combinacao entre crescimento economico e concentracao de renda",
        answer: "uma contradicao do milagre economico",
        why: "nem todos os grupos sociais se beneficiaram do mesmo modo"
      }
    ]
  },
  {
    subtopico: "Movimentos de resistência e oposicao",
    habilidade: "analisar-autoritarismo-repressao-censura-e-resistencia-politica",
    tags: ["ditadura-militar", "resistencia"],
    fatos: [
      {
        lead: "o partido de oposicao consentida dentro do sistema bipartidario",
        answer: "o MDB",
        why: "ele atuou como canal institucional de contestacao"
      },
      {
        lead: "as mobilizacoes de estudantes contra o regime",
        answer: "o movimento estudantil",
        why: "ele teve papel importante na denuncia do autoritarismo"
      },
      {
        lead: "as greves operarias do fim dos anos 1970 no ABC paulista",
        answer: "um marco da reorganizacao sindical",
        why: "elas expressaram nova fase de oposicao ao regime"
      },
      {
        lead: "a atuacao de setores da Igreja em defesa de perseguidos políticos",
        answer: "uma frente de resistência ao autoritarismo",
        why: "grupos religiosos denunciaram violencia e injusticas"
      },
      {
        lead: "a soma de ações legais, sociais e culturais contra a ditadura",
        answer: "a pluralidade da oposicao ao regime",
        why: "a resistência não se restringiu a um unico setor"
      }
    ]
  },
  {
    subtopico: "Cultura, juventude e contestacao",
    habilidade: "analisar-autoritarismo-repressao-censura-e-resistencia-politica",
    tags: ["ditadura-militar", "cultura"],
    fatos: [
      {
        lead: "o movimento artistico que misturou critica social e experimentacao estetica",
        answer: "a Tropicalia",
        why: "ele marcou a cultura brasileira sob a ditadura"
      },
      {
        lead: "as composicoes musicais que criticavam o regime, muitas vezes de forma indireta",
        answer: "a cancao de protesto",
        why: "ela usou metaforas para driblar a censura"
      },
      {
        lead: "os festivais de musica televisionados no final dos anos 1960",
        answer: "espacos de expressao e disputa cultural",
        why: "eles revelaram artistas e tensoes políticas do período"
      },
      {
        lead: "a aproximacao entre juventude, comportamento e critica ao conservadorismo",
        answer: "uma forma de contestacao cultural",
        why: "a oposicao ao regime também passou por estilos de vida e arte"
      },
      {
        lead: "a vigilancia do Estado sobre artistas, intelectuais e estudantes",
        answer: "um indiciario do medo oficial da critica cultural",
        why: "o regime tratava producoes simbolicas como possível ameaça política"
      }
    ]
  },
  {
    subtopico: "Luta armada e repressao estatal",
    habilidade: "analisar-autoritarismo-repressao-censura-e-resistencia-politica",
    tags: ["ditadura-militar", "luta-armada"],
    fatos: [
      {
        lead: "as organizacoes que optaram por enfrentar a ditadura com ações armadas",
        answer: "a luta armada contra o regime",
        why: "alguns grupos concluiram que a oposicao pacifica era insuficiente"
      },
      {
        lead: "a organizacao liderada por Carlos Marighella",
        answer: "a ALN",
        why: "ela esteve entre os principais grupos da resistência armada"
      },
      {
        lead: "a experiência guerrilheira no interior da regiao Norte",
        answer: "a Guerrilha do Araguaia",
        why: "ela foi duramente combatida pelas Forcas Armadas"
      },
      {
        lead: "os sequestros de embaixadores por grupos de oposicao",
        answer: "ações para denunciar o regime e trocar presos políticos",
        why: "essas iniciativas buscaram repercussao nacional e internacional"
      },
      {
        lead: "a derrota militar das organizacoes armadas nos anos 1970",
        answer: "um resultado da intensificacao repressiva",
        why: "o Estado ampliou vigilancia, prisao e eliminacao de opositores"
      }
    ]
  },
  {
    subtopico: "Crise do regime na decada de 1970",
    habilidade: "relacionar-milagre-economico-crise-e-desigualdades-do-periodo",
    tags: ["ditadura-militar", "crise-do-regime"],
    fatos: [
      {
        lead: "o impacto da crise do petroleo sobre a economia brasileira",
        answer: "um fator da crise do regime nos anos 1970",
        why: "o modelo de crescimento passou a mostrar limites"
      },
      {
        lead: "o aumento da inflacao e do endividamento externo",
        answer: "sinais do esgotamento economico da ditadura",
        why: "o crescimento anterior não se sustentou indefinidamente"
      },
      {
        lead: "as denuncias de violacoes de direitos humanos no exterior e no pais",
        answer: "um desgaste político do regime",
        why: "a repressao passou a enfrentar maior critica publica"
      },
      {
        lead: "as mobilizacoes sindicais e sociais do final da decada",
        answer: "uma pressao interna por mudancas",
        why: "novos atores coletivos desafiaram a estabilidade autoritaria"
      },
      {
        lead: "a tentativa do governo de controlar a transição sem perder a iniciativa",
        answer: "a estrategia de distensao",
        why: "o regime procurou conduzir a propria abertura"
      }
    ]
  },
  {
    subtopico: "Abertura política, anistia e transição",
    habilidade: "avaliar-a-abertura-politica-a-anistia-e-a-transicao-democratica",
    tags: ["ditadura-militar", "abertura-politica"],
    fatos: [
      {
        lead: "a formula usada pelo governo para definir a passagem controlada para menos autoritarismo",
        answer: "a abertura lenta, gradual e segura",
        why: "o regime buscou conduzir a mudanca sem ruptura imediata"
      },
      {
        lead: "a lei aprovada em 1979 que permitiu retorno de exilados e libertacao de presos",
        answer: "a Lei da Anistia",
        why: "ela marcou etapa importante da transição política"
      },
      {
        lead: "a campanha popular por eleicoes diretas para presidente",
        answer: "as Diretas Ja",
        why: "ela reuniu ampla mobilizacao social no inicio dos anos 1980"
      },
      {
        lead: "a eleicao indireta de Tancredo Neves em 1985",
        answer: "um marco do fim do ciclo ditatorial",
        why: "ela simbolizou a passagem para a Nova República"
      },
      {
        lead: "a reconstrucao institucional do pais após o regime militar",
        answer: "a transição democratica",
        why: "o Brasil retomou gradualmente mecanismos de representacao e direitos"
      }
    ]
  },
  {
    subtopico: "Memoria, verdade e legados da ditadura",
    habilidade: "sintetizar-os-legados-historicos-da-ditadura-militar-para-o-brasil-contemporaneo",
    tags: ["ditadura-militar", "memoria-e-verdade"],
    fatos: [
      {
        lead: "a apuracao publica das violacoes praticadas pelo Estado no período autoritario",
        answer: "a política de memoria e verdade",
        why: "ela busca reconhecer crimes e preservar a história do período"
      },
      {
        lead: "o orgao criado para investigar graves violacoes de direitos humanos no período",
        answer: "a Comissao Nacional da Verdade",
        why: "ela reuniu depoimentos e documentos sobre a ditadura"
      },
      {
        lead: "a permanencia de praticas autoritarias e da violencia institucional no presente",
        answer: "um legado problematico da ditadura",
        why: "nem todas as estruturas de excecao foram plenamente superadas"
      },
      {
        lead: "a valorizacao dos direitos humanos após o regime",
        answer: "uma resposta democratica ao autoritarismo",
        why: "a memoria do período fortaleceu a defesa de garantias civis"
      },
      {
        lead: "o debate atual sobre anistia, responsabilizacao e memoria publica",
        answer: "uma disputa sobre o sentido historico da ditadura",
        why: "o passado continua influenciando a política brasileira"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "dm",
  serie: [3],
  materia: "História",
  topico: "Ditadura Militar",
  blocos
});

export const ditaduraMilitar = {
  id: "historia_ditadura_militar",
  materia: "História",
  serie: [3],
  topico: "Ditadura Militar",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "História",
    frente: "Regime autoritario e resistência no Brasil",
    searchAliases: [
      "ditadura militar",
      "1964",
      "ai-5",
      "milagre economico",
      "abertura política"
    ],
    subtopicosBase: [
      "Golpe de 1964 e contexto historico",
      "Atos institucionais e autoritarismo",
      "Repressao política e censura",
      "Milagre economico e modelo de desenvolvimento",
      "Movimentos de resistência e oposicao",
      "Cultura, juventude e contestacao",
      "Luta armada e repressao estatal",
      "Crise do regime na decada de 1970",
      "Abertura política, anistia e transição",
      "Memoria, verdade e legados da ditadura"
    ],
    habilidadesBase: [
      "identificar o contexto do golpe de 1964 é a estrutura do regime militar",
      "analisar autoritarismo, repressao, censura e resistência política",
      "relacionar milagre economico, crise e desigualdades do período",
      "avaliar a abertura política, a anistia é a transição democratica",
      "sintetizar os legados historicos da ditadura militar para o Brasil contemporaneo"
    ],
    planejamentoQuestoes: {
      totalAlvo: 200,
      revisaoPorLote: 20,
      formato: "multipla_escolha",
      alternativasPorQuestao: 4,
      comentarioBreve: true,
      distribuicaoDificuldade: {
        facil: 30,
        medio: 90,
        dificil: 80
      },
      distribuicaoNiveis: {
        1: 20,
        2: 10,
        3: 10,
        4: 20,
        5: 20,
        6: 40,
        7: 20,
        8: 20,
        9: 20,
        10: 20
      }
    }
  },
  questoes
};

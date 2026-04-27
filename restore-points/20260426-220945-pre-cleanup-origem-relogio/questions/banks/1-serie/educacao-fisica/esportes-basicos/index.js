import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHYSICAL_EDUCATION_HUNDRED_MATRIX,
  PHYSICAL_EDUCATION_HUNDRED_PLAN,
  PHYSICAL_EDUCATION_STEM_BUILDERS
} from "../../../_shared/physicalEducationTopicPresets.js";

const blocos = [
  {
    subtopico: "Fundamentos dos esportes",
    habilidade:
      "identificar fundamentos dos esportes basicos",
    tags: ["esportes basicos", "fundamentos", "iniciacao esportiva"],
    fatos: [
      {
        lead: "os fundamentos esportivos",
        answer: "as habilidades elementares que sustentam a pratica de uma modalidade",
        why: "sem esses fundamentos, a execucao tecnica fica limitada"
      },
      {
        lead: "a iniciacao esportiva",
        answer: "o processo de aprendizagem inicial de regras, gestos e participacao",
        why: "ela apresenta a modalidade de forma progressiva"
      },
      {
        lead: "a pratica esportiva escolar",
        answer: "uma experiencia educativa que prioriza aprendizagem e participacao",
        why: "na escola, o esporte nao se reduz ao rendimento competitivo"
      },
      {
        lead: "a habilidade motora basica",
        answer: "uma capacidade de movimento que apoia diferentes esportes",
        why: "correr, saltar e arremessar servem de base para varias modalidades"
      },
      {
        lead: "o gesto tecnico",
        answer: "a forma especifica de executar um movimento esportivo",
        why: "ele busca eficiencia, controle e adequacao a regra"
      }
    ]
  },
  {
    subtopico: "Atletismo",
    habilidade:
      "compreender regras e tecnicas fundamentais",
    tags: ["atletismo", "corrida", "saltos"],
    fatos: [
      {
        lead: "o atletismo",
        answer: "um conjunto de modalidades baseadas em correr, saltar e lancar",
        why: "essas acoes estao entre os movimentos mais fundamentais do esporte"
      },
      {
        lead: "as provas de corrida",
        answer: "modalidades de deslocamento em diferentes distancias e ritmos",
        why: "elas desenvolvem velocidade, resistencia e estrategia"
      },
      {
        lead: "os saltos atleticos",
        answer: "provas em que o objetivo e projetar o corpo para superar distancia ou altura",
        why: "nessas provas, tecnica e impulsao sao determinantes"
      },
      {
        lead: "os lancamentos",
        answer: "modalidades em que um implemento deve ser arremessado com tecnica apropriada",
        why: "forca, coordenacao e angulo de saida influenciam o resultado"
      },
      {
        lead: "a passada de corrida",
        answer: "a organizacao do apoio e da impulsao durante o deslocamento",
        why: "uma passada eficiente melhora ritmo e economia do movimento"
      }
    ]
  },
  {
    subtopico: "Esportes de rede e parede",
    habilidade:
      "diferenciar esportes coletivos, individuais e de confronto",
    tags: ["rede", "parede", "raquete"],
    fatos: [
      {
        lead: "os esportes de rede",
        answer: "modalidades em que os jogadores se enfrentam separados por uma rede",
        why: "a troca de bola acontece por cima ou ao redor desse obstaculo"
      },
      {
        lead: "os esportes de parede",
        answer: "modalidades em que a parede participa da devolucao da bola",
        why: "o rebote controlado e parte essencial da dinamica do jogo"
      },
      {
        lead: "o saque",
        answer: "a acao que coloca a bola em disputa no inicio do ponto",
        why: "ele marca o reinicio formal da jogada"
      },
      {
        lead: "a recepcao",
        answer: "o controle inicial da bola enviada pelo adversario",
        why: "uma boa recepcao organiza a sequencia da jogada"
      },
      {
        lead: "a trajetoria da bola",
        answer: "o caminho percorrido pelo objeto durante a disputa",
        why: "compreender a trajetoria melhora antecipacao e resposta motora"
      }
    ]
  },
  {
    subtopico: "Esportes de invasao",
    habilidade:
      "diferenciar esportes coletivos, individuais e de confronto",
    tags: ["invasao", "territorio", "ataque e defesa"],
    fatos: [
      {
        lead: "os esportes de invasao",
        answer: "modalidades em que equipes tentam ocupar o campo adversario para pontuar",
        why: "ataque e defesa se organizam a partir do controle do espaco"
      },
      {
        lead: "a posse de bola",
        answer: "o dominio do objeto de jogo por uma equipe ou jogador",
        why: "ela permite construir ofensivas e controlar o ritmo"
      },
      {
        lead: "a marcacao",
        answer: "a acao defensiva de acompanhar adversarios e limitar jogadas",
        why: "ela reduz espacos e dificulta a progressao rival"
      },
      {
        lead: "a transicao",
        answer: "a mudanca rapida entre momento ofensivo e defensivo",
        why: "nos esportes de invasao, essa passagem e constante"
      },
      {
        lead: "a ocupacao racional do espaco",
        answer: "a distribuicao dos jogadores para ampliar opcoes e cobertura",
        why: "posicionamento adequado melhora ataque e defesa"
      }
    ]
  },
  {
    subtopico: "Esportes de marca",
    habilidade:
      "identificar fundamentos dos esportes basicos",
    tags: ["marca", "tempo", "medida"],
    fatos: [
      {
        lead: "os esportes de marca",
        answer: "modalidades em que vence quem obtiver melhor tempo, distancia ou peso",
        why: "o resultado depende de uma medida objetiva de desempenho"
      },
      {
        lead: "o cronometro",
        answer: "um instrumento usado para registrar tempo em modalidades esportivas",
        why: "ele permite comparar desempenhos com precisao"
      },
      {
        lead: "a marca pessoal",
        answer: "o melhor resultado obtido por um praticante em determinada prova",
        why: "ela serve como referencia de evolucao individual"
      },
      {
        lead: "a distancia medida",
        answer: "o registro objetivo do alcance em saltos ou lancamentos",
        why: "essa medida define classificacao nas provas"
      },
      {
        lead: "o desempenho progressivo",
        answer: "a melhora gradual dos resultados com treino e tecnica",
        why: "nos esportes de marca, comparar medidas mostra evolucao"
      }
    ]
  },
  {
    subtopico: "Esportes de precisao",
    habilidade:
      "compreender regras e tecnicas fundamentais",
    tags: ["precisao", "controle", "alvo"],
    fatos: [
      {
        lead: "os esportes de precisao",
        answer: "modalidades em que o objetivo e acertar um alvo ou ponto com controle fino",
        why: "nessas praticas, exatidao vale mais que velocidade pura"
      },
      {
        lead: "o alvo esportivo",
        answer: "o ponto ou area que deve ser atingido na execucao",
        why: "ele orienta a direcao e a intensidade do gesto"
      },
      {
        lead: "o controle motor fino",
        answer: "a capacidade de ajustar movimentos pequenos com exatidao",
        why: "essa habilidade e essencial para modalidades de precisao"
      },
      {
        lead: "a concentracao na execucao",
        answer: "a manutencao do foco durante a realizacao do gesto tecnico",
        why: "atencao e regularidade influenciam o acerto"
      },
      {
        lead: "o ajuste de forca",
        answer: "a regulacao da intensidade aplicada ao movimento",
        why: "nos esportes de precisao, excesso ou falta de forca alteram o resultado"
      }
    ]
  },
  {
    subtopico: "Regras e arbitragem",
    habilidade:
      "compreender regras e tecnicas fundamentais",
    tags: ["regras", "arbitragem", "fair play"],
    fatos: [
      {
        lead: "as regras esportivas",
        answer: "normas que organizam a pratica e definem o que e permitido",
        why: "elas garantem ordem, seguranca e comparacao justa"
      },
      {
        lead: "a arbitragem",
        answer: "a mediacao das regras por um responsavel durante a disputa",
        why: "o arbitro observa lances e aplica o regulamento"
      },
      {
        lead: "a falta esportiva",
        answer: "uma acao que infringe regra prevista na modalidade",
        why: "ela gera interrupcao, advertencia ou outra penalidade"
      },
      {
        lead: "a penalidade",
        answer: "a consequencia aplicada quando ocorre infracao regulamentar",
        why: "penalidades ajudam a manter a justica da disputa"
      },
      {
        lead: "o conhecimento do regulamento",
        answer: "uma condicao importante para participar com autonomia e respeito",
        why: "entender as regras melhora a tomada de decisao no jogo"
      }
    ]
  },
  {
    subtopico: "Aquecimento e seguranca",
    habilidade:
      "aplicar principios de seguranca no esporte",
    tags: ["aquecimento", "seguranca", "prevencao"],
    fatos: [
      {
        lead: "o aquecimento corporal",
        answer: "uma preparacao gradual antes do esforco principal",
        why: "ele aumenta a prontidao do corpo para a atividade"
      },
      {
        lead: "a prevencao de lesoes",
        answer: "o conjunto de cuidados adotados para reduzir riscos na pratica esportiva",
        why: "orientacoes, tecnica e materiais adequados protegem o praticante"
      },
      {
        lead: "o equipamento adequado",
        answer: "o material compatavel com a modalidade e com a seguranca do aluno",
        why: "calcados e implementos corretos diminuem risco de acidentes"
      },
      {
        lead: "a hidratacao",
        answer: "a reposicao de liquidos perdida durante a atividade",
        why: "ela ajuda a manter o funcionamento adequado do organismo"
      },
      {
        lead: "o alongamento orientado",
        answer: "uma pratica que pode integrar a preparacao e o retorno a calma",
        why: "quando bem conduzido, contribui para conforto e consciencia corporal"
      }
    ]
  },
  {
    subtopico: "Tecnica e tatica inicial",
    habilidade:
      "compreender regras e tecnicas fundamentais",
    tags: ["tecnica", "tatica", "estrategia"],
    fatos: [
      {
        lead: "a tecnica esportiva",
        answer: "o modo de executar corretamente um gesto da modalidade",
        why: "ela busca eficiencia, controle e adequacao"
      },
      {
        lead: "a tatica",
        answer: "a escolha de acoes para responder a situacoes do jogo",
        why: "ela relaciona decisao, objetivo e contexto da disputa"
      },
      {
        lead: "a leitura do jogo",
        answer: "a capacidade de perceber espacos, adversarios e oportunidades",
        why: "essa leitura favorece decisoes mais adequadas"
      },
      {
        lead: "a combinacao ofensiva",
        answer: "a articulacao entre jogadores para criar chance de pontuar",
        why: "ela depende de coordenacao e entendimento coletivo"
      },
      {
        lead: "a cobertura defensiva",
        answer: "o apoio dado por um jogador para proteger espaco ou companheiro",
        why: "ela fortalece a organizacao da equipe"
      }
    ]
  },
  {
    subtopico: "Etica esportiva e fair play",
    habilidade:
      "reconhecer a importancia da etica esportiva",
    tags: ["etica esportiva", "fair play", "respeito"],
    fatos: [
      {
        lead: "o fair play",
        answer: "a conduta baseada em respeito, honestidade e lealdade na pratica esportiva",
        why: "ele valoriza a justica do jogo acima da vantagem indevida"
      },
      {
        lead: "o respeito ao adversario",
        answer: "uma atitude etica essencial em qualquer disputa esportiva",
        why: "competir nao significa desvalorizar ou agredir o outro"
      },
      {
        lead: "a cooperacao na equipe",
        answer: "a disposicao para atuar em favor do objetivo comum",
        why: "mesmo em ambiente competitivo, a equipe depende de colaboracao"
      },
      {
        lead: "a rejeicao a trapaca",
        answer: "o compromisso de nao buscar vantagem por meios irregulares",
        why: "a etica esportiva e incompativel com fraude e desrespeito"
      },
      {
        lead: "a responsabilidade do praticante",
        answer: "o dever de agir com autocontrole e respeito as normas",
        why: "o comportamento do atleta tambem educa e influencia o grupo"
      }
    ]
  }
];

export const esportesBasicos = {
  id: "educacao-fisica_esportes_basicos",
  materia: "Educacao Fisica",
  serie: [1],
  topico: "Esportes Basicos",
  metadados: {
    disciplinaId: "educacao-fisica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Educacao Fisica",
    frente: "Iniciacao esportiva e fundamentos",
    searchAliases: [
      "esportes basicos",
      "fundamentos esportivos",
      "iniciacao esportiva",
      "regras do esporte",
      "etica esportiva"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar fundamentos dos esportes basicos",
      "compreender regras e tecnicas fundamentais",
      "aplicar principios de seguranca no esporte",
      "diferenciar esportes coletivos, individuais e de confronto",
      "reconhecer a importancia da etica esportiva"
    ],
    planejamentoQuestoes: PHYSICAL_EDUCATION_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-11"
  },
  questoes: buildPlannedQuestions({
    prefix: "eb",
    serie: 1,
    materia: "Educacao Fisica",
    topico: "Esportes Basicos",
    blocos,
    stemBuilders: PHYSICAL_EDUCATION_STEM_BUILDERS,
    globalMatrix: PHYSICAL_EDUCATION_HUNDRED_MATRIX
  })
};

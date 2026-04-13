import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHYSICAL_EDUCATION_HUNDRED_MATRIX,
  PHYSICAL_EDUCATION_HUNDRED_PLAN,
  PHYSICAL_EDUCATION_STEM_BUILDERS
} from "../../../_shared/physicalEducationTopicPresets.js";

const blocos = [
  {
    subtopico: "Caracteristicas gerais dos esportes coletivos",
    habilidade:
      "identificar caracteristicas e logicas dos esportes coletivos",
    tags: ["esportes coletivos", "equipe", "cooperacao"],
    fatos: [
      {
        lead: "os esportes coletivos",
        answer: "modalidades em que a acao depende da articulacao entre jogadores da equipe",
        why: "nesses esportes, cooperacao e estrategia coletiva sao fundamentais"
      },
      {
        lead: "a equipe esportiva",
        answer: "o grupo de praticantes que atua de forma coordenada em torno de um objetivo comum",
        why: "cada jogador contribui com funcoes e responsabilidades"
      },
      {
        lead: "a oposicao entre equipes",
        answer: "a disputa organizada entre grupos com metas ofensivas e defensivas",
        why: "o jogo se estrutura pela relacao entre colaborar com os seus e enfrentar os outros"
      },
      {
        lead: "a tomada de decisao coletiva",
        answer: "o ajuste das acoes individuais ao plano e ao contexto da equipe",
        why: "nos esportes coletivos, escolher bem depende do conjunto"
      },
      {
        lead: "a dinamica do jogo coletivo",
        answer: "a alternancia constante entre ataque, defesa e reorganizacao",
        why: "o contexto muda rapidamente ao longo da partida"
      }
    ]
  },
  {
    subtopico: "Futebol e futsal",
    habilidade:
      "reconhecer fundamentos tecnicos e taticos de modalidades coletivas",
    tags: ["futebol", "futsal", "passe e finalizacao"],
    fatos: [
      {
        lead: "o futebol",
        answer: "uma modalidade coletiva de invasao jogada prioritariamente com os pes",
        why: "o objetivo principal e marcar gols no alvo adversario"
      },
      {
        lead: "o futsal",
        answer: "uma adaptacao do futebol para quadra com dinamica mais acelerada",
        why: "espaco reduzido e menor numero de jogadores exigem rapidez"
      },
      {
        lead: "o passe",
        answer: "a acao de enviar a bola a um companheiro com controle e intencao",
        why: "ele organiza a circulacao ofensiva da equipe"
      },
      {
        lead: "a finalizacao",
        answer: "a tentativa de concluir a jogada em direcao ao gol",
        why: "ela representa o momento de busca direta pela pontuacao"
      },
      {
        lead: "a marcacao por zona",
        answer: "a defesa baseada na protecao de setores do espaco",
        why: "nessa estrategia, o foco principal e controlar areas e nao apenas individuos"
      }
    ]
  },
  {
    subtopico: "Voleibol",
    habilidade:
      "reconhecer fundamentos tecnicos e taticos de modalidades coletivas",
    tags: ["voleibol", "rede", "toques"],
    fatos: [
      {
        lead: "o voleibol",
        answer: "um esporte coletivo de rede em que a bola nao pode cair na propria quadra",
        why: "as equipes constroem jogadas por toques sucessivos"
      },
      {
        lead: "o saque no voleibol",
        answer: "a acao que inicia o rally colocando a bola em jogo",
        why: "ele pode ser usado tambem como recurso ofensivo"
      },
      {
        lead: "o toque",
        answer: "um fundamento usado para levantar ou direcionar a bola com controle",
        why: "ele organiza a continuidade da jogada"
      },
      {
        lead: "a manchete",
        answer: "um fundamento de recepcao e defesa realizado com os antebracos",
        why: "ela ajuda a controlar bolas baixas e saques"
      },
      {
        lead: "o bloqueio",
        answer: "a acao defensiva proxima a rede para conter o ataque adversario",
        why: "ele reduz angulos e dificulta a conclusao rival"
      }
    ]
  },
  {
    subtopico: "Basquetebol",
    habilidade:
      "reconhecer fundamentos tecnicos e taticos de modalidades coletivas",
    tags: ["basquetebol", "drible", "arremesso"],
    fatos: [
      {
        lead: "o basquetebol",
        answer: "um esporte coletivo de invasao em que a equipe pontua ao converter arremessos na cesta",
        why: "a dinamica envolve deslocamento, drible e ocupacao do espaco"
      },
      {
        lead: "o drible",
        answer: "a acao de quicar a bola para se deslocar com ela legalmente",
        why: "sem drible, o jogador com a bola precisa passar ou arremessar"
      },
      {
        lead: "o arremesso",
        answer: "a tentativa de pontuar lancando a bola em direcao a cesta",
        why: "precisao e escolha do momento influenciam o sucesso"
      },
      {
        lead: "o rebote",
        answer: "a recuperacao da bola apos um arremesso nao convertido",
        why: "ele pode manter o ataque ou iniciar a defesa"
      },
      {
        lead: "a marcacao individual",
        answer: "a estrategia defensiva em que cada jogador acompanha um adversario direto",
        why: "ela busca limitar a acao de um oponente especifico"
      }
    ]
  },
  {
    subtopico: "Handebol",
    habilidade:
      "reconhecer fundamentos tecnicos e taticos de modalidades coletivas",
    tags: ["handebol", "arremesso", "deslocamento"],
    fatos: [
      {
        lead: "o handebol",
        answer: "um esporte coletivo de invasao em que a bola e conduzida principalmente com as maos",
        why: "as equipes buscam arremessar ao gol adversario"
      },
      {
        lead: "o passe no handebol",
        answer: "a troca de bola entre companheiros para construir a jogada",
        why: "ele acelera a circulacao ofensiva e cria espacos"
      },
      {
        lead: "o arremesso em suspensao",
        answer: "uma finalizacao realizada apos impulsao e salto",
        why: "esse gesto amplia angulos de ataque ao gol"
      },
      {
        lead: "a finta",
        answer: "um movimento de engano usado para superar a marcacao",
        why: "ela combina mudanca de direcao e leitura do adversario"
      },
      {
        lead: "o sistema defensivo compacto",
        answer: "a organizacao de defensores em proximidade para proteger a zona central",
        why: "essa estrategia reduz espacos de infiltracao"
      }
    ]
  },
  {
    subtopico: "Posicionamento e ocupacao do espaco",
    habilidade:
      "analisar posicionamento, ocupacao do espaco e leitura do jogo",
    tags: ["posicionamento", "espaco", "organizacao coletiva"],
    fatos: [
      {
        lead: "o posicionamento tatico",
        answer: "a localizacao funcional do jogador conforme a logica do jogo",
        why: "estar bem posicionado melhora opcoes ofensivas e cobertura defensiva"
      },
      {
        lead: "a ocupacao do espaco",
        answer: "a distribuicao intencional dos jogadores pelo campo ou quadra",
        why: "ela evita concentracao excessiva e amplia alternativas"
      },
      {
        lead: "a amplitude ofensiva",
        answer: "o uso da largura do espaco para abrir a defesa adversaria",
        why: "quando a equipe se espalha, surgem novos corredores de ataque"
      },
      {
        lead: "a cobertura defensiva",
        answer: "o apoio dado a um companheiro para proteger a retaguarda do lance",
        why: "ela corrige riscos e sustenta a organizacao do time"
      },
      {
        lead: "a linha de passe",
        answer: "a possibilidade concreta de envio da bola entre jogadores",
        why: "perceber linhas livres facilita continuidade das jogadas"
      }
    ]
  },
  {
    subtopico: "Sistemas taticos simples",
    habilidade:
      "analisar posicionamento, ocupacao do espaco e leitura do jogo",
    tags: ["sistema tatico", "estrategia", "organizacao"],
    fatos: [
      {
        lead: "um sistema tatico",
        answer: "a forma organizada de distribuir jogadores conforme objetivos do jogo",
        why: "ele orienta funcoes e relacoes entre setores da equipe"
      },
      {
        lead: "a funcao tatico-ofensiva",
        answer: "o papel assumido para criar, sustentar ou concluir jogadas",
        why: "diferentes jogadores podem ter atribuicoes complementares"
      },
      {
        lead: "a funcao tatico-defensiva",
        answer: "o conjunto de responsabilidades para impedir avancos e pontuacoes rivais",
        why: "a defesa organizada depende de papeis claros"
      },
      {
        lead: "a adaptacao tatico-contextual",
        answer: "a mudanca de estrategia conforme placar, tempo ou comportamento do adversario",
        why: "o sistema nao e fixo, mas responde ao andamento da partida"
      },
      {
        lead: "a transicao organizada",
        answer: "a passagem coordenada entre ataque e defesa dentro do sistema",
        why: "ela evita desordem nos momentos de troca de posse"
      }
    ]
  },
  {
    subtopico: "Comunicacao e cooperacao",
    habilidade:
      "valorizar comunicacao, cooperacao e etica em equipe",
    tags: ["comunicacao", "cooperacao", "equipe"],
    fatos: [
      {
        lead: "a comunicacao em equipe",
        answer: "a troca de sinais, orientacoes e informacoes durante a partida",
        why: "ela melhora coordenacao e tomada de decisao"
      },
      {
        lead: "a cooperacao esportiva",
        answer: "a disposicao para atuar de modo articulado em favor do grupo",
        why: "sem cooperacao, a equipe perde eficiencia coletiva"
      },
      {
        lead: "a confianca entre companheiros",
        answer: "a seguranca de que cada integrante cumprira seu papel no jogo",
        why: "essa confianca sustenta a execucao de combinacoes e coberturas"
      },
      {
        lead: "a lideranca positiva",
        answer: "a orientacao do grupo por meio de incentivo, exemplo e responsabilidade",
        why: "ela fortalece o ambiente coletivo sem impor desrespeito"
      },
      {
        lead: "o apoio mutuo",
        answer: "a atitude de ajudar companheiros diante de dificuldades e desafios do jogo",
        why: "equipes mais solidarias tendem a responder melhor as adversidades"
      }
    ]
  },
  {
    subtopico: "Regras e arbitragem",
    habilidade:
      "compreender regras, arbitragem e seguranca nas praticas coletivas",
    tags: ["regras", "arbitragem", "seguranca"],
    fatos: [
      {
        lead: "o regulamento da modalidade",
        answer: "o conjunto de normas que define limites, faltas e formas de pontuacao",
        why: "ele estrutura a disputa e garante comparacao justa"
      },
      {
        lead: "a arbitragem coletiva",
        answer: "a aplicacao das regras por um responsavel durante o jogo",
        why: "arbitros e auxiliares ajudam a manter ordem e legalidade"
      },
      {
        lead: "a falta tecnica",
        answer: "uma infracao relacionada a conduta ou procedimento inadequado",
        why: "ela nao depende apenas de contato fisico, mas tambem de comportamento"
      },
      {
        lead: "a reposicao de bola",
        answer: "o reinicio formal da jogada apos interrupcao prevista pela regra",
        why: "cada modalidade define como isso ocorre"
      },
      {
        lead: "a seguranca na partida",
        answer: "o cuidado com espaco, material e comportamento para evitar acidentes",
        why: "jogar com seguranca e parte da responsabilidade coletiva"
      }
    ]
  },
  {
    subtopico: "Treinamento e preparacao",
    habilidade:
      "compreender regras, arbitragem e seguranca nas praticas coletivas",
    tags: ["treinamento", "preparacao", "condicionamento"],
    fatos: [
      {
        lead: "o treinamento esportivo escolar",
        answer: "a organizacao de atividades para desenvolver tecnica, tatica e condicao fisica",
        why: "na escola, ele deve respeitar objetivos educativos e progressao adequada"
      },
      {
        lead: "a preparacao fisica geral",
        answer: "o desenvolvimento de capacidades corporais necessarias para jogar melhor",
        why: "resistencia, forca e mobilidade apoiam o desempenho"
      },
      {
        lead: "o treino tecnico",
        answer: "a repeticao orientada de fundamentos especificos da modalidade",
        why: "ele aperfeicoa execucao e controle do gesto"
      },
      {
        lead: "o treino tatico",
        answer: "a pratica de situacoes que envolvem estrategia e leitura do jogo",
        why: "ele ajuda a equipe a responder melhor ao contexto da partida"
      },
      {
        lead: "a recuperacao apos o treino",
        answer: "o conjunto de cuidados que favorece descanso e reorganizacao corporal",
        why: "hidratar-se, alongar-se e descansar ajudam a continuidade da pratica"
      }
    ]
  }
];

export const esportesColetivos = {
  id: "educacao-fisica_esportes_coletivos",
  materia: "Educacao Fisica",
  serie: [2],
  topico: "Esportes Coletivos",
  metadados: {
    disciplinaId: "educacao-fisica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Educacao Fisica",
    frente: "Logicas coletivas, modalidades e taticas",
    searchAliases: [
      "esportes coletivos",
      "futebol e futsal",
      "voleibol",
      "basquetebol",
      "handebol"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar caracteristicas e logicas dos esportes coletivos",
      "reconhecer fundamentos tecnicos e taticos de modalidades coletivas",
      "analisar posicionamento, ocupacao do espaco e leitura do jogo",
      "valorizar comunicacao, cooperacao e etica em equipe",
      "compreender regras, arbitragem e seguranca nas praticas coletivas"
    ],
    planejamentoQuestoes: PHYSICAL_EDUCATION_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-11"
  },
  questoes: buildPlannedQuestions({
    prefix: "ec",
    serie: 2,
    materia: "Educacao Fisica",
    topico: "Esportes Coletivos",
    blocos,
    stemBuilders: PHYSICAL_EDUCATION_STEM_BUILDERS,
    globalMatrix: PHYSICAL_EDUCATION_HUNDRED_MATRIX
  })
};

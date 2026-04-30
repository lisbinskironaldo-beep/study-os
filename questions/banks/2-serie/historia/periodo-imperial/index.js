import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "Primeiro Reinado e crise política",
    habilidade: "identificar-fases-politicas-do-imperio-brasileiro",
    tags: ["periodo-imperial", "primeiro-reinado"],
    fatos: [
      {
        lead: "o governo de D. Pedro I entre a independencia e sua abdicacao",
        answer: "o Primeiro Reinado",
        why: "esse período inaugurou a monarquia brasileira independente"
      },
      {
        lead: "a concentracao de poderes nas maos do imperador",
        answer: "um traco de autoritarismo do Primeiro Reinado",
        why: "o governo entrou em conflito com grupos liberais e provinciais"
      },
      {
        lead: "a crise provocada por dificuldades econômicas e oposicao política",
        answer: "um fator de desgaste de D. Pedro I",
        why: "a popularidade imperial caiu ao longo do período"
      },
      {
        lead: "a guerra envolvendo a Provincia Cisplatina",
        answer: "um episodio que enfraqueceu o governo imperial",
        why: "o conflito agravou gastos e insatisfacoes"
      },
      {
        lead: "a renuncia de D. Pedro I em 1831",
        answer: "a abdicacao",
        why: "ela encerrou o Primeiro Reinado e abriu o período regencial"
      }
    ]
  },
  {
    subtopico: "Período Regencial e experiencias políticas",
    habilidade: "identificar-fases-politicas-do-imperio-brasileiro",
    tags: ["periodo-imperial", "periodo-regencial"],
    fatos: [
      {
        lead: "a fase em que o Brasil foi governado por regentes em nome do herdeiro menor de idade",
        answer: "o Período Regencial",
        why: "ela ocorreu entre a abdicacao de D. Pedro I é o Golpe da Maioridade"
      },
      {
        lead: "a alternancia entre regência trina e regência una",
        answer: "uma tentativa de organizar o poder imperial sem imperador adulto",
        why: "o pais buscava estabilidade institucional"
      },
      {
        lead: "a criacao da Guarda Nacional em 1831",
        answer: "um instrumento de controle das elites locais",
        why: "ela ajudou a sustentar a ordem interna"
      },
      {
        lead: "o Ato Adicional de 1834",
        answer: "uma medida de descentralizacao administrativa",
        why: "ele ampliou a autonomia provincial"
      },
      {
        lead: "a antecipacao da maioridade de D. Pedro II em 1840",
        answer: "o Golpe da Maioridade",
        why: "a medida procurou conter instabilidades políticas"
      }
    ]
  },
  {
    subtopico: "Revoltas regenciais",
    habilidade: "analisar-as-revoltas-e-tensoes-do-periodo-regencial",
    tags: ["periodo-imperial", "revoltas-regenciais"],
    fatos: [
      {
        lead: "o conjunto de levantes ocorridos em varias provincias durante as regencias",
        answer: "as revoltas regenciais",
        why: "elas expressaram tensoes sociais, políticas e regionais"
      },
      {
        lead: "a rebeliao popular ocorrida na provincia do Grao-Para",
        answer: "a Cabanagem",
        why: "ela reuniu forte participacao popular e violencia social"
      },
      {
        lead: "o movimento separatista e republicano no Rio Grande do Sul",
        answer: "a Farroupilha",
        why: "foi uma das revoltas mais longas do período"
      },
      {
        lead: "a revolta de escravizados muculmanos em Salvador",
        answer: "a Revolta dos Male",
        why: "ela revelou a presenca de articulacao negra urbana"
      },
      {
        lead: "as revoltas ocorridas em meio a disputas entre centralizacao e autonomia provincial",
        answer: "um sinal da fragilidade do Estado imperial",
        why: "o poder central ainda buscava consolidar sua autoridade"
      }
    ]
  },
  {
    subtopico: "Segundo Reinado e parlamentarismo",
    habilidade: "identificar-fases-politicas-do-imperio-brasileiro",
    tags: ["periodo-imperial", "segundo-reinado"],
    fatos: [
      {
        lead: "o longo governo de D. Pedro II",
        answer: "o Segundo Reinado",
        why: "foi a fase de maior estabilidade política do Império"
      },
      {
        lead: "o sistema em que o imperador nomeava o presidente do Conselho de Ministros",
        answer: "o parlamentarismo as avessas",
        why: "o funcionamento brasileiro não seguia plenamente o modelo inglês"
      },
      {
        lead: "a alternancia entre liberais e conservadores no poder",
        answer: "uma pratica política do Segundo Reinado",
        why: "o sistema buscava acomodar elites e evitar rupturas"
      },
      {
        lead: "a maior estabilidade institucional após as regencias",
        answer: "uma marca do governo de D. Pedro II",
        why: "o centro político imperial conseguiu consolidar sua autoridade"
      },
      {
        lead: "a manutencao do voto censitario durante o Segundo Reinado",
        answer: "um limite da participacao política imperial",
        why: "a cidadania permaneceu restrita a poucos grupos"
      }
    ]
  },
  {
    subtopico: "Cafe e economia imperial",
    habilidade: "relacionar-economia-cafeeira-escravidao-e-transformacoes-sociais-do-segundo-reinado",
    tags: ["periodo-imperial", "cafe"],
    fatos: [
      {
        lead: "o produto que liderou a economia brasileira no seculo XIX",
        answer: "o cafe",
        why: "ele se tornou a principal base exportadora do Império"
      },
      {
        lead: "a regiao que concentrou a expansão cafeeira na segunda metade do seculo XIX",
        answer: "o Sudeste brasileiro",
        why: "areas do Vale do Paraiba e depois do Oeste paulista ganharam destaque"
      },
      {
        lead: "a ligacao entre cafe e infraestrutura de transportes",
        answer: "o incentivo a ferrovias e modernizacao seletiva",
        why: "a economia exportadora exigia escoamento mais eficiente"
      },
      {
        lead: "o uso intensivo de trabalho escravizado na lavoura cafeeira",
        answer: "uma base da riqueza imperial",
        why: "o cafe se expandiu inicialmente apoiado na escravidao"
      },
      {
        lead: "o fortalecimento político de grandes fazendeiros do cafe",
        answer: "a ascensao da elite cafeeira",
        why: "esse grupo passou a influenciar fortemente o Estado imperial"
      }
    ]
  },
  {
    subtopico: "Escravidao e movimento abolicionista",
    habilidade: "relacionar-economia-cafeeira-escravidao-e-transformacoes-sociais-do-segundo-reinado",
    tags: ["periodo-imperial", "abolicionismo"],
    fatos: [
      {
        lead: "o sistema de trabalho compulsorio mantido ate 1888",
        answer: "a escravidao",
        why: "ela foi central na economia e na hierarquia social do Império"
      },
      {
        lead: "a lei de 1850 que proibiu oficialmente o trafico transatlantico",
        answer: "a Lei Eusebio de Queiros",
        why: "ela atingiu o comercio negreiro para o Brasil"
      },
      {
        lead: "a lei que declarava livres os filhos de mulheres escravizadas",
        answer: "a Lei do Ventre Livre",
        why: "ela foi uma etapa gradual da legislacao abolicionista"
      },
      {
        lead: "a lei que libertava escravizados idosos com restricoes",
        answer: "a Lei dos Sexagenarios",
        why: "ela integrou a política gradualista do fim da escravidao"
      },
      {
        lead: "a assinatura da lei que extinguiu formalmente a escravidao no Brasil",
        answer: "a Lei Aurea",
        why: "o ato de 1888 encerrou juridicamente o regime escravista"
      }
    ]
  },
  {
    subtopico: "Imigracao e transformações sociais",
    habilidade: "relacionar-economia-cafeeira-escravidao-e-transformacoes-sociais-do-segundo-reinado",
    tags: ["periodo-imperial", "imigracao"],
    fatos: [
      {
        lead: "a entrada crescente de trabalhadores europeus no Brasil do seculo XIX",
        answer: "a imigracao",
        why: "ela foi estimulada especialmente nas areas cafeeiras"
      },
      {
        lead: "a substituicao gradual da mao de obra escravizada por trabalho livre em parte da economia",
        answer: "uma transformação do final do Império",
        why: "esse processo se relacionou a pressao abolicionista é a novos interesses economicos"
      },
      {
        lead: "o sistema em que imigrantes trabalhavam em fazendas de cafe com pagamento e contratos",
        answer: "o colonato",
        why: "ele tornou-se comum em areas paulistas"
      },
      {
        lead: "a formação de novas camadas urbanas e de trabalhadores livres",
        answer: "um efeito social da imigracao e da economia cafeeira",
        why: "o pais passou por mudancas demograficas e ocupacionais"
      },
      {
        lead: "a política de atrair europeus associada a ideias racistas de embranquecimento",
        answer: "um aspecto ideologico da imigracao no período",
        why: "elites relacionavam trabalho livre a projetos raciais excludentes"
      }
    ]
  },
  {
    subtopico: "Guerra do Paraguai",
    habilidade: "avaliar-a-guerra-do-paraguai-o-abolicionismo-e-a-crise-do-imperio",
    tags: ["periodo-imperial", "guerra-do-paraguai"],
    fatos: [
      {
        lead: "o conflito que envolveu Brasil, Argentina, Uruguai e Paraguai entre 1864 e 1870",
        answer: "a Guerra do Paraguai",
        why: "foi a maior guerra internacional da história sul-americana"
      },
      {
        lead: "a alianca formada por Brasil, Argentina e Uruguai",
        answer: "a Triplice Alianca",
        why: "ela combateu o governo paraguaio durante o conflito"
      },
      {
        lead: "o fortalecimento do Exercito brasileiro após a guerra",
        answer: "uma consequência política importante do conflito",
        why: "os militares ganharam prestigio e maior protagonismo"
      },
      {
        lead: "os altos custos humanos e materiais da guerra",
        answer: "um fator de desgaste do Império",
        why: "o conflito produziu endividamento e tensoes internas"
      },
      {
        lead: "a participacao de escravizados em troca de promessas de liberdade",
        answer: "um aspecto social relevante da guerra",
        why: "o conflito se conectou ao debate sobre escravidao"
      }
    ]
  },
  {
    subtopico: "Crise do Império",
    habilidade: "avaliar-a-guerra-do-paraguai-o-abolicionismo-e-a-crise-do-imperio",
    tags: ["periodo-imperial", "crise-do-imperio"],
    fatos: [
      {
        lead: "o afastamento entre Igreja e monarquia durante a chamada Questao Religiosa",
        answer: "um elemento da crise imperial",
        why: "o conflito abalou a relação entre Estado e clero"
      },
      {
        lead: "a insatisfacao dos militares com o governo monarquico",
        answer: "a Questao Militar",
        why: "ela ampliou o desgaste do regime junto ao Exercito"
      },
      {
        lead: "o impacto do abolicionismo sobre os proprietarios escravistas",
        answer: "a perda de apoio de parte das elites agrarias",
        why: "muitos fazendeiros romperam com a monarquia após 1888"
      },
      {
        lead: "a critica ao centralismo imperial e ao sistema político restrito",
        answer: "um fator de deslegitimacao da monarquia",
        why: "republicanos e outros grupos questionavam a ordem imperial"
      },
      {
        lead: "o enfraquecimento progressivo do governo de D. Pedro II no fim do seculo XIX",
        answer: "a crise do Império",
        why: "varias tensoes se acumularam antes da queda do regime"
      }
    ]
  },
  {
    subtopico: "Proclamacao da República",
    habilidade: "sintetizar-os-fatores-da-queda-da-monarquia-no-brasil",
    tags: ["periodo-imperial", "proclamacao-da-republica"],
    fatos: [
      {
        lead: "o movimento político-militar de 15 de novembro de 1889",
        answer: "a Proclamacao da República",
        why: "ele encerrou a monarquia no Brasil"
      },
      {
        lead: "o militar associado a derrubada do governo imperial",
        answer: "Deodoro da Fonseca",
        why: "sua liderança foi central no episodio republicano"
      },
      {
        lead: "a reduzida participacao popular no evento de 1889",
        answer: "uma caracteristica da mudanca de regime",
        why: "a transição ocorreu sobretudo por ação de elites civis e militares"
      },
      {
        lead: "a expulsao da familia imperial do pais após o golpe",
        answer: "um simbolo do fim do regime monarquico",
        why: "o novo governo quis romper rapidamente com a ordem anterior"
      },
      {
        lead: "a soma de crise militar, abolicionismo e desgaste político",
        answer: "o conjunto de fatores da queda da monarquia",
        why: "a República resultou de tensoes acumuladas ao longo do Segundo Reinado"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "pim",
  serie: [2],
  materia: "História",
  topico: "Período Imperial",
  blocos
});

export const periodoImperial = {
  id: "historia_periodo_imperial",
  materia: "História",
  serie: [2],
  topico: "Período Imperial",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "História",
    frente: "Brasil monarquico no seculo XIX",
    searchAliases: [
      "período imperial",
      "império do brasil",
      "período regencial",
      "segundo reinado",
      "abolicionismo"
    ],
    subtopicosBase: [
      "Primeiro Reinado e crise política",
      "Período Regencial e experiencias políticas",
      "Revoltas regenciais",
      "Segundo Reinado e parlamentarismo",
      "Cafe e economia imperial",
      "Escravidao e movimento abolicionista",
      "Imigracao e transformações sociais",
      "Guerra do Paraguai",
      "Crise do Império",
      "Proclamacao da República"
    ],
    habilidadesBase: [
      "identificar fases políticas do Império brasileiro",
      "analisar as revoltas e tensoes do Período Regencial",
      "relacionar economia cafeeira, escravidao e transformações sociais do Segundo Reinado",
      "avaliar a Guerra do Paraguai, o abolicionismo é a crise do Império",
      "sintetizar os fatores da queda da monarquia no Brasil"
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

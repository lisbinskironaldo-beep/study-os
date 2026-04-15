import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const editableKeys = new Set([
  "materia",
  "topico",
  "subtopico",
  "eixo",
  "frente",
  "searchAliases",
  "subtopicosBase",
  "habilidadesBase",
  "enunciado",
  "opcoes",
  "correta",
  "comentario"
]);

const replacements = [
  ["F�sica", "Física"],
  ["f�sica", "física"],
  ["f�sicas", "físicas"],
  ["f�sico", "físico"],
  ["f�sicos", "físicos"],
  ["Cinem�tica", "Cinemática"],
  ["cinem�tica", "cinemática"],
  ["Din�mica", "Dinâmica"],
  ["din�mica", "dinâmica"],
  ["Eletrodin�mica", "Eletrodinâmica"],
  ["eletrodin�mica", "eletrodinâmica"],
  ["Ondulat�ria", "Ondulatória"],
  ["ondulat�ria", "ondulatória"],
  ["ondulat�rios", "ondulatórios"],
  ["�ptica", "Óptica"],
  ["�pticos", "ópticos"],
  ["�ptico", "óptico"],
  ["�m�s", "ímãs"],
  ["eletro�m�", "eletroímã"],
  ["eletromagn�tica", "eletromagnética"],
  ["eletromagn�ticas", "eletromagnéticas"],
  ["eletro�m�s", "eletroímãs"],
  ["magn�tica", "magnética"],
  ["magn�ticas", "magnéticas"],
  ["magn�tico", "magnético"],
  ["magn�ticos", "magnéticos"],
  ["geom�trica", "geométrica"],
  ["geom�trico", "geométrico"],
  ["mec�nica", "mecânica"],
  ["mec�nicas", "mecânicas"],
  ["mec�nico", "mecânico"],
  ["mec�nicos", "mecânicos"],
  ["el�trica", "elétrica"],
  ["el�tricas", "elétricas"],
  ["el�trico", "elétrico"],
  ["el�tricos", "elétricos"],
  ["energ�tica", "energética"],
  ["energ�ticas", "energéticas"],
  ["energ�tico", "energético"],
  ["energ�ticos", "energéticos"],
  ["cient�fica", "científica"],
  ["anal�tico", "analítico"],
  ["anal�tica", "analítica"],
  ["num�rica", "numérica"],
  ["num�ricas", "numéricas"],
  ["num�rico", "numérico"],
  ["num�ricos", "numéricos"],
  ["alg�bricas", "algébricas"],
  ["descri��o", "descrição"],
  ["defini��o", "definição"],
  ["interpreta��o", "interpretação"],
  ["explica��o", "explicação"],
  ["aplica��o", "aplicação"],
  ["observa��o", "observação"],
  ["produ��o", "produção"],
  ["constru��o", "construção"],
  ["constru�do", "construído"],
  ["constru�das", "construídas"],
  ["comunica��o", "comunicação"],
  ["padroniza��o", "padronização"],
  ["sele��o", "seleção"],
  ["corre��o", "correção"],
  ["prote��o", "proteção"],
  ["propaga��o", "propagação"],
  ["propuls�o", "propulsão"],
  ["interfer�ncia", "interferência"],
  ["transfer�ncia", "transferência"],
  ["transfer�ncias", "transferências"],
  ["resson�ncia", "ressonância"],
  ["pot�ncia", "potência"],
  ["pot�ncias", "potências"],
  ["frequ�ncia", "frequência"],
  ["difra��o", "difração"],
  ["refra��o", "refração"],
  ["Refra��o", "Refração"],
  ["reflex�o", "reflexão"],
  ["Reflex�o", "Reflexão"],
  ["dispers�o", "dispersão"],
  ["Dispers�o", "Dispersão"],
  ["vis�o", "visão"],
  ["precis�o", "precisão"],
  ["press�o", "pressão"],
  ["tens�o", "tensão"],
  ["resist�ncia", "resistência"],
  ["convers�o", "conversão"],
  ["Convers�o", "Conversão"],
  ["distin��o", "distinção"],
  ["dist�ncia", "distância"],
  ["dist�ncias", "distâncias"],
  ["varia��o", "variação"],
  ["acelera��o", "aceleração"],
  ["desacelera��o", "desaceleração"],
  ["posi��o", "posição"],
  ["trajet�ria", "trajetória"],
  ["trajet�rias", "trajetórias"],
  ["raz�o", "razão"],
  ["rela��o", "relação"],
  ["rela��es", "relações"],
  ["gr�fico", "gráfico"],
  ["gr�ficos", "gráficos"],
  ["gr�fica", "gráfica"],
  ["gr�ficas", "gráficas"],
  ["m�dulo", "módulo"],
  ["m�dia", "média"],
  ["m�dias", "médias"],
  ["m�dio", "médio"],
  ["m�nima", "mínima"],
  ["m�xima", "máxima"],
  ["m�ltiplas", "múltiplas"],
  ["d�gitos", "dígitos"],
  ["n�mero", "número"],
  ["n�meros", "números"],
  ["n�vel", "nível"],
  ["s�mbolos", "símbolos"],
  ["s�ntese", "síntese"],
  ["s�rie", "série"],
  ["subt�pico", "subtópico"],
  ["subt�picos", "subtópicos"],
  ["fen�meno", "fenômeno"],
  ["fen�menos", "fenômenos"],
  ["in�rcia", "inércia"],
  ["equil�brio", "equilíbrio"],
  ["caracter�stica", "característica"],
  ["caracter�sticas", "características"],
  ["caracter�sticos", "característicos"],
  ["car�ter", "caráter"],
  ["compar�vel", "comparável"],
  ["compar�veis", "comparáveis"],
  ["compat�vel", "compatível"],
  ["compat�veis", "compatíveis"],
  ["plaus�vel", "plausível"],
  ["plaus�veis", "plausíveis"],
  ["dispon�vel", "disponível"],
  ["percept�vel", "perceptível"],
  ["sens�vel", "sensível"],
  ["sens�veis", "sensíveis"],
  ["poss�vel", "possível"],
  ["poss�veis", "possíveis"],
  ["confi�vel", "confiável"],
  ["respons�vel", "responsável"],
  ["desprez�vel", "desprezível"],
  ["inel�stica", "inelástica"],
  ["inel�sticas", "inelásticas"],
  ["el�stica", "elástica"],
  ["el�sticas", "elásticas"],
  ["el�stico", "elástico"],
  ["el�sticos", "elásticos"],
  ["id�nticas", "idênticas"],
  ["espec�fica", "específica"],
  ["espec�fico", "específico"],
  ["espec�ficos", "específicos"],
  ["tecnol�gicas", "tecnológicas"],
  ["tecnol�gicos", "tecnológicos"],
  ["estrat�gias", "estratégias"],
  ["princ�pio", "princípio"],
  ["Princ�pios", "Princípios"],
  ["cont�nuo", "contínuo"],
  ["cont�nuos", "contínuos"],
  ["superf�cie", "superfície"],
  ["superf�cies", "superfícies"],
  ["regi�o", "região"],
  ["regi�es", "regiões"],
  ["espa�o", "espaço"],
  ["liga��o", "ligação"],
  ["conex�o", "conexão"],
  ["conex�es", "conexões"],
  ["oposi��o", "oposição"],
  ["divis�o", "divisão"],
  ["fra��o", "fração"],
  ["colis�o", "colisão"],
  ["colis�es", "colisões"],
  ["explos�es", "explosões"],
  ["retil�nea", "retilínea"],
  ["retil�neo", "retilíneo"],
  ["retr�grada", "retrógrada"],
  ["retr�grado", "retrógrado"],
  ["retr�grados", "retrógrados"],
  ["instant�nea", "instantânea"],
  ["instant�neos", "instantâneos"],
  ["hor�ria", "horária"],
  ["hor�rias", "horárias"],
  ["parab�lico", "parabólico"],
  ["part�cula", "partícula"],
  ["part�culas", "partículas"],
  ["cat�dicos", "catódicos"],
  ["c�ncavo", "côncavo"],
  ["c�ncavos", "côncavos"],
  ["c�ncava", "côncava"],
  ["c�ncavas", "côncavas"],
  ["esf�rica", "esférica"],
  ["esf�ricas", "esféricas"],
  ["esf�rico", "esférico"],
  ["esf�ricos", "esféricos"],
  ["microsc�pios", "microscópios"],
  ["telesc�pios", "telescópios"],
  ["c�meras", "câmeras"],
  ["quil�metros", "quilômetros"],
  ["cent�metros", "centímetros"],
  ["cron�metro", "cronômetro"],
  ["term�metro", "termômetro"],
  ["amper�metro", "amperímetro"],
  ["volt�metro", "voltímetro"],
  ["r�gua", "régua"],
  ["l�mpada", "lâmpada"],
  ["l�mpadas", "lâmpadas"],
  ["balan�a", "balança"],
  ["caminh�o", "caminhão"],
  ["cal�ada", "calçada"],
  ["�nibus", "ônibus"],
  ["p�tio", "pátio"],
  ["m�o", "mão"],
  ["ch�o", "chão"],
  ["�ngulo", "ângulo"],
  ["�ngulos", "ângulos"],
  ["�rea", "área"],
  ["�reas", "áreas"],
  ["�culos", "óculos"],
  ["n�cleo", "núcleo"],
  ["�ndices", "índices"],
  ["�hmico", "ôhmico"],
  ["�hmicos", "ôhmicos"],
  ["d�namos", "dínamos"],
  ["tamb�m", "também"],
  ["n�o", "não"],
  ["s�o", "são"],
  ["ent�o", "então"],
  ["j�", "já"],
  ["ap�s", "após"],
  ["at�", "até"],
  ["h�", "há"],
  ["s�", "só"],
  ["tr�s", "três"],
  ["est�", "está"],
  ["estar�", "estará"],
  ["est�o", "estão"],
  ["t�m", "têm"],
  ["necess�ria", "necessária"],
  ["necess�rio", "necessário"],
  ["import�ncia", "importância"],
  ["presen�a", "presença"],
  ["aus�ncia", "ausência"],
  ["perman�ncia", "permanência"],
  ["equival�ncia", "equivalência"],
  ["depend�ncia", "dependência"],
  ["independ�ncia", "independência"],
  ["coer�ncia", "coerência"],
  ["consequ�ncia", "consequência"],
  ["efici�ncia", "eficiência"],
  ["experi�ncia", "experiência"],
  ["experi�ncias", "experiências"],
  ["tend�ncia", "tendência"],
  ["tend�ncias", "tendências"],
  ["mudan�a", "mudança"],
  ["mudan�as", "mudanças"],
  ["avalia��o", "avaliação"],
  ["afirma��o", "afirmação"],
  ["conclus�o", "conclusão"],
  ["conclus�es", "conclusões"],
  ["compara��o", "comparação"],
  ["situa��o", "situação"],
  ["situa��es", "situações"],
  ["situa�es", "situações"],
  ["expans�o", "expansão"],
  ["manuten��o", "manutenção"],
  ["dura��o", "duração"],
  ["localiza��o", "localização"],
  ["realiza��o", "realização"],
  ["manipula��o", "manipulação"],
  ["inspe��o", "inspeção"],
  ["condi��o", "condição"],
  ["condi��es", "condições"],
  ["restri��o", "restrição"],
  ["aten��o", "atenção"],
  ["introdu��o", "introdução"],
  ["intera��o", "interação"],
  ["conserva��o", "conservação"],
  ["decomposi��o", "decomposição"],
  ["aproxima��o", "aproximação"],
  ["atra��o", "atração"],
  ["atua��o", "atuação"],
  ["transforma��o", "transformação"],
  ["configura��o", "configuração"],
  ["redistribui��o", "redistribuição"],
  ["participa��o", "participação"],
  ["vibra��o", "vibração"],
  ["oscila��o", "oscilação"],
  ["a��o", "ação"],
  ["rea��o", "reação"],
  ["tra��o", "tração"],
  ["dire��o", "direção"],
  ["dire��es", "direções"],
  ["tradu��o", "tradução"],
  ["equa��o", "equação"],
  ["equa��es", "equações"],
  ["op��o", "opção"],
  ["op��es", "opções"],
  ["equ�voco", "equívoco"],
  ["equ�vocos", "equívocos"],
  ["interpreta��es", "interpretações"],
  ["solu��o", "solução"],
  ["solu��es", "soluções"],
  ["vari�vel", "variável"],
  ["vari�veis", "variáveis"],
  ["te�rico", "teórico"],
  ["te�ricos", "teóricos"],
  ["for�a", "força"],
  ["for�as", "forças"],
  ["b�ssola", "bússola"],
  ["b�ssolas", "bússolas"],
  ["lan�ada", "lançada"],
  ["lan�ado", "lançado"],
  ["lan�amento", "lançamento"],
  ["come�ar", "começar"],
  ["come�a", "começa"],
  ["alcan�a", "alcança"],
  ["f�rmula", "fórmula"],
  ["f�rmulas", "fórmulas"],
  ["m�vel", "móvel"],
  ["m�veis", "móveis"],
  ["laborat�rio", "laboratório"],
  ["laborat�rios", "laboratórios"],
  ["m�dicos", "médicos"],
  ["ru�do", "ruído"],
  ["op�e", "opõe"],
  ["sim�tricas", "simétricas"],
  ["representa��es", "representações"],
  ["v�cuo", "vácuo"],
  ["situa��o apresentada � ", "situação apresentada é "],
  ["A situa��o apresentada � ", "A situação apresentada é "],
  ["O caso descrito � ", "O caso descrito é "],
  ["o caso descrito � ", "o caso descrito é "],
  [" qual conclusão � mais adequada?", " qual conclusão é mais adequada?"],
  [" Qual avaliação � mais consistente?", " Qual avaliação é mais consistente?"],
  ["A afirmação � irrelevante", "A afirmação é irrelevante"],
  ["para interpretar essa situação, � mais adequado", "para interpretar essa situação, é mais adequado"],
  ["resultado mais prov�vel seria", "resultado mais provável seria"],
  ["gera interpreta�es erradas", "gera interpretações erradas"],
  ["descrito por vari�veis físicas", "descrito por variáveis físicas"],
  ["com medidas, vari�veis ou interpretação", "com medidas, variáveis ou interpretação"],
  ["em exemplos te�ricos sem uso cotidiano", "em exemplos teóricos sem uso cotidiano"],
  ["qualidade da solu��o", "qualidade da solução"],
  ["movimento em vari�veis, relações físicas", "movimento em variáveis, relações físicas"],
  ["refere-se � ", "refere-se à "],
  ["refere-se �s ", "refere-se às "],
  ["quanto � ", "quanto à "],
  ["quanto �s ", "quanto às "],
  ["per�odo", "período"],
  ["b�sica", "básica"],
  ["b�sicas", "básicas"],
  ["b�sico", "básico"],
  ["b�sicos", "básicos"],
  ["an�lise", "análise"],
  ["l�quida", "líquida"],
  ["l�quidas", "líquidas"],
  ["audi��o", "audição"],
  ["c�lculo", "cálculo"],
  ["c�lculos", "cálculos"],
  ["Refra�o", "Refração"],
  ["refra�o", "refração"],
  ["Interfer�ncia", "Interferência"],
  ["interfer�ncia", "interferência"],
  ["Resson�ncia", "Ressonância"],
  ["resson�ncia", "ressonância"],
  ["Trajet�ria, distância e deslocamento", "Trajetória, distância e deslocamento"],
  ["Introdu��o ao MRU e ao MRUV", "Introdução ao MRU e ao MRUV"],
  ["An�lise dimensional", "Análise dimensional"],
  ["Fun��o horária do espaço", "Função horária do espaço"],
  ["Fun��o horária do espaco", "Função horária do espaço"],
  ["Fun��o horária da velocidade", "Função horária da velocidade"],
  ["Fun��o horária da posição", "Função horária da posição"],
  ["ultrapassagem de m�veis", "ultrapassagem de móveis"],
  ["In�rcia e primeira lei de Newton", "Inércia e primeira lei de Newton"],
  ["Diagrama de for�as", "Diagrama de forças"],
  ["For�a normal", "Força normal"],
  ["For�a de atrito", "Força de atrito"],
  ["Impulso de uma for�a", "Impulso de uma força"],
  ["Aplica��es em seguran�a e esportes", "Aplicações em segurança e esportes"],
  ["Pot�ncia mecânica", "Potência mecânica"],
  ["Energia cin�tica", "Energia cinética"],
  ["Aplica��es energéticas do cotidiano", "Aplicações energéticas do cotidiano"],
  ["For�a magnética sobre cargas", "Força magnética sobre cargas"],
  ["For�a magnética em condutores", "Força magnética em condutores"],
  ["Indu��o eletromagnética", "Indução eletromagnética"],
  ["Aplica��es do magnetismo", "Aplicações do magnetismo"],
  ["Gr�ficos do movimento", "Gráficos do movimento"],
  ["Queda livre e lan�amento vertical", "Queda livre e lançamento vertical"],
  ["Sistemas com for�a resultante", "Sistemas com força resultante"],
  ["Espelhos esf�ricos", "Espelhos esféricos"],
  ["Lentes esf�ricas", "Lentes esféricas"],
  ["Instrumentos �pticos", "Instrumentos ópticos"],
  ["Defeitos da vis�o", "Defeitos da visão"]
  ,["fun��o do tempo", "função do tempo"]
  ,["fun��es horárias", "funções horárias"]
  ,["fun��o horária", "função horária"]
  ,["const�ncia", "constância"]
  ,["indispensóvel", "indispensável"]
  ,["re�ne", "reúne"]
  ,["haver�", "haverá"]
  ,["intera��es", "interações"]
  ,["m�tua", "mútua"]
  ,["simult�neos", "simultâneos"]
  ,["flex�veis", "flexíveis"]
  ,["comp�em", "compõem"]
  ,["empurr�es", "empurrões"]
  ,["estado din�mico", "estado dinâmico"]
  ,["cin�tica", "cinética"]
  ,["distribui��o", "distribuição"]
  ,["crit�rio", "critério"]
  ,["relevan", "relevân"]
  ,["relevan", "relevân"]
  ,["trajet�ria", "trajetória"]
  ,["posi��es", "posições"]
  ,["por uma for�a", "por uma força"]
  ,["for�a resultante", "força resultante"]
  ,["for�a aplicada", "força aplicada"]
  ,["for�a externa", "força externa"]
  ,["for�a atuando", "força atuando"]
  ,["for�a de contato", "força de contato"]
  ,["for�a gravitacional", "força gravitacional"]
  ,["for�a mínima", "força mínima"]
  ,["interação m�tua", "interação mútua"]
  ,["tendência de deslizame", "tendência de deslizame"]
  ,["relacion�-las", "relacioná-las"]
  ,["A situação apresentada � um exemplo de", "A situação apresentada é um exemplo de"]
  ,["situação, � mais adequado mobilizar", "situação, é mais adequado mobilizar"]
  ,["energia � transferida", "energia é transferida"]
  ,["trabalho � realizado", "trabalho é realizado"]
  ,["associada � ", "associada à "]
  ,["igual � variação", "igual à variação"]
  ,["nível de refer�ncia", "nível de referência"]
  ,["empurr�o", "empurrão"]
  ,["realiz�-lo", "realizá-lo"]
  ,["m�quina", "máquina"]
  ,["m�quinas", "máquinas"]
  ,["transportes, que", "transportes, que"]
  ,["for�a ao longo", "força ao longo"]
  ,["energia cin�tica", "energia cinética"]
  ,["potencial elástica", "potencial elástica"]
  ,["transforma��es", "transformações"]
  ,["polos magnéticos insepar�veis", "polos magnéticos inseparáveis"]
  ,["varia��es no fluxo magnético", "variações no fluxo magnético"]
  ,["�m�", "ímã"]
  ,["padr�es", "padrões"]
  ,["aplica�es", "aplicações"]
  ,["indu��o", "indução"]
  ,["Fen�menos", "Fenômenos"]
  ,["medi��es", "medições"]
  ,["combina��es", "combinações"]
  ,["diminui��o", "diminuição"]
  ,["limita��es", "limitações"]
  ,["informa��es", "informações"]
  ,["padr�o", "padrão"]
  ,["padr�es", "padrões"]
  ,["refer�ncia", "referência"]
  ,["exist�ncia", "existência"]
  ,["cr�tica", "crítica"]
  ,["sin�nimo", "sinônimo"]
  ,["r�pido", "rápido"]
  ,["r�pida", "rápida"]
  ,["média, � realizado", "média, é realizado"]
  ,["grandeza física � ", "grandeza física é "]
  ,["força resultante � ", "força resultante é "]
  ,["corpo � ", "corpo é "]
  ,["não � ", "não é "]
  ,["é sempre mútua e não pod", "é sempre mútua e não pod"]
  ,["ou � tendência", "ou à tendência"]
  ,["ligado � ação", "ligado à ação"]
  ,["devido � deformação", "devido à deformação"]
  ,["situações cotidianas � luz", "situações cotidianas à luz"]
  ,["continua conservado e � redistribu�do", "continua conservado e é redistribuído"]
  ,["interações geram pares de forças simult�neos", "interações geram pares de forças simultâneos"]
  ,["combinações entre grandezas fund", "combinações entre grandezas fund"]
  ,["gráficos cinem�ticos", "gráficos cinemáticos"]
  ,["registrar medi��es de um laboratório", "registrar medições de um laboratório"]
  ,["medição possui limita��es", "medição possui limitações"]
  ,["poderia gerar interpreta�es erradas", "poderia gerar interpretações erradas"]
  ,["vibra��es", "vibrações"]
  ,["din�micos", "dinâmicos"]
  ,["Pot�ncia elétrica", "Potência elétrica"]
  ,["restri��es", "restrições"]
  ,["possível percorrer uma", "possível percorrer uma"]
  ,["avaliação cr�tica", "avaliação crítica"]
  ,["interpretações quantitativas", "interpretações quantitativas"]
  ,["movimento � o produto vetorial", "movimento é o produto vetorial"]
  ,["resultante e � sua massa", "resultante e é sua massa"]
  ,["ao lan�ar um objeto", "ao lançar um objeto"]
  ,["externas � nula", "externas é nula"]
  ,["científica � útil", "científica é útil"]
  ,["científica � a escrita", "científica é a escrita"]
  ,["forças � a ferramenta", "forças é a ferramenta"]
  ,["cinética � a energia", "cinética é a energia"]
  ,["média � determinada", "média é determinada"]
  ,["movimento � descrita", "movimento é descrita"]
  ,["forma �s grandezas", "forma às grandezas"]
  ,["conversão correta �", "conversão correta é"]
  ,["aceleração � indispensável", "aceleração é indispensável"]
  ,["interação � sempre", "interação é sempre"]
  ,["sistema � passo", "sistema é passo"]
  ,["relacioná-las � aceleração", "relacioná-las à aceleração"]
  ,["força � essencial", "força é essencial"]
  ,["gravitacional � a energia", "gravitacional é a energia"]
  ,["elástica � a energia", "elástica é a energia"]
  ,["escalar média �", "escalar média é"]
  ,["comprimento � registrado", "comprimento é registrado"]
  ,["velocidade � obtida", "velocidade é obtida"]
  ,["astros � escrita", "astros é escrita"]
  ,["pertencem � mesma", "pertencem à mesma"]
  ,["ele � um aparelho", "ele é um aparelho"]
  ,["aceleração � constante", "aceleração é constante"]
  ,["posição por tempo � uma reta", "posição por tempo é uma reta"]
  ,["mudança � associada", "mudança é associada"]
  ,["cinética � dissipada", "cinética é dissipada"]
  ,["parte dela � convertida", "parte dela é convertida"]
  ,["caso mostra que � possível", "caso mostra que é possível"]
  ,["medição �", "medição é"]
  ,["conversão de unidades �", "conversão de unidades é"]
  ,["movimento uniforme �", "movimento uniforme é"]
  ,["posição no MRUV �", "posição no MRUV é"]
  ,["velocidade no MRUV �", "velocidade no MRUV é"]
  ,["instantes intermedi�rios", "instantes intermediários"]
  ,["quadr�ticos", "quadráticos"]
  ,["evolu��o", "evolução"]
  ,["persegui��o", "perseguição"]
  ,["inclina��es", "inclinações"]
  ,["in�cio", "início"]
  ,["varia��es", "variações"]
  ,["representativo", "representativo"]
  ,["din�mico", "dinâmico"]
  ,["distribu�da", "distribuída"]
  ,["associado � massa", "associado à massa"]
  ,["variação da quantidade", "variação da quantidade"]
  ,["momento linear �", "momento linear é"]
  ,["separa��es", "separações"]
  ,["manutenção", "manutenção"]
  ,["automatically", "automatically"]
];

const regexReplacements = [
  [/\uFFFD que:/g, " é que:"],
  [/\uFFFD obtida/g, " é obtida"],
  [/\uFFFD observad([oa])/g, " é observad$1"],
  [/\uFFFD informad([oa])/g, " é informad$1"],
  [/\uFFFD vetorial/g, " é vetorial"],
  [/\uFFFD constante/g, " é constante"],
  [/\uFFFD diferente/g, " é diferente"],
  [/\uFFFD sempre/g, " é sempre"],
  [/\uFFFD acelerad([oa])/g, " é acelerad$1"],
  [/\uFFFD uma grandeza/g, " é uma grandeza"],
  [/\uFFFD MRUV/g, " é MRUV"],
  [/\uFFFD uma reta/g, " é uma reta"],
  [/\uFFFD uma linha/g, " é uma linha"],
  [/\uFFFD inútil/g, " é inútil"],
  [/\uFFFD isolado/g, " é isolado"],
  [/\uFFFD inelástica/g, " é inelástica"],
  [/\uFFFD automaticamente/g, " é automaticamente"],
  [/\uFFFD nula/g, " é nula"],
  [/\uFFFD a força/g, " é a força"],
  [/\uFFFD a energia/g, " é a energia"],
  [/\uFFFD útil/g, " é útil"],
  [/\uFFFD essencial/g, " é essencial"],
  [/\uFFFD transmitid([oa])/g, " é transmitid$1"],
  [/\uFFFD determinad([oa])/g, " é determinad$1"],
  [/\uFFFD produzida/g, " é produzida"],
  [/\uFFFD atra\uFFFDdo/g, " é atraído"],
  [/\uFFFD puxado/g, " é puxado"],
  [/\uFFFD lançada/g, " é lançada"],
  [/\uFFFD solta/g, " é solta"],
  [/\uFFFD escalar/g, " é escalar"],
  [/\uFFFD registrado/g, " é registrado"],
  [/ corresponde \uFFFD /g, " corresponde à "],
  [/ refere-se \uFFFD /g, " refere-se à "],
  [/ associado \uFFFD /g, " associado à "],
  [/ associada \uFFFD /g, " associada à "],
  [/ igual \uFFFD /g, " igual à "],
  [/ próximo \uFFFD /g, " próximo à "],
  [/ retornar \uFFFD sua forma/g, " retornar à sua forma"],
  [/ em relação \uFFFD /g, " em relação à "],
  [/ quanto \uFFFD /g, " quanto à "],
  [/ pertencem \uFFFD mesma/g, " pertencem à mesma"],
  [/ ligado \uFFFD /g, " ligado à "],
  [/ devido \uFFFD /g, " devido à "],
  [/velocidade média \uFFFD/g, "velocidade média é"],
  [/movimento uniforme \uFFFD/g, "movimento uniforme é"],
  [/aceleração média \uFFFD/g, "aceleração média é"],
  [/força normal \uFFFD/g, "força normal é"],
  [/peso \uFFFD/g, "peso é"],
  [/momento linear \uFFFD/g, "momento linear é"],
  [/^(\s*\")\uFFFD sempre/gm, "$1É sempre"],
  [/Trajet\uFFFDria/g, "Trajetória"],
  [/trajet\uFFFDria/g, "trajetória"],
  [/Dist\uFFFDncia/g, "Distância"],
  [/dist\uFFFDncia/g, "distância"],
  [/Gr\uFFFDficos/g, "Gráficos"],
  [/gr\uFFFDficos/g, "gráficos"],
  [/cinem\uFFFDticos/g, "cinemáticos"],
  [/Equa\uFFFD\uFFFDes/g, "Equações"],
  [/equa\uFFFD\uFFFDes/g, "equações"],
  [/Intera\uFFFD\uFFFDes/g, "Interações"],
  [/intera\uFFFD\uFFFDes/g, "interações"],
  [/A\uFFFD\uFFFDo/g, "Ação"],
  [/a\uFFFD\uFFFDo/g, "ação"],
  [/rea\uFFFD\uFFFDo/g, "reação"],
  [/transforma\uFFFD\uFFFDes/g, "transformações"],
  [/conserva\uFFFD\uFFFDes/g, "conservações"],
  [/simplifica\uFFFD\uFFFDes/g, "simplificações"],
  [/interpreta\uFFFDes/g, "interpretações"],
  [/interpret\uFFFD-las/g, "interpretá-las"],
  [/aplica\uFFFD\uFFFDes/g, "aplicações"],
  [/varia\uFFFD\uFFFDes/g, "variações"],
  [/acelera\uFFFD\uFFFDes/g, "acelerações"],
  [/deforma\uFFFD\uFFFDes/g, "deformações"],
  [/medi\uFFFD\uFFFDes/g, "medições"],
  [/combina\uFFFD\uFFFDes/g, "combinações"],
  [/limita\uFFFD\uFFFDes/g, "limitações"],
  [/informa\uFFFD\uFFFDes/g, "informações"],
  [/restri\uFFFD\uFFFDes/g, "restrições"],
  [/atra\uFFFDdo/g, "atraído"],
  [/ve\uFFFDculo/g, "veículo"],
  [/seguran\uFFFDa/g, "segurança"],
  [/semelhan\uFFFDas/g, "semelhanças"],
  [/necess\uFFFDria/g, "necessária"],
  [/necess\uFFFDrio/g, "necessário"],
  [/inevit\uFFFDveis/g, "inevitáveis"],
  [/exerc\uFFFDcios/g, "exercícios"],
  [/m\uFFFDltiplas/g, "múltiplas"],
  [/fa\uFFFDam/g, "façam"],
  [/prov\uFFFDvel/g, "provável"],
  [/dimens\uFFFDes/g, "dimensões"],
  [/pux\uFFFDo/g, "puxão"],
  [/cart\uFFFDes/g, "cartões"],
  [/Resist\uFFFDncia/g, "Resistência"],
  [/resist\uFFFDncia/g, "resistência"],
  [/F\uFFFDsicas/g, "Físicas"],
  [/f\uFFFDsica/g, "física"],
  [/for\uFFFDa/g, "força"],
  [/for\uFFFDas/g, "forças"],
  [/movimento \uFFFD descrita/g, "movimento é descrito"],
  [/o impulso resultante \uFFFD mudança/g, "o impulso resultante é a mudança"],
  [/científica \uFFFD útil/g, "científica é útil"],
  [/científica \uFFFD a escrita/g, "científica é a escrita"],
  [/  é /g, " é "],
  [/relevântes/g, "relevantes"],
  [/relevânte/g, "relevante"],
  [/irrelevânte/g, "irrelevante"],
  [/desnecessório/g, "desnecessário"],
  [/necessória/g, "necessária"],
  [/necessório/g, "necessário"],
  [/mantêm coerência/g, "mantém coerência"],
  [/mantêm módulo/g, "mantém módulo"],
  [/Refracao da luz/g, "Refração da luz"],
  [/Refracao de ondas/g, "Refração de ondas"],
  [/Interferencia/g, "Interferência"],
  [/Ressonancia/g, "Ressonância"],
  [/Dispersao e prismas/g, "Dispersão e prismas"],
  [/Potencia elétrica/g, "Potência elétrica"],
  [/Resistencia elétrica/g, "Resistência elétrica"],
  [/Tensao elétrica/g, "Tensão elétrica"],
  [/Movimento uniforme \uFFFD aquele/g, "Movimento uniforme é aquele"],
  [/Torricelli \uFFFD mais útil/g, "Torricelli é mais útil"],
  [/por tempo \uFFFD linear/g, "por tempo é linear"],
  [/aceleração \uFFFD força/g, "aceleração à força"],
  [/contrário \uFFFD velocidade/g, "contrário à velocidade"],
  [/força de atrito \uFFFD uma interação/g, "força de atrito é uma interação"],
  [/de forças \uFFFD a representação/g, "de forças é a representação"],
  [/paralelo \uFFFD superfície/g, "paralelo à superfície"],
  [/impulso de uma força \uFFFD a grandeza/g, "impulso de uma força é a grandeza"],
  [/impulso \uFFFD variação/g, "impulso à variação"],
  [/resultante \uFFFD igual à mudança/g, "resultante é igual à mudança"],
  [/também \uFFFD necessariamente/g, "também é necessariamente"],
  [/corpos \uFFFD uma aplicação/g, "corpos é uma aplicação"],
  [/massa \uFFFD o ponto representativo/g, "massa é o ponto representativo"],
  [/ele \uFFFD um ponto/g, "ele é um ponto"],
  [/sistema isolado \uFFFD aquele/g, "sistema isolado é aquele"],
  [/energia cinética \uFFFD a própria/g, "energia cinética é a própria"],
  [/resultante \uFFFD mudança/g, "resultante à mudança"],
  [/energia \uFFFD dissipada/g, "energia é dissipada"],
  [/Transforma\uFFFD\uFFFDes/g, "Transformações"],
  [/For\uFFFDas/g, "Forças"],
  [/Seguran\uFFFDa/g, "Segurança"],
  [/associa\uFFFD\uFFFDes/g, "associações"],
  [/Associa\uFFFD\uFFFDes/g, "Associações"],
  [/a\uFFFD\uFFFDes/g, "ações"],
  [/v\uFFFDnculo/g, "vínculo"],
  [/atribu\uFFFDdos/g, "atribuídos"]
];

function reviseText(input) {
  let output = input;
  for (const [from, to] of replacements) {
    output = output.split(from).join(to);
  }
  for (const [pattern, to] of regexReplacements) {
    output = output.replace(pattern, to);
  }
  return output;
}

function transformNode(node, key = "") {
  if (Array.isArray(node)) {
    if (editableKeys.has(key)) {
      return node.map((item) =>
        typeof item === "string" ? reviseText(item) : transformNode(item, key)
      );
    }
    return node.map((item) => transformNode(item, key));
  }

  if (!node || typeof node !== "object") {
    return node;
  }

  const next = {};
  for (const [childKey, value] of Object.entries(node)) {
    if (typeof value === "string" && editableKeys.has(childKey)) {
      next[childKey] = reviseText(value);
    } else {
      next[childKey] = transformNode(value, childKey);
    }
  }
  return next;
}

function parseModule(source) {
  const match = source.match(/export const\s+(\w+)\s*=\s*([\s\S]*);\s*$/);
  if (!match) {
    throw new Error("Nao foi possivel identificar o export principal do modulo.");
  }
  const [, exportName, objectSource] = match;
  const data = Function(`return (${objectSource})`)();
  return { exportName, data };
}

const targets = [
  "questions/banks/1-serie/fisica/cinematica-mru-mruv/index.js",
  "questions/banks/1-serie/fisica/grandezas-fisicas/index.js",
  "questions/banks/1-serie/fisica/movimento-uniforme-e-variado/index.js",
  "questions/banks/2-serie/fisica/dinamica-leis-de-newton/index.js",
  "questions/banks/2-serie/fisica/impulso-e-quantidade-de-movimento/index.js",
  "questions/banks/2-serie/fisica/trabalho-e-energia/index.js",
  "questions/banks/3-serie/fisica/eletrodinamica/index.js",
  "questions/banks/3-serie/fisica/magnetismo/index.js",
  "questions/banks/3-serie/fisica/ondulatoria/index.js",
  "questions/banks/3-serie/fisica/optica/index.js"
];

for (const relPath of targets) {
  const absPath = path.join(repoRoot, relPath);
  const source = fs.readFileSync(absPath, "utf8");
  const { exportName, data } = parseModule(source);
  const revised = transformNode(data);
  const output = `export const ${exportName} = ${JSON.stringify(revised, null, 2)};\n`;
  fs.writeFileSync(absPath, output, "utf8");
  console.log(`Revisado: ${relPath}`);
}

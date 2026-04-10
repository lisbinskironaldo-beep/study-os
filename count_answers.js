const fs = require('fs');

// Função para contar distribuição de respostas corretas
function countCorrectAnswers(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  // Extrair o array questoes usando regex
  const match = data.match(/questoes: (\[[\s\S]*?\n\s*\])/);
  if (!match) return null;
  const questoesStr = match[1];
  // Avaliar como JS
  const questoes = eval(questoesStr);
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  questoes.forEach(q => {
    const index = q.opcoes.indexOf(q.correta);
    if (index >= 0 && index < 4) {
      const letter = String.fromCharCode(65 + index);
      counts[letter]++;
    }
  });
  return counts;
}

console.log('cultura-corporal:', countCorrectAnswers('c:/dev/study-os/questions/banks/1-serie/educacao-fisica/cultura-corporal/index.js'));
console.log('esportes-basicos:', countCorrectAnswers('c:/dev/study-os/questions/banks/1-serie/educacao-fisica/esportes-basicos/index.js'));
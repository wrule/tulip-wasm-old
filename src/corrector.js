import fs from 'fs';

const tasks = {
  'add': (indicator) => indicator.input_names = ['real1', 'real2'],
  'sub': (indicator) => indicator.input_names = ['real1', 'real2'],
  'mul': (indicator) => indicator.input_names = ['real1', 'real2'],
  'div': (indicator) => indicator.input_names = ['real1', 'real2'],
  'crossany': (indicator) => indicator.input_names = ['real1', 'real2'],
  'crossover': (indicator) => indicator.input_names = ['real1', 'real2'],
  'var': (indicator) => indicator.name = '_var',
};

function main() {
  const filepath = process.argv[2];
  const indicators = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  Object.entries(tasks).forEach(([name, func]) => {
    const indicator = indicators.find((indicator) => indicator.name === name);
    if (indicator) {
      console.log('correct', indicator.name);
      func(indicator);
    }
  });
  fs.writeFileSync(filepath, JSON.stringify(indicators, null, 2), 'utf8');
}

main();

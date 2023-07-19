import fs from 'fs';
import path from 'path';
import { Indicator } from './indicator';

const tasks = {
  'add': (indicator: Indicator) => indicator.input_names = ['real1', 'real2'],
  'sub': (indicator: Indicator) => indicator.input_names = ['real1', 'real2'],
  'mul': (indicator: Indicator) => indicator.input_names = ['real1', 'real2'],
  'div': (indicator: Indicator) => indicator.input_names = ['real1', 'real2'],
  'crossany': (indicator: Indicator) => indicator.input_names = ['real1', 'real2'],
  'crossover': (indicator: Indicator) => indicator.input_names = ['real1', 'real2'],
  'var': (indicator: Indicator) => indicator.name = '_var',
}

function main() {
  const filepath = process.argv[2];
  const indicators: Indicator[] = JSON.parse(fs.readFileSync(filepath, 'utf8'));
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

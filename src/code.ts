import fs from 'fs';
import { Indicator } from './meta';
import indicators from './indicators.json';

export
class Code {
  public constructor(private readonly ind: Indicator) { }

  private get options() {
    return this.ind.options > 1;
  }

  private get outputs() {
    return this.ind.outputs > 1;
  }

  private names(list: string[], type: 'number' | 'number[]' | 'options' | 'outputs' | '' = 'number') {
    return list.map((name, index) => {
      if (type === 'number') return `${name}: number`;
      if (type === 'number[]') return `${name}: number[]`;
      if (type === 'options') return `options.${name}`;
      if (type === 'outputs') return `${name}: outputs[${index}]`;
      return name;
    }).join(', ');
  }

  private get argsCode() {
    const inputs = this.names(this.ind.input_names, 'number[]');
    const options = this.options ?
      `options: { ${this.names(this.ind.option_names)} }` :
      this.names(this.ind.option_names);
    const align = 'align: boolean | number = false';
    return [inputs, options, align].filter((item) => item).join(', ');
  }

  public Code() {
    return `
/**
 * ${this.ind.full_name}
 */
export
function ${this.ind.name}(${this.argsCode}) {
  const outputs = run_alone_sync(${this.ind.index}, [${
    this.names(this.ind.input_names, '')
  }], [${
    this.names(this.ind.option_names, this.options ? 'options' : '')
  }], ${this.ind.outputs}, align);
  return ${this.outputs ?
    `{ ${this.names(this.ind.output_names, 'outputs')} }` :
    'outputs[0]'
  };
}
    `.trim();
  }

  public CodeStart() {
    return `
/**
 * ${this.ind.full_name}
 */
export
function ${this.ind.name}_start(${this.argsCode}) {
  return run_get_start(${this.ind.index}, [${
    this.names(this.ind.option_names, this.options ? 'options' : '')
  }]);
}
    `.trim();
  }

  public CodePromise() {
    return `
/**
 * ${this.ind.full_name}
 */
export
async function ${this.ind.name}_p(${this.argsCode}) {
  const outputs = await run_alone_promise(tulip_promise, ${this.ind.index}, [${
    this.names(this.ind.input_names, '')
  }], [${
    this.names(this.ind.option_names, this.options ? 'options' : '')
  }], ${this.ind.outputs}, align);
  return ${this.outputs ?
    `{ ${this.names(this.ind.output_names, 'outputs')} }` :
    'outputs[0]'
  };
}
    `.trim();
  }
}

function main() {
  const full_code = `
export * from './meta';
import { tulip_promise, run_alone_promise, run_alone_sync, run_get_start } from './meta';

${indicators.map((ind) => new Code(ind).Code()).join('\n\n')}

${indicators.map((ind) => new Code(ind).CodeStart()).join('\n\n')}

${indicators.map((ind) => new Code(ind).CodePromise()).join('\n\n')}
  `.trim() + '\n';
  fs.writeFileSync('src/indicators.ts', full_code, 'utf8');
}

main();

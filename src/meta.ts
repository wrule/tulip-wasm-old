import tulip_wasm from './tulip_wasm';
import { Global } from './utils';

export
interface Indicator {
  index: number;
  name: string;
  full_name: string;
  type: number;
  inputs: number;
  options: number;
  outputs: number;
  input_names: string[];
  option_names: string[];
  output_names: string[];
}

export
interface TulipWASM {
  _free_task: (task_index: number) => void;
  _free_current: () => void;
  _reset: () => void;
  _init: () => void;
  _new_task: (indicator_index: number, size: number) => number;
  _inputs_number: (
    task_index: number,
    input_index: number,
    offset: number,
    number: number,
  ) => void;
  _inputs_map: (
    task_index: number,
    input_index: number,
    target_index: number,
    is_outputs: number,
    data_index: number,
  ) => void;
  _options_number: (
    task_index: number,
    offset: number,
    number: number,
  ) => void;
  _outputs_number: (
    task_index: number,
    output_index: number,
    offset: number,
  ) => number;
  _get_inputs_number: (
    task_index: number,
    input_index: number,
    offset: number,
  ) => number;
  _inputs_offset: (task_index: number) => number;
  _outputs_offset: (task_index: number) => number;
  _link_task: (task_index: number) => void,
  _run_task: (task_index: number) => void,
  _run: (start_index: number, end_index: number) => void,
}

export
const tulip_promise: Promise<TulipWASM> = tulip_wasm();

let initializing = 0;

export
async function init() {
  if (Global.tulip_wasm) return;
  initializing++;
  const log = initializing === 1;
  log && console.log('initialize tulip-wasm...');
  Global.tulip_wasm = await tulip_promise;
  log && console.log('initialization successful');
}

init();

export
function _align(outputs: number[][], length: number) {
  outputs.forEach((output) => {
    const diff = length - output.length;
    if (diff > 0) output.unshift(...Array(diff).fill(NaN));
    if (diff < 0) output.splice(0, -diff);
  });
}

export
async function run_alone_promise(
  tulip_promise: Promise<TulipWASM>,
  indicator_index: number,
  inputs: number[][],
  options: number[],
  outputs_size: number,
) {
  const tulip = await tulip_promise;
  const size = inputs[0].length;
  const task_index = tulip._new_task(indicator_index, size);
  inputs.forEach((input, input_index) => {
    for (let offset = 0; offset < size; ++offset)
      tulip._inputs_number(task_index, input_index, offset, input[offset]);
  });
  options.forEach((option, offset) => tulip._options_number(task_index, offset, option));
  tulip._run_task(task_index);
  const outputs_offset = tulip._outputs_offset(task_index);
  const outputs = new Array<number[]>(outputs_size);
  for (let output_index = 0; output_index < outputs_size; ++output_index) {
    outputs[output_index] = new Array<number>(size);
    for (let offset = 0; offset < size; ++offset)
      outputs[output_index][offset] = offset >= outputs_offset ?
        tulip._outputs_number(task_index, output_index, offset) :
        NaN;
  }
  outputs.push([outputs_offset]);
  tulip._free_current();
  return outputs;
}

export
function run_alone_sync(
  indicator_index: number,
  inputs: number[][],
  options: number[],
  outputs_size: number,
) {
  const tulip: TulipWASM = Global.tulip_wasm;
  const size = inputs[0].length;
  const task_index = tulip._new_task(indicator_index, size);
  inputs.forEach((input, input_index) => {
    for (let offset = 0; offset < size; ++offset)
      tulip._inputs_number(task_index, input_index, offset, input[offset]);
  });
  options.forEach((option, offset) => tulip._options_number(task_index, offset, option));
  tulip._run_task(task_index);
  const outputs_offset = tulip._outputs_offset(task_index);
  const outputs = new Array<number[]>(outputs_size);
  for (let output_index = 0; output_index < outputs_size; ++output_index) {
    outputs[output_index] = new Array<number>(size);
    for (let offset = 0; offset < size; ++offset)
      outputs[output_index][offset] = offset >= outputs_offset ?
        tulip._outputs_number(task_index, output_index, offset) :
        NaN;
  }
  outputs.push([outputs_offset]);
  tulip._free_current();
  return outputs;
}

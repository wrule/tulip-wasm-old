import tulip_wasm from './tulip_wasm';

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
const tulip: Promise<TulipWASM> = tulip_wasm();

export
async function run_alone(
  tulip_p: Promise<TulipWASM>,
  indicator_index: number,
  inputs: number[][],
  options: number[],
  outputs_size: number,
) {
  const tulip = await tulip_p;
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

import * as tulip from './indicators';
export * from './indicators';

const isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

const isWebWorker =
  typeof self === 'object' &&
  self.constructor &&
  self.constructor.name === 'DedicatedWorkerGlobalScope';

let env: any = null;
if (isBrowser) env = window;
if (isNode) env = global;
if (isWebWorker) env = self;
if (env) env.tulip = tulip;

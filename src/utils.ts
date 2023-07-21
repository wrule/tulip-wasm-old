
export
const IsBrowser =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined';

export
const IsNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

export
const IsWebWorker =
  typeof self === 'object' &&
  self.constructor &&
  self.constructor.name === 'DedicatedWorkerGlobalScope';

export
const Global = (() => {
  let env: any = null;
  if (IsBrowser) env = window;
  if (IsNode) env = global;
  if (IsWebWorker) env = self;
  if (!env) throw 'unknown runtime';
  return env;
})();

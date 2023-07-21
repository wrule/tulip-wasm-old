
const IsBrowser = () =>
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined';

const IsNode = () =>
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

const IsWebWorker = () =>
  typeof self === 'object' &&
  self.constructor &&
  self.constructor.name === 'DedicatedWorkerGlobalScope';

import { F } from './fractal'

[
  'app',
  'print',
  'form',
].forEach(name => {
  const c = require('./' + name).default;
  F.registerComponent(name, c);
});

F.init();

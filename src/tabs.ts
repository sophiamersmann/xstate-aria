import { createMachine } from 'xstate';

function createTabsMachine() {
  return createMachine({ id: 'wai-aria-tabs' });
}

console.log(createTabsMachine());

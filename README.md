# State machines for UI primitives

A collection of [XState](https://xstate.js.org/docs/) machines for UI primitives

_Based on [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)_

**Machines:**

- [Tabs](#tabs)

## Tabs

Source: [`machines/tabs.js`](machines/tabs.js)

### `createTabsMachine`

**Options:**

- `tabs`: list of tabs _(required)_
- `activeTab`: initially active tab (if not given defaults to the first element in `tabs`)

**States:** (for each `<tab>` in `tabs`)

- `<tab>.focused`
- `<tab>.blurred`

**Events:**

- `<tab>` (for each `<tab>` in `tabs`)
- `CLICK`
- `BLUR`
- `'ArrowRight'`
- `'ArrowLeft'`
- `'Home'`
- `'End'`

### With Svelte

```svelte
<script>
  import { createMachine } from 'xstate';
  import { useMachine } from '@xstate/svelte';

  const tabs = ['tab1', 'tab2', 'tab3'];
  const tabsMachine = createTabsMachine(tabs, 'tab2');
  const { state, send } = useMachine(tabsMachine);

  function focus(node, active) {
    function setFocus() {
      if (active) node.focus();
      else node.blur();
    }

    setFocus();

    return {
      update(newActive) {
        active = newActive;
        setFocus();
      }
    };
  }
</script>

<div role="tablist" aria-label="My tab list label">
  {#each tabs as tab}
    {@const isActive = $state.matches(tab)}
    <button
      type="button"
      role="tab"
      tabindex={isActive ? 0 : -1}
      aria-controls={tab}
      aria-selected={isActive}
      use:focus={$state.matches(`${tab}.focused`)}
      on:focus={() => send(tab)}
      on:click={() => send(tab)}
      on:keydown={(e) => send(e.key)}
    >
      {tab}
    </button>
  {/each}
</div>

<div>
  {#each tabs as tab}
    {@const isActive = $state.matches(tab)}
    {#if $state.matches(tab)}
      <div
        id={tab}
        role="tabpanel"
        tabindex={isActive ? 0 : -1}
        aria-expanded={isActive}
        on:blur={() => send('BLUR')}
      >
        Content for {tab}
      </div>
    {/if}
  {/each}
</div>
```

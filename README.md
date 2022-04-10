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
- `orientation`: `"vertical"` or `"horizontal"` (defaults to `"horizontal"`)

**States:** (for each `<tab>` in `tabs`)

- `<tab>.active`
- `<tab>.active.focused`
- `<tab>.active.blurred`
- `<tab>.inactive`

**Events:**

- `<tab>`: select tab (for each `<tab>` in `tabs`)
- `FOCUS`: focus active tab
- `BLUR`: blur active tab
- `ArrowRight`/`ArrowDown`: move to the next tab
- `ArrowLeft`/`ArrowUp`: move to the previous tab
- `Home`: move to the first tab
- `End`: move to the last tab

### With Svelte

```svelte
<script>
  import { createMachine } from 'xstate';
  import { useMachine } from '@xstate/svelte';

  const tabs = ['tab1', 'tab2', 'tab3'];
  const tabsMachine = createTabsMachine(tabs, 'tab1');
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

<div role="tablist" aria-label="My tabs">
  {#each tabs as tab}
    {@const ctx = $state.context[tab]}
    <button
      type="button"
      role="tab"
      tabindex={ctx.focus.tabindex}
      aria-controls={ctx.aria.controls}
      aria-selected={ctx.aria.selected}
      use:focus={$state.matches(`${tab}.active.focused`)}
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
    {@const ctx = $state.context[tab]}
    {#if $state.matches(tab)}
      <div
        id={tab}
        role="tabpanel"
        tabindex={ctx.focus.tabindex}
        aria-expanded={ctx.aria.expanded}
        on:blur={() => send('BLUR')}
      >
        Content for {tab}
      </div>
    {/if}
  {/each}
</div>
```

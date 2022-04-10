import { createMachine } from 'xstate';

/**
 * @param {string[]} tabs - list of tabs
 * @param {string} [activeTab] - initially active tab (defaults to the first tab in the given list)
 * @param {'horizontal' | 'vertical'} [orientation] - horizontal or vertical orientation
 */
export default function createTabsMachine(
  tabs,
  activeTab,
  orientation = 'horizontal'
) {
  if (tabs.length === 0) return;
  if (!activeTab || !tabs.includes(activeTab)) activeTab = tabs[0];

  const arrowAfter = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
  const arrowBefore = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

  const getTabBefore = (tab) => {
    const tabIndex = tabs.indexOf(tab);
    return tabs[tabIndex === 0 ? tabs.length - 1 : tabIndex - 1];
  };
  const getTabAfter = (tab) => {
    const tabIndex = tabs.indexOf(tab);
    return tabs[tabIndex === tabs.length - 1 ? 0 : tabIndex + 1];
  };
  const getFirstTab = () => tabs[0];
  const getLastTab = () => tabs[tabs.length - 1];

  const states = {};
  const events = {};
  const context = {};

  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    const isActive = tab === activeTab;

    context[tab] = {
      focus: {
        tabindex: isActive ? 0 : -1,
      },
      aria: {
        controls: tab,
        selected: isActive,
        expanded: isActive,
      },
    };

    events[tab] = `${tab}.active.focused`;

    states[tab] = {
      id: tab,
      initial: isActive ? 'active' : 'inactive',
      entry: ['activate'],
      states: {
        active: {
          initial: 'blurred',
          states: {
            focused: {
              on: {
                [arrowAfter]: `#${getTabAfter(tab)}.active.focused`,
                [arrowBefore]: `#${getTabBefore(tab)}.active.focused`,
                Home: `#${getFirstTab()}.active.focused`,
                End: `#${getLastTab()}.active.focused`,
                BLUR: 'blurred',
              },
            },
            blurred: {
              on: {
                FOCUS: 'focused',
              },
            },
          },
        },
        inactive: {},
      },
    };
  }

  return createMachine(
    {
      id: 'wai-aria-tabs',
      context,
      initial: activeTab,
      on: events,
      states,
    },
    {
      actions: {
        activate: assign((context, event) => {
          if (!tabs.includes(event.type)) return;
          for (const tab in context) {
            const isSelected = event.type === tab;
            context[tab].focus.tabindex = isSelected ? 0 : -1;
            context[tab].aria.selected = isSelected;
            context[tab].aria.expanded = isSelected;
          }
          return context;
        }),
      },
    }
  );
}

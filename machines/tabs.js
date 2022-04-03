import { createMachine } from 'xstate';

/**
 * @param {string[]} tabs - list of tabs
 * @param {string} [activeTab] - initially active tab (defaults to the first tab in the given list)
 */
export default function createTabsMachine(tabs, activeTab) {
  if (tabs.length === 0) return;
  if (!activeTab || !tabs.includes(activeTab)) activeTab = tabs[0];

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

  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];

    events[tab] = `${tab}.focused`;

    states[tab] = {
      id: tab,
      initial: 'blurred',
      on: {
        CLICK: '.focused',
      },
      states: {
        focused: {
          on: {
            ArrowRight: `#${getTabAfter(tab)}.focused`,
            ArrowLeft: `#${getTabBefore(tab)}.focused`,
            Home: `#${getFirstTab()}.focused`,
            End: `#${getLastTab()}.focused`,
            BLUR: 'blurred',
          },
        },
        blurred: {},
      },
    };
  }

  return createMachine({
    id: 'wai-aria-tabs',
    initial: activeTab,
    on: events,
    states,
  });
}

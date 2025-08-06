// .vitepress/config.js
export default {
  // Site-level options
  base: '/x-logger/',
  title: '@shermant/logger',
  description:
    'A lightweight, chainable, and cross-platform logging solution for modern JavaScript applications',
  lastUpdated: true,
  cleanUrls: true,

  // Head configuration
  head: [
    ['link', { rel: 'icon', href: '/x-logger/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    [
      'meta',
      {
        name: 'og:title',
        content: '@shermant/logger | Lightweight TypeScript Logger',
      },
    ],
    ['meta', { name: 'og:site_name', content: '@shermant/logger' }],
    [
      'meta',
      { name: 'og:url', content: 'https://shermant.github.io/x-logger/' },
    ],
  ],

  // Search configuration
  search: {
    provider: 'local',
    options: {
      locales: {
        root: {
          translations: {
            button: {
              buttonText: 'Search docs',
              buttonAriaLabel: 'Search docs',
            },
            modal: {
              noResultsText: 'No results for',
              resetButtonTitle: 'Clear search',
              footer: {
                selectText: 'to select',
                navigateText: 'to navigate',
              },
            },
          },
        },
      },
    },
  },

  // Theme configuration
  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/basic' },
      { text: 'API Reference', link: '/usage' },
      { text: 'Roadmap', link: '/roadmap' },
      {
        text: 'Links',
        items: [
          {
            text: 'GitHub',
            link: 'https://github.com/ShermanTsang/Logger-TypeScript',
          },
          {
            text: 'NPM',
            link: 'https://www.npmjs.com/package/@shermant/logger',
          },
          {
            text: 'Issues',
            link: 'https://github.com/ShermanTsang/Logger-TypeScript/issues',
          },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Sherman Logger?', link: '/' },
          { text: 'Getting Started', link: '/basic' },
        ],
      },
      {
        text: 'Guide',
        items: [
          { text: 'API Reference', link: '/usage' },
          { text: 'Examples', link: '/examples' },
          { text: 'TypeScript Support', link: '/typescript' },
        ],
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Custom Types', link: '/custom-types' },
          { text: 'Stream Logging', link: '/stream-logging' },
          { text: 'Browser Support', link: '/browser-support' },
        ],
      },
      {
        text: 'Development',
        items: [
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'Contributing', link: '/contributing' },
          { text: 'Changelog', link: '/changelog' },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ShermanTsang/Logger-TypeScript',
      },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@shermant/logger' },
    ],

    footer: {
      message: 'Released under the ISC License.',
      copyright: 'Copyright © 2024 ShermanT',
    },

    editLink: {
      pattern:
        'https://github.com/ShermanTsang/Logger-TypeScript/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
    },

    outline: {
      level: [2, 3],
      label: 'Page Contents',
    },

    returnToTopLabel: 'Return to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Appearance',
    lightModeSwitchTitle: 'Switch to light theme',
    darkModeSwitchTitle: 'Switch to dark theme',
  },

  // Markdown configuration
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
    config: (_md) => {
      // Add custom markdown plugins if needed
    },
  },

  // Build configuration
  vite: {
    define: {
      __VUE_OPTIONS_API__: false,
    },
    optimizeDeps: {
      include: ['vue'],
    },
  },
}

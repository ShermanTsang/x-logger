// .vitepress/config.js
export default {
  // site-level options
  base: '/x-logger/',
  title: '@shermant/logger',
  description: 'A lightweight logger tool',
  lastUpdated: true,
  search: {
    provider: 'local',
  },

  themeConfig: {
    nav: [
      { text: 'Index', link: '/index' },
      { text: 'Basic', link: '/basic' },
      { text: 'Usage', link: '/usage' },
      { text: 'Roadmap', link: '/roadmap' },
    ],
  },
}

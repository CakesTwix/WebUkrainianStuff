import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { emojiRender, defs, movePlugin } from "./configs/emoji";
import { codeberg } from '../icons'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ukrainian Stuff",
  description: "Сховище всякої інфи для українців",

  base: '/WebUkrainianStuff',
  lastUpdated: true,
  scrollOffset: 'header',
  cleanUrls: true,

  head: [
    [
      'link', 
      { 
        rel: 'icon',
        href: '/ukr_logo.png' 
      }
    ],
    [
      'meta',
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,viewport-fit=cover',
      },
    ],
    [
      'meta',
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'lack-translucent',
      },
    ],
  ],

  markdown: {
    emoji: { defs },
    config(md) {
      md.use(emojiRender);
      md.use(tabsMarkdownPlugin);
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: "/ukr_logo.png", width: 29, height: 24 },

    search: {
      provider: 'local',
      options: {
        detailedView: true,
        translations: {
          button: {
            buttonText: 'Пошук',
            buttonAriaLabel: 'Пошук'
          },
          modal: {
            displayDetails: 'Відобразити детальний список',
            noResultsText: 'Нічого не знайшли',
            resetButtonTitle: 'Скинути пошук',
            footer: {
              selectText: 'для вибору',
              selectKeyAriaLabel: 'enter',
              navigateText: 'для навігації',
              navigateUpKeyAriaLabel: 'стрілка вгору',
              navigateDownKeyAriaLabel: 'стрілка вниз',
              closeText: 'закрити',
              closeKeyAriaLabel: 'escape',
            },
          },
        },
      },
    },

  outline: {
      label: 'У цьому параграфі',
      level: 'deep',
  },

  docFooter: {
      prev: 'Попередня сторінка',
      next: 'Наступна сторінка',
  },

  lastUpdated: {
      text: 'Оновлено в',
      formatOptions: {
          dateStyle: 'full',
          timeStyle: 'medium'
      }
  },

  editLink: {
    pattern: 'https://github.com/CakesTwix/WebUkrainianStuff/edit/main/web/:path',
    text: 'Запропонувати зміни для цієї сторінки',
  },

    nav: [
      {
        text: "Сторінки",
        items: [
          { text: "⚡ Початок", link: "/pages/qs" },
          { text: "🌏 Сайти", link: "/pages/websites" },
          { text: "💾 Програми", link: "/pages/software" },
          { text: "🔑 Ліцензійне", link: "/pages/license" },
          { text: "🧩 Додаткове", link: "/pages/addons" },
          { text: "🖥 Selfhost", link: "/pages/selfhost" },
          { text: "🗣️ Спільноти", link: "/comms/anime/dub" },
          { text: "🗃️ Інше", link: "/pages/misc" },
        ],
      },
      { text: "Оновлення", link: "https://github.com/CakesTwix/WebUkrainianStuff/commits/main/" },
    ],

    sidebar: [
      { text: "⚡ Початок", link: "/pages/qs" },
      { text: "🌏 Сайти", link: "/pages/websites" },
      { text: "💾 Програми", link: "/pages/software" },
      { text: "🔑 Ліцензійне", link: "/pages/license" },
      { text: "🧩 Додаткове", link: "/pages/addons" },
      { text: "🖥 Selfhost", link: "/pages/selfhost" },
      { text: "🗃️ Інше", link: "/pages/misc" },
      {
        text: "🇯🇵 Аніме",
        items: [
          { text: "🔊 Дабери", link: "/comms/anime/dub" },
          { text: "🔇 Саби", link: "/comms/anime/sub" },
          { text: "📖 Ранобе", link: "/comms/anime/ranobe" },
        ],
      },
      {
        text: "🗣️ Спільноти",
        items: [
          { text: "🐘 Mastodon", link: "/comms/mastodon" },
          { text: "🟢 Matrix", link: "/comms/matrix" },
          { text: "💬 XMPP", link: "/comms/xmpp" },
          { text: "🎧 Інтернет-радіо", link: "/comms/internet-radio" },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CakesTwix/WebUkrainianStuff' },
      {
        icon: {
          svg: codeberg
        },
        link: 'https://codeberg.org/CakesTwix/WebUkrainianStuff',
      },
      { icon: 'mastodon', link: 'https://pl.m0e.space/CakesTwix' }
    ]
  }
})

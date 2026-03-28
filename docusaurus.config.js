// @ts-check
const { themes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Фотобанк — Документация',
  tagline: 'Система управления визуальным контентом',
  favicon: 'img/favicon.ico',

  url: 'https://photobank-docs.ru',
  baseUrl: '/',

  organizationName: 'RTU MIREA',
  projectName: 'photobank',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    localeConfigs: {
      ru: { label: 'Русский' },
      en: { label: 'English' },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/your-org/photobank/tree/main/',
          routeBasePath: '/docs',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/your-org/photobank/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Фотобанк',
        logo: {
          alt: 'Фотобанк Лого',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'developerSidebar',
            position: 'left',
            label: 'Разработчику',
          },
          {
            type: 'docSidebar',
            sidebarId: 'userSidebar',
            position: 'left',
            label: 'Пользователю',
          },
          { to: '/blog', label: 'Блог', position: 'left' },
          {
            href: 'https://github.com/your-org/photobank',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Документация',
            items: [
              { label: 'Разработчику', to: '/docs/developer/intro' },
              { label: 'Пользователю', to: '/docs/user/wiki/getting-started' },
            ],
          },
          {
            title: 'Сообщество',
            items: [
              { label: 'GitHub', href: 'https://github.com/your-org/photobank' },
            ],
          },
          {
            title: 'Дополнительно',
            items: [
              { label: 'Блог', to: '/blog' },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} РТУ МИРЭА. Все права защищены.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
        additionalLanguages: ['python', 'bash', 'json'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;

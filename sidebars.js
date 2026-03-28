// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  developerSidebar: [
    {
      type: 'category',
      label: 'Введение',
      link: { type: 'doc', id: 'developer/intro' },
      items: [],
    },
    {
      type: 'category',
      label: 'Архитектура',
      link: { type: 'doc', id: 'developer/architecture/overview' },
      items: [
        'developer/architecture/backend',
        'developer/architecture/frontend',
        'developer/architecture/api',
      ],
    },
    {
      type: 'category',
      label: 'Генерация документации',
      link: { type: 'doc', id: 'developer/docgen/intro' },
      items: [
        'developer/docgen/python-docstrings',
        'developer/docgen/react-jsdoc',
        'developer/docgen/docusaurus-integration',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      link: { type: 'doc', id: 'developer/api/overview' },
      items: [
        'developer/api/auth',
        'developer/api/images',
        'developer/api/favorites',
      ],
    },
    {
      type: 'category',
      label: 'Развёртывание',
      link: { type: 'doc', id: 'developer/deployment/intro' },
      items: [
        'developer/deployment/local',
        'developer/deployment/production',
      ],
    },
  ],

  userSidebar: [
    {
      type: 'category',
      label: 'Wiki',
      link: { type: 'doc', id: 'user/wiki/getting-started' },
      items: [
        'user/wiki/registration',
        'user/wiki/upload',
        'user/wiki/search',
        'user/wiki/favorites',
        'user/wiki/edit',
        'user/wiki/download',
      ],
    },
    {
      type: 'category',
      label: 'Частые вопросы',
      link: { type: 'doc', id: 'user/faq/general' },
      items: [
        'user/faq/account',
        'user/faq/images',
        'user/faq/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Руководства',
      link: { type: 'doc', id: 'user/guides/basics' },
      items: [
        'user/guides/advanced-search',
        'user/guides/collection-management',
      ],
    },
  ],
};

module.exports = sidebars;

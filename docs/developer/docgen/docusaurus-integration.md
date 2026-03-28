---
sidebar_position: 4
---

# Интеграция с Docusaurus

## Настройка плагинов

Для автоматической генерации документации из кода используйте плагины.

## Плагин для Python (docusaurus-plugin-pydantic)

```bash
pip install docusaurus-plugin-pydantic
```

В `docusaurus.config.js`:

```javascript
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
      },
    ],
  ],
  plugins: [
    [
      'docusaurus-plugin-pydantic',
      {
        inputDir: './backend',
        outputDir: './docs/developer/api',
      },
    ],
  ],
};
```

## Плагин для TypeScript (typedoc-plugin-docusaurus)

```bash
npm install typedoc typedoc-plugin-markdown
```

В `package.json`:

```json
{
  "scripts": {
    "docs:api": "typedoc src/ --plugin typedoc-plugin-markdown --out docs/developer/api"
  }
}
```

## Автоматическая генерация

Создайте скрипт `scripts/generate-docs.sh`:

```bash
#!/bin/bash

echo "Generating Python docs..."
sphinx-apidoc -o docs/source backend/
sphinx-build -b html docs/source docs/build/python

echo "Generating TypeScript docs..."
npx typedoc src/ --plugin typedoc-plugin-markdown --out docs/developer/api

echo "Done!"
```

## CI/CD интеграция

Для GitHub Actions создайте `.github/workflows/docs.yml`:

```yaml
name: Generate Documentation

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          pip install sphinx sphinx-rtd-theme
          npm install

      - name: Generate docs
        run: |
          sphinx-apidoc -o docs/source backend/
          npx typedoc src/ --plugin typedoc-plugin-markdown --out docs/developer/api

      - name: Build Docusaurus
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

## Структура выходных файлов

```
docs/
├── developer/
│   ├── api/
│   │   ├── README.md          # Автогенерированный
│   │   ├── modules.md         # Автогенерированный
│   │   └── interfaces/        # Автогенерированные
│   ├── docgen/
│   │   ├── intro.md           # Ручная
│   │   ├── python-docstrings.md
│   │   └── react-jsdoc.md
│   └── intro.md
└── user/
    └── wiki/
        └── getting-started.md
```

## Проверка генерации

Запустите локальный сервер для проверки:

```bash
npm run start
```

Откройте `http://localhost:3000/docs/developer/api` для просмотра сгенерированной документации.

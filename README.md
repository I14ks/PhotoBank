# Установка и запуск документации Docusaurus

## Предварительные требования

- Node.js 18 или выше
- npm или pnpm

## Установка

### Шаг 1: Установка зависимостей

```bash
npm install
```

### Шаг 2: Запуск dev-сервера

```bash
npm run start
```

Сервер запустится на `http://localhost:3000`

## Структура документации

```
PhotoBank/
├── docs/
│   ├── developer/           # Для разработчиков
│   │   ├── intro.md
│   │   ├── architecture/
│   │   │   ├── overview.md
│   │   │   ├── backend.md
│   │   │   └── frontend.md
│   │   ├── docgen/
│   │   │   ├── intro.md
│   │   │   ├── python-docstrings.md
│   │   │   ├── react-jsdoc.md
│   │   │   └── docusaurus-integration.md
│   │   ├── api/
│   │   │   ├── overview.md
│   │   │   └── auth.md
│   │   └── examples/
│   │       └── auth_module.py
│   └── user/                # Для пользователей
│       ├── wiki/
│       │   ├── getting-started.md
│       │   ├── registration.md
│       │   ├── upload.md
│       │   ├── search.md
│       │   ├── favorites.md
│       │   ├── edit.md
│       │   └── download.md
│       ├── faq/
│       │   ├── general.md
│       │   ├── account.md
│       │   ├── images.md
│       │   └── troubleshooting.md
│       └── guides/
│           ├── basics.md
│           ├── advanced-search.md
│           └── collection-management.md
├── src/
│   ├── css/
│   │   └── custom.css
│   └── pages/
│       └── index.tsx
├── static/
│   └── img/
│       └── logo.svg
├── docusaurus.config.js
├── sidebars.js
└── package-docs.json
```

## Сборка production-версии

```bash
npm run build
npm run serve
```

## Добавление новых страниц

### 1. Создайте файл в нужной папке

Для разработчика:
```bash
docs/developer/new-page.md
```

Для пользователя:
```bash
docs/user/wiki/new-feature.md
```

### 2. Добавьте в sidebar

Откройте `sidebars.js` и добавьте новую страницу:

```javascript
const sidebars = {
  developerSidebar: [
    // ...
    'developer/new-page',
  ],
  userSidebar: [
    // ...
    'user/wiki/new-feature',
  ],
};
```

### 3. Обновите документацию

Сохраните файл — Docusaurus автоматически обновит страницу.

## Стиль кода Python для примеров

В документации используется следующий стиль:

- **PEP 8** (базовый)
- **Длина строки**: 79 символов
- **Переменные**: однобуквенные
- **Комментарии**: только docstrings

Пример:
```python
def h(p: str) -> str:
    """Хеширует пароль."""
    return hashlib.sha256((p + SALT).encode()).hexdigest()
```

## Wiki-стиль для пользователей

Статьи для пользователей используют стиль MediaWiki/FANDOM:

- Заголовки с `[[id:anchor]]`
- Содержание с внутренними ссылками
- Вики-линки: `[[wiki/page|текст]]`
- Футер с категоризацией

## Поддержка

При возникновении проблем:

1. Проверьте `npm run clear`
2. Удалите `node_modules/` и переустановите
3. Проверьте консоль на ошибки


---
sidebar_position: 2
---

# Frontend архитектура

## React приложение

Frontend построен на **React 18** с использованием **TypeScript** для типизации.

### Компонентная структура

```
App
├── Header
│   ├── Logo
│   ├── SearchBar
│   ├── LanguageSelector
│   ├── ThemeSelector
│   └── UserMenu
├── HeroSection
├── PhotoGrid
│   └── PhotoCard (multiple)
├── Modals
│   ├── UploadModal
│   ├── AuthModal
│   ├── PhotoDetailModal
│   └── EditModal
└── Footer
```

### Состояние приложения

- **useState** — локальное состояние компонентов
- **useEffect** — побочные эффекты (API calls)
- **useCallback** — мемоизация функций
- **Context API** — глобальное состояние (язык, тема)

### Интерфейсы TypeScript

```typescript
interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  author: string;
  author_id: string;
  tags: string[];
  publishDate: string;
  isLiked: boolean;
}

interface User {
  username: string;
}
```

### Утилиты

- **cn()** — объединение классов (clsx + tailwind-merge)
- **useAppContext()** — доступ к контексту приложения
- **translations** — объект локализации
